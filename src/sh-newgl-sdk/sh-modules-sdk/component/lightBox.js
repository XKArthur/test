import { ThreeInstance } from "../activation/threeInit";
export class LightBox {

    constructor() {

        this.srceens = [];
        this._lightBoxData = null;

        this.styleMap = null;
        this.screenMaterial = null;
        this.speed = 1
        this.canvas = document.createElement('canvas')
        this.canvas.style.top = 0
        this.canvas.style.left = 0
        this.canvas.style.position = 'absolute'
        this.ctx = this.canvas.getContext('2d')

        this.screen_map = ThreeInstance.getInstance().textureloader.load("https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220902/screen.jpg");

        this.styleMap = {
            'strip': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230203/sh1619ef677a/LightBox_strip.fbx',
                image: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/default-12x1.png',
                position: [0, 3, 0]
            },
            'cylinder': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230110/sh159dfa1f91/LightBox_cyclinder.fbx',
                image: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a3ab9e54/default-4x1.png',
                position: [0, 1, 1]
            },
            'longbox': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230110/sh159df2d68c/LightBox_rectanglar.fbx',
                image: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a3ab9e54/default-4x1.png',
                position: [0, 1, 2]
            },
            'ring': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a402ee61/LightBox_ring.fbx',
                image: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/default-15x1.png',
                position: [0, 1, 0]
            },
            'banner_01': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a36456d6/LightBox_banner_1.fbx',
                image: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/default-12x1.png',
                position: [0, 3, 0]
            },
            'cube': {
                asset: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a3a194e4/LightBox_cube.fbx',
                image: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20230111/sh15a3f1dd3d/default-1x1.png',
                position: [0, 3, 0]
            },
        }

    }

    init(config) {
        this._config = config
        this._lightBoxData = config.components.lightBox;

        if (this._lightBoxData?.instances?.length) {

            for (let i = 0; i < this._lightBoxData.instances.length; i++) {

                let obj = this._lightBoxData.instances[i];
                this.build(obj);

            }
        }
    }

    textCanvas(obj) {
        
        var item = this.getObjectByNameFromArray(this._lightBoxData.instances, obj.name);
        this.canvas.width && this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let width, height;

        switch (item.style) {
            case 'strip':
                width = 2400
                height = 200
                break
            case 'longbox':
                width = 800
                height = 200
                break
            case 'ring':
                width = 3000
                height = 200
                break
            case 'banner_01':
                width = 2400
                height = 200
                break
            case 'cube':
                width = 200
                height = 200
                break
            case 'cylinder':
                width = 800
                height = 200
                break
            default:
                width = 800;
                height = 200;
                break
        }
        
        this.canvas.width = width
        this.canvas.height = height
        
        var grd = this.ctx.createLinearGradient(0, 0, 0, 200)
        
        const cavW = this.canvas.width
        const cavH = this.canvas.height
        
        let fontSize = 40 + 'px';
        if(obj.textFont){
            fontSize = obj.textFont + 'px';
        }

        this.ctx.textBaseline= "middle";
        this.ctx.font = 'bold ' + fontSize + ' sans-serif'
        this.ctx.textAlign = 'center'

        switch (obj.textType) {

            case 0:
                // 背景色渐变
                grd.addColorStop(0.0, '#000000');
                grd.addColorStop(0.27, '#2B2B2B');
                grd.addColorStop(0.64, '#404040');
                grd.addColorStop(1.0, '#2D2D2D');

                this.ctx.fillStyle = grd;
                this.ctx.fillRect(0, 0, cavW, cavH);

                // 底层
                this.ctx.shadowColor = '#FFFFFF';
                this.ctx.shadowBlur = 10;

                // 上层
                this.ctx.fillStyle = '#FFFFFF'
                this.ctx.fillText(obj.text, cavW / 2, cavH / 2)
                break

            case 1:
                // 背景色渐变
                grd.addColorStop(0.0, '#D20000');
                grd.addColorStop(0.5, '#F93232');
                grd.addColorStop(1.0, '#E9682F');

                this.ctx.fillStyle = grd
                this.ctx.fillRect(0, 0, cavW, cavH)

                // 描边层
                this.ctx.lineWidth = 2
                this.ctx.strokeStyle = '#C8241B'
                this.ctx.strokeText(obj.text, cavW / 2, cavH / 2)

                // 底层
                this.ctx.fillStyle = '#C8241B'
                this.ctx.fillText(obj.text, cavW / 2, cavH / 2)

                // 上层
                this.ctx.fillStyle = '#FFFFFF'
                this.ctx.fillText(obj.text, cavW / 2, cavH / 2)
                break

            case 2:
                // 背景色渐变
                grd.addColorStop(0.0, '#001A94');
                grd.addColorStop(0.5, '#3B85FF');
                grd.addColorStop(1.0, '#003EAF');

                this.ctx.fillStyle = grd
                this.ctx.fillRect(0, 0, cavW, cavH)

                // 底层
                this.ctx.shadowColor = '#FFF'
                this.ctx.shadowBlur = 20

                // 上层
                this.ctx.fillStyle = '#FFFFFF'
                this.ctx.fillText(obj.text, cavW / 2, cavH / 2)
                break

            default:
                break
        }

        item.text = obj.text;
        item.textType = obj.textType
        item.textFont = obj.textFont
        
        var target = ThreeInstance.getInstance().objectsGroup.getObjectByName( obj.name );
        var tex = new THREE.CanvasTexture( this.canvas );

        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;

        target.material.uniforms.screenTex.value = tex;

    }

    add(data) {

        let item = {
            p: this.styleMap[data.style].position,
            s: [1, 1, 1],
            r: [0, 0, 0],
            ratio: [16, 9],
            style: data.style,
            text: '',
            textType: 0,
            showType: 0,
            textFont:80,
            // style: 'test',
            name: data.name,
            screen_format: "default", // [ default | image | video ]
            screen_src: "",
            speed: 1
        }

        if (!this._lightBoxData) {
            this._config.components.lightBox = {
                instances: []
            }
            this._lightBoxData = this._config.components.lightBox
        }

        this._lightBoxData.instances.push(item);
        this.build(item);
    }

    showType(obj) {
        var data = this.getObjectByNameFromArray(this._lightBoxData.instances, obj.name);
        data.showType = obj.showType
        if (obj.showType) {
            const item = {
                format: 'image',
                src: obj.screen_src,
                name: obj.name
            }

            obj.screen_src && this.set(item)
        } else {
            obj.text && this.textCanvas(obj)
        }
    }

    build(obj) {

        var screen_map = obj.screen_src ?
            ThreeInstance.getInstance().textureloader.load(obj.screen_src) :
            ThreeInstance.getInstance().textureloader.load(this.styleMap[obj.style].image);
        screen_map.wrapS = THREE.RepeatWrapping;
        screen_map.wrapT = THREE.RepeatWrapping;

        let screen, frame, light;

        let assetUrl = this.styleMap[obj.style].asset;

        ThreeInstance.getInstance().fbxloader.load(assetUrl, result => {

            // screen
            screen = result.getObjectByName('screen').clone();
            screen.material =  new LightBoxMaterial(screen_map, obj.speed);
            screen.name = obj.name;
            screen.position.set(obj.p[0], obj.p[1], obj.p[2]);
            screen.rotation.set(obj.r[0], obj.r[1], obj.r[2]);
            screen.scale.set(obj.s[0], obj.s[1], obj.s[2]);
            if (obj.visible === undefined) {
                obj.visible = true;
            }
            screen.visible = obj.visible ? true : false;
            screen.draggable = true;
            screen.isShader = true;
            
            this.speed = obj.speed
            this.isUpdating = true;

            // frame
            frame = result.getObjectByName('frame').clone();
            frame.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.4,
                metalness: 0.9,
                // envMap: ThreeInstance.getInstance().pmerm.cubeUVRenderTarget.texture
            });
            frame.rotation.set(0, 0,0);
            frame.name = 'frame';
            frame.scale.set(1, 1, 1);
            screen.add(frame);

            // lighting parts
            light = result.getObjectByName('light').clone();
            light.material = new THREE.MeshBasicMaterial();
            light.rotation.set(0, 0, 0);
            light.name = 'light';
            light.scale.set(1, 1, 1);
            screen.add(light);

            this.srceens.push(screen);
            ThreeInstance.getInstance().objectsGroup.add(screen);

            if (obj.showType) {
                const item = {
                    format: 'image',
                    src: obj.screen_src,
                    name: obj.name
                }
    
                obj.screen_src && this.set(item)
            } else {
                obj.text && this.textCanvas(obj)
            }



            // 整合

        })

    }


    PropSet(data) {
        var target = ThreeInstance.getInstance().objectsGroup.getObjectByName(data.name);
        console.log("PropSet", ThreeInstance.getInstance().objectsGroup)
        var item = this.getObjectByNameFromArray(this._lightBoxData.instances, data.name);
        // if(!item.recordRotate){
        //     item.recordRotate = new THREE.Vector3()
        // }
        switch (data.type) {
            case 'rotateY':
                // var quaternion = new THREE.Quaternion();
                // quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI * (data.val / 180))
                // target.setRotationFromQuaternion(quaternion)
                target.rotation.y = Math.PI * (data.val / 180);
                item.r[1] = Math.PI * data.val / 180
                // item.recordRotate.y += Math.PI * data.val / 180
                // target.rotateY(Math.PI * data.val / 180)
                break;
            case 'speed':
                item.speed = this.speed = data.val
                break;
            case 'scale':
                target.scale.set(data.val, data.val, data.val);
                item.s[0] = item.s[1] = item.s[2] = data.val
                break;

            default:
                break;
        }
    }


    // 每一帧刷新边框的shader动画
    update(frame) {
        for (let index = 0; index < this.srceens.length; index++) {
            const element = this.srceens[index];
            element.material.uniforms.u_time.value += (frame / 100) * this._lightBoxData.instances[index].speed;
            element.material.needsUpdate = true;
        }
        // this.srceens.forEach(e=>{
        //     e.material.uniforms.u_time.value += (frame / 100) * this._lightBoxData.instances[i].speed;
        //     e.material.needsUpdate = true;
        //     // target.material.uniforms.screenTex.value = tex
        // })
        // this.screenMaterial.uniforms.u_time.value += (frame / 100) * this.speed;
        // this.screenMaterial.needsUpdate = true;

    }


    del(obj) {

        var target = ThreeInstance.getInstance().objectsGroup.getObjectByName(obj.name);

        if (target) ThreeInstance.getInstance().objectsGroup.remove(target);

        target = null;
        for (let i = 0; i < this._lightBoxData.instances.length; i++) {
            if (this._lightBoxData.instances[i].name === obj.name) {
                this._lightBoxData.instances.splice(i, 1)
                this.srceens.splice(i,1)
                return
            }

        }

    }

    setVisible(obj) {
        var lightBox = ThreeInstance.getInstance().objectsGroup.getObjectByName(obj.name);
        var item = this.getObjectByNameFromArray(this._lightBoxData.instances, obj.name);
        if (lightBox) {
            lightBox.visible = obj.visible
            item.visible = obj.visible
        }

    }

    save() {
        if (this._lightBoxData) {
            console.log("lightboxSave")
            this._lightBoxData.instances.forEach(e => {
                var item = ThreeInstance.getInstance().objectsGroup.getObjectByName(e.name);
                e.visible = item.visible;
                e.p[0] = item.position.x;
                e.p[1] = item.position.y;
                e.p[2] = item.position.z

                e.s[0] = item.scale.x;
                e.s[1] = item.scale.y;
                e.s[2] = item.scale.z;

                e.r[0] = item.rotation.x;
                e.r[1] = item.rotation.y;
                e.r[2] = item.rotation.z;
            })
        }
    }

    // 设置轮播灯使用图片链接
    set(obj) {
        var lightBox = ThreeInstance.getInstance().objectsGroup.getObjectByName(obj.name);

        if (lightBox) {

            switch (obj.format) {

                case ('image'):

                    ThreeInstance.getInstance().textureloader.load(obj.src, function (result) {

                        let tex = result.clone();
                        tex.wrapS = THREE.RepeatWrapping;
                        tex.wrapT = THREE.RepeatWrapping;

                        lightBox.material.uniforms.screenTex.value = tex

                    });

                    break;

            }

            let item = this.getObjectByNameFromArray(this._lightBoxData.instances, obj.name);
            item.screen_format = obj.format;
            item.screen_src = obj.src;

        } else {
            setTimeout(() => {
                this.set(obj);
            }, 100);
        }


    }

    getObjectByNameFromArray(array, name) {

        for (let i = 0, l = array.length; i < l; i++) {

            if (array[i].name === name) {

                return array[i];

            }

        }

    }

    // 场景清空时
    clear(bool) {
        if (this.srceens.length) {
            this.srceens.forEach(e => {
                e.geometry && e.geometry.dispose();
                e.material && e.material.dispose();
                ThreeInstance.getInstance().objectsGroup.remove(e)
            });
            this.srceens = [];
        }
    };
}

class LightBoxMaterial extends THREE.ShaderMaterial {
    constructor(imageTexture, speed) {
        super();
        this.setValues({
            uniforms: {

                screenTex: {
                    value: imageTexture
                },
                speed: {
                    value: 10.0
                },
                u_time: {
                    value: 0.0
                },
                highlightColor: {
                    value: new THREE.Color('#FFFFFF')
                }
            },

            vertexShader: lightBox_vs,
            fragmentShader: lightBox_fs,

        });
    }
}

//+ mod(floor(u_time*speed),2.)
const lightBox_vs = `
	varying vec2 vUv;
    uniform float speed;
    uniform float u_time;
	void main() {
        float offset =fract(u_time) + mod(floor(u_time),2.) -1.;
        vUv.y = uv.y;
        vUv.x = uv.x+u_time;
		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
	}
`;

const lightBox_fs = `
      #ifdef GL_ES
      precision mediump float;
      #endif
      uniform sampler2D screenTex;
      uniform vec3 highlightColor;
      varying vec2 vUv;

      void main( void ) {

        vec3 color = texture2D( screenTex, vUv ).rgb;

        vec3 finalColor = color * highlightColor;

        gl_FragColor = vec4( finalColor, 1.0 );
      }
`;