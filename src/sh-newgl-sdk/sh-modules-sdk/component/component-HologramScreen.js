import { ThreeInstance } from "../activation/threeInit";

let styleChosen = 'planar_16x9';
let textureloader = new THREE.TextureLoader();


export class HologramScreen {

    constructor() {

        this._screenData = ThreeInstance.getInstance()._config.components.holo_screen;

        this.styleOptions = ['planar_16x9', 'curve_future_metal', 'curve_plank_wood', 'planar_scifi_looplighting', '16x9-curve', '20x10-planar', '26x10-planar', '30x10-curve', '40x10-planar'];
        this.styleMap = {
            // 1.0
            'planar_16x9': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220321/16x9-planar.fbx',
                ratio: [16, 9]
            },

            // 暂时不用了的
            '16x9-curve': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220321/16x9-curve.fbx',
                ratio: [16, 9]
            },
            '20x10-planar': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220414/20x10-planar-.fbx',
                ratio: [20, 10]
            },
            '26x10-planar': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220414/26x10-planar.fbx',
                ratio: [26, 10]
            },
            '30x10-curve': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220412/30x10-curve.fbx',
                ratio: [30, 10]
            },
            '40x10-planar': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220402/shfec13f01f/40x10-planar.fbx',
                ratio: [40, 10]
            },

            // 2.0 
            'curve_future_metal': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20221215/curve_frame_future_16x9.fbx',
                material: 'frameMetalMaterial',
                ratio: [16, 9]
            },
            "curve_plank_wood": {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20221215/curve_frame_wood_16x9_2.fbx',
                material: 'frameWoodMaterial',
                ratio: [16, 9]
            },
            "planar_scifi_looplighting": {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20221215/planar_frame_scifi_16x9.fbx',
                material: 'frameLoopLightingMaterial',
                ratio: [16, 9]
            },
        };

        this.screen = null;
        this.frame = null;
        this.frameMaterials = null;
        this.frameMetalMaterial = null;
        this.frameWoodMaterial = null;
        this.frameLoopLightingMaterial = null;
        this.isUpdating = false;

        this._scale = 1;
        this._rotateY = 0;
        this._url = 'http:..//';

        this.initMaterials();
    }

    init() {

        if (this._screenData.instances.length) {
            for (let i = 0; i < this._screenData.instances.length; i++) {
                this.build(this._screenData.instances[i]);
            }
        }else{
            this.add()
            this.screen.visible = false
        }
    }

    add() {

        let instance = {
            style: styleChosen,
            name: "",
            p: [0, 3.6, -1],
            s: [1, 1, 1],
            r: [0, 0, 0],
            visible: false,
            ratio: this.styleMap[styleChosen].ratio,
            screen_format: "image",
            screen_src: "",
            asset_model: this.styleMap[styleChosen].asset
        }

        this._screenData.instances.push(instance);

        this.build(instance);

    }

    initMaterials() {

        this.frameMetalMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.4,
            metalness: 0.9,
            envMap: ThreeInstance.getInstance().pmrem.cubeUVRenderTarget.texture
        });

        this.frameWoodMaterial = new THREE.MeshBasicMaterial({
            map: textureloader.load("https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20221215/wood-2.png")
        });

        this.frameLoopLightingMaterial = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_resolution: { value: new THREE.Vector2( 1200, 1200 ) },
            },
            vertexShader: common_vs,
            fragmentShader: frame_looping_lighting_fs,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        this.frameMaterials = {
            'frameMetalMaterial': this.frameMetalMaterial,
            'frameWoodMaterial': this.frameWoodMaterial,
            'frameLoopLightingMaterial': this.frameLoopLightingMaterial
        }
    }

    build(obj) {

        const screenMaterial = new THREE.MeshBasicMaterial({
            map: obj.screen_src ? textureloader.load(obj.screen_src) : textureloader.load("https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220902/screen.jpg")
        });

        let screen, frame;

        if( obj.style === "planar_16x9" ) {
            
            const screenGeometry = new THREE.PlaneBufferGeometry(6.4, 3.6);
            screen = new THREE.Mesh( screenGeometry, screenMaterial );

        } else {
                
            ThreeInstance.getInstance().fbxloader.load( obj.asset_model, result => {

                screen = result.getObjectByName('screen').clone();
                screen.material = screenMaterial;
                screen.position.set(obj.p[0], obj.p[1], obj.p[2]);
                screen.rotation.set(obj.r[0] * Math.PI / 180, obj.r[1] * Math.PI / 180, obj.r[2] * Math.PI / 180);
                screen.scale.set(obj.s[0], obj.s[1], obj.s[2]);
                // screen.visible = (obj.visible !== undefined) ? obj.visible : false;
                screen.name = "bigscreen";
                screen.draggable = true;

                frame = result.getObjectByName('frame').clone();
                frame.material = this.frameMaterials['frameLoopLightingMaterial'];
                frame.rotation.set( 0, 0, 0 )
                frame.scale.set( 1, 1, 1 );

                screen.add( frame );
                
                this.screen = screen;
                this.frame = frame;
                ThreeInstance.getInstance().objectsGroup.add(screen);

                this.isUpdating = true;
                
            })
        
        }

    }

    // 设置显示隐藏
    setVisible(bool) {
        this.screen.visible = bool;
        this._screenData.instances[0].visible = bool;
    }

    // 设置默认贴图
    setImage(data){
        this._screenData.instances[0].screen_src = data.src;
        this.screen.material.map = textureloader.load(data.src)
    }

    // 调节大屏幕的比例
    scale(value) {

        this._screenData.instances[0].s[0] = this._screenData.instances[0].s[1] = value;

        this.screen.scale.set(this._screenData.instances[0].s[0], this._screenData.instances[0].s[1], 1);

    }

    // 调节旋转
    rotate(axis, degree) {

        switch (axis) {

            case 'x':
                break;

            case 'y':

                this.screen.rotation.y = degree * Math.PI / 180;
                this._screenData.instances[0].r[1] = degree;

                break;

        }

    }

    save() {

        // 滑动调节时已经更新过了 旋转和缩放，所以这里只更新位置数据
        if (this.screen) {
            this._screenData.instances[0].p[0] = this.screen.position.x;
            this._screenData.instances[0].p[1] = this.screen.position.y;
            this._screenData.instances[0].p[2] = this.screen.position.z;

        }
    }

    update( frame ) {

        this.frameLoopLightingMaterial.uniforms.u_time.value = frame / 100;
        this.frameLoopLightingMaterial.needsUpdate = true;

    }

    testdebug() { }

    debug() {

        let folder_screen = ThreeInstance.getInstance().gui.addFolder("📺 | 大屏幕");
        folder_screen.open();

        let self = this;

        let dropdown = { name: 'planar_16x9' };

        folder_screen.add(dropdown, 'name').options(this.styleOptions).name('大屏幕样式').onChange(function (option) {

            styleChosen = option;

        });


        folder_screen.add(this, 'testdebug').name('放置大屏幕').onChange(function () {

            self.add();

        });

        folder_screen.add(this, '_scale', 0, 5).step(0.01).name('大屏幕缩放').onChange(function (value) {

            self.scale(value);

        });

        folder_screen.add(this, '_rotateY', -90, 90).step(3).name('大屏幕旋转').onChange(function (value) {

            self.rotate('y', value);

        });


        folder_screen.add(this, '_url').name("默认图片url").onChange(function (value) {

            self._url = value;

            console.log(this._url)

        });


        folder_screen.add(this, 'testdebug').name('放入灯箱').onChange(function (value) {

            ThreeInstance.getInstance().fbxloader.load( 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230106/LightBox_cyclinder.fbx', result => {
                
                // console.log( result );

                let mesh = result.getObjectByName('screen').clone();

                mesh.scale.set( 1, 1, 1 );

                console.log(mesh);

                ThreeInstance.getInstance().objectsGroup.add(mesh);

            })

        });

    }


}


