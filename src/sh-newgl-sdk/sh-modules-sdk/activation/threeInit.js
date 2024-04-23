
import { Editor3 } from "../libs/Editor";

import { Background } from "../component/SceneBackground";
import { HologramScreen } from "../component/component-HologramScreen";
import { PosterManager } from "../component/component-HoloPoster";
import { CameraControls } from "../component/CameraControls";
import { Controller } from "../component/Controller";
import { Lights } from "../component/Lights";
import { Helper } from "../component/Helper";
import { Posts } from "../component/Posts";
import { PMREM } from "../component/PMREM";


import { init_vertex_shader, matte_keyer_fragment_shader, composite_fragment_shader, roleshadow_fragment_shader, chromaKey_fragment_shader } from "../libs/code";
import { Props } from "../component/Props";
import { LightBox } from "../component/lightBox";


export var ThreeInstance = function () {
	this.threeInstance = null;
}

ThreeInstance.getInstance = function () {
	if (!this.threeInstance) {
		this.threeInstance = new ThreeManager();
		console.log("threeInstance.getInstance", this.threeInstance);
	}
	return this.threeInstance
}
ThreeInstance.getConfig = function(){
	if(this.threeInstance.editor) return this.threeInstance.editor.getConfig()
}
ThreeInstance.destory = function () {
	if (this.threeInstance) {
		this.threeInstance.clear();
		delete this.threeInstance;
		console.log("删除场景", this.threeInstance)
		this.threeInstance = null;
		//this.threeInstance = new threeInstance();
	}
}

class ThreeManager {
	constructor() {
		this.pixel_ratio = 2;
		this.scale = 1
	}
	creat(obj) {

		// Basic
		this.renderer = null; this.camera = null; this.scene = null

		// Controls and Debug
		this.stats = null, 
		this.gui = null, 
		this.controls = null,
		this.animation = null;
		

		// Environments
		this.cubeCamera = null, this.pmremGenerator = null, this.cubeRenderTarget = null,

		// Lights
		this.spotLight = null, this.ambientLight = null, this.hemiLight = null, this.pointLight = null;

		// Post processings
		this.composer = null, this.outlinePass = null;
		this.ambientIntensity = 1;

		const guidom = document.getElementById('shglgui')
		if (guidom) {
			guidom.remove()
		}

		this.W = document.querySelector("#" + obj.renderViewId).offsetWidth;
		this.H = document.querySelector("#" + obj.renderViewId).offsetHeight;
		const glcanvasid = 'glcanvasid001'

		console.log('glcanvasid',this.W)
		this.realW = 1280;
        this.realH = 720;

		// LOADERS
		this.textureloader = new THREE.TextureLoader();
		this.fbxloader = new THREE.FBXLoader();
		this.gltfloader = new THREE.GLTFLoader();


		// LAYERS AND GROUPS
		this.objectsGroup = new THREE.Group(); // objectsGroup 用来放置posters等可配置组件
		this.cubemapExGroup = new THREE.Group(); // 需要添加上反射的东西，放在这个组里，比如接受环境反射的地面
		this.cubemapInGroup = new THREE.Group(); // 无需添加环境反射，可以放在这里，比如除了地面意外周围的房间
		this.objectsGroup.name = "Manipulating objects";
		this.cubemapExGroup.name = "CubeMap Excluded";
		this.cubemapInGroup.name = "CubeMap Included";



		// MOUSE CONTROLS
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		let selectedObjects = [];
		let tweakingObj = null;


		// TIME CONTROL
		this.clock = new THREE.Clock();
		this.stageframe = 0;


		this.params = {
			_save: function () { },
			_delete: function () { },
			_clear: function () { },
		};


		// CONFIG
		this._config = obj.config ? obj.config : {

			version: '0.4',

			renderer: {

				pixel_ratio: this.pixel_ratio,

				encoding: "linear",

				lit: false,

				pmrem: false,

				post_processing: false

			},

			camera: {

				camera_near: {
					x: 0,
					y: 2,
					z: 3.2,
					lookAt_x: 0,
					lookAt_y: 2,
					lookAt_z: 0,
				},

				camera_far: {
					x: 0,
					y: 1.6,
					z: 8.8,
					lookAt_x: 0,
					lookAt_y: 1.8,
					lookAt_z: 0,
				},

			},

			meshes: [],

			background: {
				type: "none",
				src: "",
				offset: {
					x: 0,
					y: 0,
					z: 0
				}
			},

			lights: {

				ambient_light: {
					intensity: 1.2,
					color: "#ffffff"
				},

				directional_lights: [],
				point_lights: [],
				spot_lights: []

			},

			postprocessing: {

				toneMapping: {
					use: false,
					exposure: 1
				},

				fxaa: {
					use: false,
				},

				bloom: {
					use: false,
					threshold: 0.56,
					strength: 0.12,
					radius: 0.62
				}

			},

			roleplane: {

				arrangement: [
					{
						direction: "horizontal",
						angle: 0,
						x: 0,
						y: 2.2,
						z: 0,
						s: 0.7
					}
				]

			},

			components: {

				holo_posters: {

					instances: []

				},

				holo_screen: {

					instances: []

				}

			},

		};

		this.renderViewId = obj.renderViewId;

		this.isNewScene = obj.config ? false : true;

	}

