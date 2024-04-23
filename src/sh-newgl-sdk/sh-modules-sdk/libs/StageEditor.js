// todo: config and _config 需要统一

import { ThreeInstance } from "../activation/threeInit";
import { PosterManager } from "../component/component-HoloPoster";
import { Lights } from "../component/Lights";

let textureloader = new THREE.TextureLoader();

let video = document.createElement("VIDEO");
video.setAttribute("crossorigin", "anonymous");
video.setAttribute("loop", "true");
video.style.display = "none";
document.body.appendChild(video);

let _config;
export class Editor{
    constructor(){
         this.textureloader = new THREE.TextureLoader();
         this.stageMesh = null;

         this.material_basic= new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });
    
        this.material_phong= new THREE.MeshPhongMaterial({
            color: 0xffffff,
            reflectivity: 0.17,
        });
    
        // background
        this.stageBackground= null;
    
        this.background_shader_mat= new THREE.ShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iResolution: { value: new THREE.Vector2(800, 450) },
                iChannel0: { value: this.textureloader.load('./resources/tex/random_2_64x64.jpg') },
                iChannel1: { value: this.textureloader.load('./resources/tex/random_2_64x64.jpg') },
            },
            vertexShader: common_vs,
            fragmentShader: common_fs,
        });
    
        this.background_basic_mat= new THREE.MeshBasicMaterial();
    
    }
    _init(config) {

        this._config = ThreeInstance.getInstance()._config;
    
        if (config.stage.path_model !== null) this.load(config);
    
    };

    init(config) {
        this._config = ThreeInstance.getInstance()._config;
    
        if (config.stage.path_model !== null) Editor.load(config);
    
    
        // 场景背景面板
    
        // ↓ 使用平面物体做背景
        let backgroundGeo = new THREE.PlaneBufferGeometry(9600, 5400, 1, 1);
        this.stageBackground = new THREE.Mesh( backgroundGeo, this.background_basic_mat );
        this.stageBackground.name = "scene background";
        this.stageBackground.visible = false;
        this.stageBackground.rotation.x = 0.025;
        this.stageBackground.position.y = 240;
        this.stageBackground.position.z = -3340;
        ThreeInstance.getInstance().scene.add(this.stageBackground);
    
    
        // ↓ 使用Sprite做背景
        // let map = textureloader.load("https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211130/shd738c8aa2.jpg");
        // const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
        // this.stageBackground = new THREE.Sprite( material );
        // this.stageBackground.scale.set( 9600, 5400, 1 )
        // this.stageBackground.position.set( 0, 240, -3200 )
        // window.shgl.scene.add( this.stageBackground );
    
    
    
        if (config.stage.background.type) {
            this.setBackground(config.stage.background);
        }
    
    
    };
}