const common_vs = `
	varying vec2 vUv;
	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`;

const frame_looping_lighting_fs = `
	#ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform float u_alpha;

    #define u_color_0 vec3(0.2);
    #define u_color_1 vec3(0.3);
    #define u_color_2 vec3(0.4);
    #define u_color_3 vec3(0.5);
    #define u_color_4 vec3(0.7);
    #define u_color_5 vec3(1.0);


    vec3 catmul_rom(vec3 p0, vec3 p1, vec3 p2, vec3 p3, float t)
    {
        return 0.5 * (
            (2.0 * p1) +
            (-p0 + p2) * t +
            (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t +
            (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t * t * t);
    }

    vec3 color_spline(float t, bool wrap)
    {
        vec3 color_0 = vec3(0.,0.,0.);
        vec3 color_1 = vec3(1.,0.,0.);
        vec3 color_2 = vec3(1.,0.4,0.);
        vec3 color_3 = vec3(1.,0.8,0.);
        vec3 color_4 = vec3(1.,1.,0.);
        vec3 color_5 = vec3(1.,1.,1.);
        
        color_0 = u_color_0;
        color_1 = u_color_1;
        color_2 = u_color_2;
        color_3 = u_color_3;
        color_4 = u_color_4;
        color_5 = u_color_5;

        
        t = clamp(t, 0.0, 1.0);
        
        const int s = 12;
        
        vec3 p[s];
        p[1] = color_0;
        p[2] = color_1;
        p[3] = color_2;
        p[4] = color_3;
        p[5] = color_4;
        p[6] = color_5;
        p[7] = color_4;
        p[8] = color_3;
        p[9] = color_2;
        p[10] = color_1;
        p[11] = color_0;

        
        p[0] = p[s-2];
        p[s-1] = p[1];
        
        
        // map t (0.0 to 1.0) to distance down the spline
        float m = float(s) - 2.0;
        
        if (wrap)
            m = float(s) - 1.0;
        
        float d = -5. + (m + 5.) * t;
        
        // get the base index and t value
        int b = int(d);
        float dt = d - floor(d);
        
        //return catmul_rom(p[b-1], p[b], p[b+1], p[b+2], dt);
        
        // hack: webgl doesn't allow "non-constant" indices...
        for (int i = 1; i != s; ++i)
        {
            if (i == b)
                return catmul_rom(p[i-1], p[i], p[i+1], p[i+2], dt);
        }
        
        return vec3(0.2);
    }

    void main()
    {
        vec2 st = gl_FragCoord.xy / u_resolution;
        vec2 translate = vec2(fract( u_time * -0.1),cos(u_time));
        st *= 0.3;
        st -= translate - 1.;
        
        vec3 color = color_spline( st.x, true);
        
        gl_FragColor = vec4(color, 1.);
    }
`;