	init() {

		this.camera = new THREE.PerspectiveCamera(65, this.W / this.H, 0.01, 100);
		this.camera.position.set(
			this._config.camera.camera_far.x / 1, 
			this._config.camera.camera_far.y / 1, 
			this._config.camera.camera_far.z / 1
		);
		this.camera.lookAt(
			this._config.camera.camera_far.lookAt_x / 1, 
			this._config.camera.camera_far.lookAt_y / 1, 
			this._config.camera.camera_far.lookAt_z / 1
		);
		this.camera.updateMatrixWorld();
	


		// SCENE
		this.scene = new THREE.Scene();
		this.scene.add(this.objectsGroup);
		this.scene.add(this.cubemapExGroup);
		this.scene.add(this.cubemapInGroup);


		// RENDERER
		this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
		this.renderer.setPixelRatio(2);
		this.renderer.setSize(this.realW, this.realH);
		// this.renderer.outputEncoding = THREE.sRGBEncoding;


		// CUBE CAMERA
		this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 512, {
			format: THREE.RGBAFormat,
			minFilter: THREE.LinearFilter,
		});
		this.cubeCamera = new THREE.CubeCamera( 0.01, 100, this.cubeRenderTarget);
		this.cubeCamera.position.set( 
			this._config.camera.camera_far.x / 1, 
			this._config.camera.camera_far.y / 1 * -1, 
			this._config.camera.camera_far.z / 1 
		);
		this.cubeCamera.rotation.z = - Math.PI;





		// DOM
		const container = document.getElementById(this.renderViewId);
		let scale = this.W / (this.realW*this.pixel_ratio );
		this.scale = scale;
        container.innerHTML = "";
		container.appendChild(this.renderer.domElement);
		console.log("rendererResize",this.W,scale);
        this.renderer.domElement.style = "transform-origin:left top;transform:scale(" + scale.toString() + "," + scale.toString() + ");"


		// 状态
		this.stats = new Stats();


		/* 操控 */
		this.controls = new Controller();
		this.controls.init();
		// this.renderer.domElement.addEventListener('mousemove', this.controls.onMouseMove);
		// this.renderer.domElement.addEventListener('mousedown', this.controls.onMouseDown);
		// this.renderer.domElement.addEventListener('mouseup', this.controls.onMouseUp);
		// this.renderer.domElement.addEventListener('wheel', this.controls.onMouseScroll);
		
		//window.addEventListener('resize', this.rendererResize);


		// window.shgl._config = _config;
		// window.shgl.scene = scene;
		// window.shgl.camera = camera;
		// window.shgl.cubeRenderTarget = cubeRenderTarget;
		// window.shgl.cubeCamera = cubeCamera;
		// window.shgl.renderer = renderer;
		// window.shgl.controls = controls;
		// window.shgl.textureloader = textureloader;
		// window.shgl.fbxloader = fbxloader;
		// window.shgl.gltfloader = gltfloader;
		// window.shgl.pmremGenerator = pmremGenerator;
		// window.shgl.objectsGroup = objectsGroup;
		// window.shgl.cubemapExGroup = cubemapExGroup;
		// window.shgl.cubemapInGroup = cubemapInGroup;
		// window.shgl.composer 		= composer;
		//window.shgl.outlinePass = outlinePass;


		/* 预处理CubeUV环境 */
		this.pmrem = new PMREM();
		this.pmrem.init( this.renderer, this.cubeRenderTarget );

