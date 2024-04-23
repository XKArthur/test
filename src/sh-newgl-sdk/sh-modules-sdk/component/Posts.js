import { ThreeInstance } from "../activation/threeInit";
import { EffectComposer } from "../libs/postprocessing/EffectComposer";
import { OutlinePass } from "../libs/postprocessing/OutlinePass";
import { RenderPass } from "../libs/postprocessing/RenderPass";
import { ShaderPass } from "../libs/postprocessing/ShaderPass";
import { SMAAPass } from "../libs/postprocessing/SMAAPass";
import { UnrealBloomPass } from "../libs/postprocessing/UnrealBloomPass";

import { FXAAShader } from "../libs/shaders/FXAAShader";

export class Posts {

	constructor() {

		this._postData = null;

		this.bComposing = false;
		this.composer = null;

		this.outlinePass = null;
		this.bloomPass = null;
		this.fxaaPass = null;
		this.smaaPass = null;

	}

	init(config) {

		this._rendererData = config.renderer;
		this._postData = config.postprocessing;

		this.composer = new EffectComposer(ThreeInstance.getInstance().renderer);
		// this.composer.setPixelRatio(2);

		const renderPass = new RenderPass(ThreeInstance.getInstance().scene, ThreeInstance.getInstance().camera);

		this.composer.addPass(renderPass);

	}


	togglePostProcessing(bool) {
		console.log("togglePostProcessing",bool)
		this.bComposing = this._rendererData.post_processing = bool;
	}

	setBloom(bool) {
		console.log("setBloom",bool)
		this._postData.bloom.use = bool
	}

	setBloomstrength(data) {
		console.log("setBloomstrength",data)
		switch (data.type) {
			case 'threshold':
				this.bloomPass.threshold = this._postData.bloom.threshold = Number(data.value);
				break;
			case 'strength':
				this.bloomPass.strength = this._postData.bloom.strength = Number(data.value);
				break;
			case 'radius':
				this.bloomPass.radius = this._postData.bloom.radius = Number(data.value);
				break;

			default:
				break;
		}

	}


	use_outline() {

		this.outlinePass = new OutlinePass(new THREE.Vector2(ThreeInstance.getInstance().W, ThreeInstance.getInstance().H), ThreeInstance.getInstance().scene, ThreeInstance.getInstance().camera);
		this.composer.addPass(this.outlinePass);

	}


	use_bloom() {

		this.bloomPass = new UnrealBloomPass(new THREE.Vector2(ThreeInstance.getInstance().W, ThreeInstance.getInstance().H), this._postData.bloom.strength, this._postData.bloom.radius, this._postData.bloom.threshold);
		this.composer.addPass(this.bloomPass);

	}



	use_FXAA() {

		this.fxaaPass = new ShaderPass(FXAAShader);
		this.fxaaPass.material.uniforms['resolution'].value.x = 1 / (ThreeInstance.getInstance().W * 2);
		this.fxaaPass.material.uniforms['resolution'].value.y = 1 / (ThreeInstance.getInstance().H * 2);

		this.composer.addPass(this.fxaaPass);

	}

	use_SMAA() {

		this.smaaPass = new SMAAPass(ThreeInstance.getInstance().W, ThreeInstance.getInstance().H);
		this.composer.addPass(this.smaaPass);

	}




	// DEBUG ---------------------------------------------
	test() { }
	debug() {

		let folder = ThreeInstance.getInstance().gui.addFolder("💦 | 后处理");
		folder.open();

		let self = this;

		// 开启关闭后处理
		folder.add(this, 'bComposing').name("开启后处理").onChange((value) => {

			this.togglePostProcessing(value);

		});



		// 测试移除某个处理
		// folder.add( this, 'test' ).onChange( function (value) {

		// 	self.remove_bloom();

		// });



		// ToneMapping
		// folder.add( this.this._postData.toneMapping, 'exposure', 0.1, 2 ).onChange( function ( value ) {

		// 	ThreeInstance.getInstance().renderer.toneMappingExposure = Math.pow( value, 4.0 );

		// } );


		// FXAA
		folder.add(this._postData.fxaa, 'use').name("开启FXAA");



		// Bloom后处理效果
		folder.add(this._postData.bloom, 'use').name("开启BLOOM");
		folder.add(this._postData.bloom, 'threshold', 0.0, 1.0).step(0.01).onChange(value => {

			this.bloomPass.threshold = this._postData.bloom.threshold = Number(value);

		});

		folder.add(this._postData.bloom, 'strength', 0.0, 1.0).step(0.01).onChange(value => {

			this.bloomPass.strength = this._postData.bloom.strength = Number(value);

		});

		folder.add(this._postData.bloom, 'radius', 0.0, 1.0).step(0.01).onChange(value => {

			this.bloomPass.radius = this._postData.bloom.radius = Number(value);

		});


	}

}






