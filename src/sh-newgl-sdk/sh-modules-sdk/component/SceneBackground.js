import { ThreeInstance } from "../activation/threeInit";

let textureloader = new THREE.TextureLoader();

let scene;

export class Background {

    constructor() {

        this._bgdata = null;

        // this.bg = null;

        // this.offset = new THREE.Vector3(0, 0, 0);

    }

    init(_config) {

        scene = ThreeInstance.getInstance().scene;

        this._bgdata = _config.background;

        // 使用 scene.background 之后，暂时无法对background进行offset调节
        // if (this._bgdata.offset) this.offset.y = this._bgdata.offset.y;

        if (this._bgdata.src) {

            this.setBackground(this._bgdata);

        }

    }

    setBackground = function (obj) {

        this._bgdata.type = obj.type;
        this._bgdata.src = obj.src;

        let self = this;

        switch (obj.type) {

            case "none":

                scene.background = null;

                video.pause();

                break;

            case "video":

                video.src = obj.src;

                video.oncanplay = function () {

                    let vtex = new THREE.VideoTexture(video);

                    scene.background = vtex;
                };

                video.play();

                break;

            case "image":

                let tex = textureloader.load(obj.src, function (result) {
                    scene.background = result;
                });

                video.pause();

                break;

        }


    };


    deleteBackground = function () {

        scene.background = null;
        video.pause()
        video.src = null

    }



    // debug
    debugTest(){}
    debug() {

        // 背景
        let folder_bg = ThreeInstance.getInstance().gui.addFolder("🌊 | 背景");
        folder_bg.open();
        let self = this;
        folder_bg
            .add(this, "debugTest")
            .name("使用‘无‘背景")
            .onChange(function (value) {
                self.setBackground({
                    type: "none",
                });
            });
    
        folder_bg
            .add(this, "debugTest")
            .name("使用远程视频")
            .onChange(function (value) {
                self.setBackground({
                    type: "video",
                    src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211209/shda22e281e.mp4", // 
                    // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211217/shdca9d8d99.mp4", // 宇宙
                    // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211207/shd97b63640.webm", // 天空云朵
                    // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211207/shd97b8f4df.webm", // 蓝天云朵
                    // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220120/she7ab6e061.webm", // 宇宙火星燃烧表面
                    // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220126/she98e5ea74.mp4", // 火星山脉沙尘天气
                    // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220302/shf4c7a3d04.mov", // 舞台光柱灯光
                });
            });
    
        folder_bg
            .add(this, "debugTest")
            .name("使用远程图片")
            .onChange(function (value) {
                self.setBackground({
                    type: "image",
                    src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220119/she7479f866.jpg",
                    // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/webeditor/20220119/ede747b454f.jpg", // 冬日美术馆
                    // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/webeditor/20220303/edf5342d6f7.jpg", // 宁波银行 皑皑雪山
                });
            });
    
        // folder_bg
        //     .add(this, "debugTest")
        //     .name("使用远程着色器")
        //     .onChange(function (value) {
        //         self.setBackground({
        //             type: "shader",
        //             src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220123/she8b2db9bc.glsl",
    
        //             // src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220123/she8b158d3f.glsl",
        //             tex0: '',
        //             tex1: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220123/LIFT-Mars_3D-illustration_1600x900.jpg',
        //         });
        //     });
    
    
        // folder_bg.add( Background, "deleteBackground").name("删除背景图片地址");
    
        // folder_bg.add(this, 'scale', 0, 10).step(0.01).name("调整大小").onChange(function (value) {
    
        //     self.bg.scale.set(value, value, value);
    
        // });
    
        // folder_bg.add(this.offset, 'y', -500, 2000).step(10).name("调整高低").onChange(function (value) {
    
        //     self.offset.y = value;
    
        //     self.syncPSR_byCamera(ThreeInstance.getInstance().camera);
    
        //     if (!self._bgdata.offset) {
        //         self._bgdata.offset = { x: 0, y: 0, z: 0 }
        //     }
    
        //     self._bgdata.offset.y = value;
    
        // });
    }

}


// let _bgdata;

let video = document.createElement("VIDEO");
video.setAttribute("crossorigin", "anonymous");
video.setAttribute("loop", "true");
video.muted = true;
video.style.display = "none";
document.body.appendChild(video);