		/* 场景 */
		this.editor = new Editor3();
		this.editor.init(this._config)


		/* 背景 */
		this.background = new Background();
		this.background.init(this._config)


		/* 灯光环境 */
		this.lights = new Lights();
		this.lights.init(this._config);

		this.lightBox = new LightBox();
        this.lightBox.init(this._config)


		/* 机位 */
		///CameraControls.init(_config);
		this.cameraControls = new CameraControls();
		this.cameraControls.init(this._config);

		// this.props = new Props();
		// this.props.init()


		/* 后处理 */
		this.posts = new Posts();
		this.posts.init(this._config);
		this.posts.use_bloom();
		this.posts.use_FXAA();
		// this.posts.use_outline();


		/* 人物面片 辅助器 */
		this.helper = new Helper();
		this.helper.init(this._config)


		/* 道具 海报 */
		this.posters = new PosterManager();
		this.posters.init();


		/* 道具 大屏幕 */
		this.holoScreen = new HologramScreen();
		// this.holoScreen.init();



		//Controller.init();
		this.animate();


		if (1) {

			// CONTROLS
			// let orbit = new THREE.OrbitControls(this.camera, this.renderer.domElement);
			// orbit.target.set(0, 1.75, 0);

			// STATS
			container.appendChild(this.stats.dom);

			// GUI 					
			this.gui_All();
			// Editor.debug( _config );
			// this.editor.debug(this._config);
			// this.cameraControls.debug();
			// this.lights.debug();
			// this.helper.debug();
			this.holoScreen.debug();
			// this.posters.debug();
			// this.posts.debug();
			// this.background.debug();
			

			// this.pmrem.debug();
		}

	}

	gui_All() {

		let self = this;

		// GUI
		let gui = new dat.GUI({ width: 400 });
		gui.domElement.id = 'shglgui'
		gui.open();

		let folder = gui.addFolder("📦 | 项目");
		folder.open();
		// let folder = gui.addFolder("📦 | 项目");
		// folder.open();

		folder.add(this.params, '_save').name("保存当前config").onChange(function () {

			// this.editor.getConfig();

			console.log(self._config, self.scene);

		});

		// folder.add(params, '_delete').name("删除用户已上传模型贴图").onChange(function () {

		// 	Editor.delete()

		// });

		// folder.add(params, '_clear').name("清空当前场景所有内容").onChange(function () {

		// 	Editor.clear()

		// });

		this.gui = gui;

	}

	animate() {

		this.animation = requestAnimationFrame(this.animate.bind(this));

		this.delta = this.clock.getDelta();

		this.stageframe++;


		if (1) {
			// controls.update();
			this.stats.update();
		}

		if (this.cameraControls.isCameraIdling) {
			this.cameraControls.updateWaving(this.stageframe);
		}


		if (this.cameraControls.isCameraMoving) {
			this.cameraControls.updateMoving();
		}
		if (this.lightBox.isUpdating) {
            this.lightBox.update(this.delta, this.stageframe);
        }


		if (this.holoScreen.isUpdating) {
			this.holoScreen.update(this.stageframe);
		}


		if (this.editor.isUpdating) {
			this.editor.update(this.delta, this.stageframe);
		}


		this.posters.update(this.delta, this.stageframe);

		this.render();

	}

	render() {

		// render cube map
		if (this.cubeCamera !== undefined) {

			this.cubemapExGroup.visible = false;

			this.cubeCamera.update(this.renderer, this.scene);

		}

		this.cubemapExGroup.visible = true;

		if (this.posts.bComposing) {
			this.posts.composer.render();
		} else {
			this.renderer.setRenderTarget( null );
			this.renderer.clear();
			this.renderer.render(this.scene, this.camera);

		}


		if( this.pmrem.isUsing ) {
			this.pmrem.render();
		}

	}

	rendererResize(w, h) {
		const scale = w / (this.realW*this.pixel_ratio);
		this.scale = scale;
		console.log("rendererResize",w,scale);
		this.renderer?.setSize && this.renderer.setSize(this.realW, this.realH);
		this.renderer && (this.renderer.domElement.style = "transform-origin:left top;transform:scale(" + scale.toString() + "," + scale.toString() + ");")
		this.camera?.aspect && (this.camera.aspect = w / h);
		this.camera && this.camera.updateProjectionMatrix();
	
	}

}
