/*

export const Editor = {
    stageMesh: null,

    material_basic: new THREE.MeshBasicMaterial({
        color: 0xffffff,
    }),

    material_phong: new THREE.MeshPhongMaterial({
        color: 0xffffff,
        reflectivity: 0.17,
    }),

    // background
    stageBackground: null,

    background_shader_mat: new THREE.ShaderMaterial({
        uniforms: {
            iTime: { value: 0.0 },
            iResolution: { value: new THREE.Vector2(800, 450) },
            iChannel0: { value: textureloader.load('./resources/tex/random_2_64x64.jpg') },
            iChannel1: { value: textureloader.load('./resources/tex/random_2_64x64.jpg') },
        },
        vertexShader: common_vs,
        fragmentShader: common_fs,
    }),

    background_basic_mat: new THREE.MeshBasicMaterial(),

    // debug
    _save: function () { },

    _useBackgroundNone: function () { },
    _useRemoteVideoURL: function () { },
    _useRemoteImageURL: function () { },
    _useRemoteShaderURL: function () { },

    _deleteBgImage: function () { },

    _useLit: false,
    _testGLTF: function () { },
    _testLocalShader: function () { }
}


Editor._init = function (config) {

    _config = window.shgl._config;

    if (config.stage.path_model !== null) Editor.load(config);

};

Editor.init = function (config) {
    _config = window.shgl._config;

    if (config.stage.path_model !== null) Editor.load(config);


    // 场景背景面板

    // ↓ 使用平面物体做背景
    let backgroundGeo = new THREE.PlaneBufferGeometry(9600, 5400, 1, 1);
    this.stageBackground = new THREE.Mesh( backgroundGeo, this.background_basic_mat );
    this.stageBackground.name = "scene background";
    this.stageBackground.visible = false;
    this.stageBackground.rotation.x = 0.025;
    this.stageBackground.position.y = 240;
    this.stageBackground.position.z = -3340;
    window.shgl.scene.add(this.stageBackground);


    // ↓ 使用Sprite做背景
    // let map = textureloader.load("https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211130/shd738c8aa2.jpg");
    // const material = new THREE.SpriteMaterial( { map: map, color: 0xffffff } );
    // this.stageBackground = new THREE.Sprite( material );
    // this.stageBackground.scale.set( 9600, 5400, 1 )
    // this.stageBackground.position.set( 0, 240, -3200 )
    // window.shgl.scene.add( this.stageBackground );



    if (config.stage.background.type) {
        this.setBackground(config.stage.background);
    }


};

Editor.load = async function (config) {

    let fbx = await new Promise((res, rej) => {
        window.shgl.fbxloader.load(config.stage.path_model, function (result) {
            res(result);
        });
    });

    let tex = await new Promise((res, rej) => {
        window.shgl.textureloader.load(config.stage.path_tex, function (result) {
            res(result);
        });
    });

    this.material_phong.map = tex;
    this.material_basic.map = tex;

    this.stageMesh = fbx.children[0];

    switch (_config.stage.material.shading_model) {
        case "shadeless":
            this.stageMesh.material = this.material_basic;
            break;

        case "lit":
            this.stageMesh.material = this.material_phong;
            break;
    }

    this.setDiffuse(_config.stage.material.diffuse);
    this.setReflectivity(_config.stage.material.reflectivity);

    window.shgl.cubemapExGroup.add(this.stageMesh);
};

Editor.loadLocalModel = function (file) {

    var filename = file.name;
    var extension = filename.split(".").pop().toLowerCase();

    var reader = new FileReader();

    reader.addEventListener("progress", function (event) {
        var size = "(" + Math.floor(event.total / 1000).format() + " KB)";
        var progress = Math.floor((event.loaded / event.total) * 100) + "%";

        console.log("Loading", filename, size, progress);
    });

    reader.addEventListener(
        "load",
        async function (event) {

            var contents = event.target.result;


            var result = new THREE.FBXLoader().parse(contents);


            Editor.stageMesh = result.children[0];
            Editor.stageMesh.name = "stage";

            window.shgl.cubemapExGroup.add(Editor.stageMesh);

        },
        false
    );

    reader.readAsArrayBuffer(file);
};

Editor.loadLocalexture = function (file) {
    var userImage = file;
    var userImageURL = URL.createObjectURL(userImage);

    window.shgl.textureloader.setCrossOrigin("");
    var map = window.shgl.textureloader.load(userImageURL);

    Editor.material_phong.map = map;
    Editor.material_basic.map = map;

    Editor.stageMesh.material = Editor.material_basic;
    // Stage.model.material.needsUpdate = true;
};

Editor.clear = function () {
    console.log("length", window.shgl.objectsGroup.children.length);
    while (window.shgl.objectsGroup.children.length) {
        let obj = window.shgl.objectsGroup.children.pop(); //getObjectByName("stage");
        if (obj.type === "Mesh" || obj.type === "SkinnedMesh") {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
                obj.material.forEach((e) => {
                    e.dispose();
                    e.map && e.map.dispose();
                });
            } else {
                obj.material.dispose();
                obj.material.map && obj.material.map.dispose();
            }

            obj.parent.remove(obj);
        }
    }
    while (window.shgl.cubemapExGroup.children.length) {
        let obj = window.shgl.cubemapExGroup.children.pop(); //getObjectByName("stage");
        if (obj.type === "Mesh" || obj.type === "SkinnedMesh") {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
                obj.material.forEach((e) => {
                    e.dispose();
                    e.map && e.map.dispose();
                });
            } else {
                obj.material.dispose();
                obj.material.map && obj.material.map.dispose();
            }
            obj.parent.remove(obj);
        }
    }
};
Editor.delete = function () {
    if (this.stageMesh) {
        this.stageMesh.geometry.dispose();
        if (Array.isArray(this.stageMesh.material)) {
            this.stageMesh.material.forEach((e) => {
                e.dispose();
                e.map && e.map.dispose();
            });
        } else {
            this.stageMesh.material.dispose();
            this.stageMesh.material.map && this.stageMesh.material.map.dispose();
        }
        var group = window.shgl.scene.getObjectByName("stage");
        if (group) group.parent.remove(group);
    }
};

Editor.setLit = function (bool) {
    Editor.stageMesh
        ? (Editor.stageMesh.material = bool
            ? Editor.material_phong
            : Editor.material_basic)
        : "";

    _config.stage.material.shading_model = bool ? 'lit' : 'shadeless';
};

Editor.setDiffuse = function (val) {
    this.stageMesh?.material.color.set(val);
    _config.stage.material.diffuse = val;
};

Editor.setReflectivity = function (val) {
    this.material_phong.reflectivity = val;
    _config.stage.material.reflectivity = val;
};

Editor.setBackground = function (obj) {

    _config.stage.background.type = obj.type;
    _config.stage.background.src = obj.src;

    switch (obj.type) {
        case "none":
            Editor.stageBackground.visible = false;

            video.pause();

            break;

        case "video":
            video.src = obj.src;

            video.oncanplay = function () {
                let vtex = new THREE.VideoTexture(video);

                Editor.stageBackground.material = Editor.background_basic_mat;
                Editor.stageBackground.material.map = vtex;
                Editor.stageBackground.material.needsUpdate = true;

                Editor.stageBackground.visible = true;
            };

            video.play();

            break;

        case "image":
            let tex = window.shgl.textureloader.load(obj.src, function (result) {
                Editor.stageBackground.material = Editor.background_basic_mat;
                Editor.stageBackground.material.map = result;

                Editor.stageBackground.visible = true;
            });

            video.pause();

            break;

        case "shader":
            
            _config.stage.background.tex0 = obj.tex0;
            _config.stage.background.tex1 = obj.tex1;

            loadShaderFromFile(obj.src, function (text) {

                Editor.background_shader_mat.uniforms.iResolution.value = new THREE.Vector2(window.shgl.W, window.shgl.H);


                if( obj.tex0.length ) {
                    textureloader.load( obj.tex0, function( result ) {
                        Editor.background_shader_mat.uniforms.iChannel0.value = result;
                    });
                }

                if( obj.tex1.length ) {
                    textureloader.load( obj.tex1, function( result ) {
                        Editor.background_shader_mat.uniforms.iChannel1.value = result;
                    });
                }

                Editor.background_shader_mat.fragmentShader = text;
                Editor.background_shader_mat.needsUpdate = true;
                Editor.stageBackground.material = Editor.background_shader_mat;
                Editor.stageBackground.visible = true;
            });

            video.pause();

            break;
    }
};

Editor.deleteBackground = function () {
    Editor.stageBackground.material.map.dispose();
    Editor.stageBackground.material.map = null;
    Editor.stageBackground.material.needsUpdate = true;

    Editor.stageBackground.visible = false;
};

Editor.getConfig = function () {

    PosterManager.save();
    Lights.save();
    console.log("Editor.getConfig")
    return window.shgl._config;
};

Editor.update = function (delta, frame) {
    // background shader material
    this.background_shader_mat.uniforms.iTime.value = frame / 100;
};

// DEBUG ----------------------------------------------------------------

Editor.debug = function (config) {


    let folder = window.shgl.gui.addFolder('🏜 | 模型数据');
    folder.open();

    folder.add(Editor, '_testGLTF').onChange(function () {

        window.shgl.gltfloader.load('./resources/models/atom_shopping_handbag/scene.gltf', function (result) {

            // console.log( result )

            let obj = result.scene;
            obj.scale.set(100, 100, 100);

            window.shgl.scene.add(obj);

        });

    });

    folder
        .add(Editor, "_useLit")
        .name("使用光照与反射")
        .onChange(function (value) {
            Editor.setLit(value);
        });

    // 颜色
    folder
        .addColor(window.shgl._config.stage.material, "diffuse")
        .onChange(function (value) {
            Editor.setDiffuse(value);
        });

    // 反射程度
    folder
        .add(window.shgl._config.stage.material, "reflectivity", 0.0, 1.0)
        .step(0.01)
        .name("反射比重")
        .onChange(function (value) {
            Editor.setReflectivity(value);
        });

    // ------------------
    // 背景
    let folder_bg = window.shgl.gui.addFolder("🌊 | 背景");
    folder_bg.close();

    folder_bg
        .add(Editor, "_useBackgroundNone")
        .name("使用‘无‘背景")
        .onChange(function (value) {
            Editor.setBackground({
                type: "none",
            });
        });

    folder_bg
        .add(Editor, "_useRemoteVideoURL")
        .name("使用远程视频")
        .onChange(function (value) {
            Editor.setBackground({
                type: "video",
                // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211209/shda22e281e.mp4", // 
                // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211217/shdca9d8d99.mp4", // 宇宙
                // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211207/shd97b63640.webm", // 天空云朵
                // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211207/shd97b8f4df.webm", // 蓝天云朵
                // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220120/she7ab6e061.webm", // 宇宙火星燃烧表面
                // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220126/she98e5ea74.mp4", // 火星山脉沙尘天气
                src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220228/%E6%91%84%E5%9B%BE%E7%BD%91_video_36731.mp4", // 宇宙
            });
        });

    folder_bg
        .add(Editor, "_useRemoteImageURL")
        .name("使用远程图片")
        .onChange(function (value) {
            Editor.setBackground({
                type: "image",
                src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220119/she7479f866.jpg",
            });
        });

    folder_bg
        .add(Editor, "_useRemoteShaderURL")
        .name("使用远程着色器")
        .onChange(function (value) {
            Editor.setBackground({
                type: "shader",
                src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220123/she8b2db9bc.glsl",

                // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220123/she8b158d3f.glsl",
                tex0: '',
                tex1: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220123/LIFT-Mars_3D-illustration_1600x900.jpg',
            });
        });


    folder_bg.add(Editor, "deleteBackground").name("删除背景图片地址");

    // window.shgl.fbxloader.load('./resources/test/model.fbx', function( result ){

    //  Editor.stageMesh = result.children[0];

    //  var map = window.shgl.textureloader.load('./resources/test/tex.png');

    //     Editor.material_phong.map = map;
    //     Editor.material_basic.map = map;

    //  Editor.stageMesh.material = Editor.material_basic;

    //  window.shgl.cubemapExGroup.add( Editor.stageMesh );

    // });
};

//

Number.prototype.format = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

// 加载外部shader脚本文件
function loadShaderFromFile(filename, onLoadShader) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            onLoadShader(request.responseText);
        }
    };

    request.open("GET", filename, true);
    request.send();
}*/

const common_vs = `

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const common_fs = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 vUv;

    void main(){       
        gl_FragColor = vec4( 0.0, .0, 1.0, 1.0);
    }
`;