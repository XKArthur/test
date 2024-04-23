import { ThreeInstance } from "../activation/threeInit";

const ANIM_NONE = 0;
const ANIM_TRACK = 1;
const ANIM_OPACITY_CYCLING = 2;
const ANIM_FLOATING_CYCLING = 3;
const ANIM_ROTATE_CYCLING = 4;

let gui;

export class Editor3 {

	constructor() {

		this._config = null;
		this._meshes = null;
		this.currentIndex = 0;

		this.isUpdating = false;

		this.stagemodels = [];

		
		this._testEnvmapMode = false;
		this._testEnvmapCombine = 0;
		this._testEnvmapReflectivity = 0.17;
		this._testBlending = 1;
		this._test_motion_opacity_cycling = false;
		this._testColor = 0xFFFFFF;
		this._testMetalness = 1.0;
		this._testRoughness = 0.13;
		this._testEnvMapIntensity = 0.13;

	}

	async init  (config) {

		this._config = config;
		this._meshes = this._config.meshes;
	
		if ( !ThreeInstance.getInstance().isNewScene ) {
	
			for (let i = 0; i < this._meshes.length; i++) {
				
				// _mesh 带有下划线代表这个是一个config中的配置项
				let _mesh = this._meshes[i];
	
				let fbx = await new Promise((res, rej) => {
	
					ThreeInstance.getInstance().fbxloader.load(_mesh.asset_model, function (result) {
	
						res(result);
	
					});
	
				});
	
				let diffuseMap = await new Promise((res, rej) => {
	
					ThreeInstance.getInstance().textureloader.load(_mesh.asset_textures.diffuse_map, function (result) {
	
						res(result);
	
					});
	
				});
	
				let mesh = fbx.children[0].clone();
				mesh.scale.set( 1, 1, 1 );

				// _temp用来存储一些编辑过程中的临时资料，不会带入config中
				mesh._temp = {};
				mesh._temp.map = diffuseMap;
				mesh._temp.map.anisotropy = 8;
		
				ThreeInstance.getInstance().cubemapInGroup.add(mesh);

				this._setMaterial(mesh, _mesh.material);
				this._setEnvMode(mesh, _mesh.material.reflect);
	
				// _mesh.material.reflect ? ThreeInstance.getInstance().cubemapExGroup.add(mesh) : ThreeInstance.getInstance().cubemapInGroup.add(mesh);
	
				mesh.motion = _mesh.motion;
				if (_mesh.motion.motion_type) this.isUpdating = true;
	
				this.stagemodels.push(mesh);
	
			}
	
		}
	
	}
	
	loadLocalModel(file) {

		var filename = file.name;
		var extension = filename.split(".").pop().toLowerCase();
	
		var reader = new FileReader();
	
		reader.addEventListener("progress", function (event) {
			var size = "(" + Math.floor(event.total / 1000) + " KB)";
			var progress = Math.floor((event.loaded / event.total) * 100) + "%";
	
			console.log("Loading", filename, size, progress);
		});
		
		let self = this;
		reader.addEventListener(
			"load",
			async function (event) {
	
				var contents = event.target.result;
	
				var result = new THREE.FBXLoader().parse(contents);
	
				let mesh = result.children[0].clone();
				mesh.scale.set( 1, 1, 1 );
				mesh.material = new THREE.MeshBasicMaterial({
					wireframe: true
				});
	
				let _mesh = {
					type: 'FBX', // [ FBX | GLB | GLTF ]
					asset_model_name: '',
					asset_model: '',
					asset_textures: {
						diffuse_map_name: '',
						diffuse_map: '',
					},
	
					material: {
						shading_model: 'shadeless', // [ shadeless | phong | pbr }
						color: "#ffffff",
					},
	
					motion: {
						motion_type: 0
					}
	
				};
	
				self._config.meshes.push(_mesh);
	
				ThreeInstance.getInstance().cubemapInGroup.add(mesh);
				self.stagemodels.push(mesh);
	
			},
			false
		);
	
		reader.readAsArrayBuffer(file);
	
	}

	loadLocalTexture(index, file) {

		let target = this.stagemodels[index];
	
		var imageUrl = URL.createObjectURL(file);
	
		ThreeInstance.getInstance().textureloader.load(imageUrl, function (result) {
	
			target._temp = {};
			target._temp.map = result;
			// target._temp.map.anisotropy = 8;
	
			target.material.map = target._temp.map;
			target.material.needsUpdate = true;
			target.material.wireframe = false;
	
		});
	
	
		// CONFIG UPDATE
		this._config.meshes[index].asset_textures.diffuse_map = imageUrl;
	
	}
	

	// 设置光照着色模式
	// 如果不走光照，则直接取材质纹理贴图颜色
	// 如果叠加光照，则采取Standard材质，走PBR流程着色
	UISetShadingMode(index, shadingMode) {
	
		let target = this.stagemodels[index];
		let _mesh = this._meshes[index];

		let _material;

		switch( shadingMode ) {

			case 'shadeless':

				_material = {
					shading_model: 'shadeless',
					color: '#ffffff'
				}

				break;


			case 'pbr': 

				_material = {
					shading_model: 'pbr',
					color: '#ffffff',
					metalness: 1.0,
					roughness: 0.125,
					envMapIntensity: 1,
					reflect: false,
				}

				break;

		}

		this._setMaterial( target, _material );


		// 写入CONFIG
		_mesh.material =_material;

	}


	// 是否接受环境反射叠加
	// 只有 PBR 材质才接收调节
	// 参数说明：
	// params.bUsingEnvmap : true / false
	UISetEnvironment(index, params) {

		let target = this.stagemodels[ index ];

		if( target && target.material.isMeshStandardMaterial ) {

			this._setEnvMode( target, params.bUsingEnvmap );


			// 写入CONFIG
			this._meshes[ index ].material.reflect = params.bUsingEnvmap;

			// 只要有一个物体需要反射，则开启 PMREM
			this._config.renderer.pmrem = false;

			for( let i = 0; i < this._meshes.length; i ++ ) {

				if( this._meshes[ i ].material.reflect ) {

					this._config.renderer.pmrem = true;

				}

			}

		}

	}


	// 设置材质颜色
	// 参数说明：
	// params.color 接收一个16进制数值代表颜色
	UISetMaterialColor(index, params) {

		let target = this.stagemodels[index];
		let _mesh = this._meshes[index];

		if( target ) {

			target.material.color.setHex( params.color );


			// 写入CONFIG
			_mesh.material.color = params.color;

		}

	}


	// 设置粗糙度
	// 参数说明：
	// params 里面是各项参数
	UISetMaterialProperty(index, params) {

		let target = this.stagemodels[index];
		let _mesh = this._meshes[index];

		if( target ) {

			target.material[ params.property ] = params.value;


			// 写入CONFIG
			_mesh.material[ params.property ] = params.value;
		}

	}

	
	
	_setMaterial(target, _material) {
	
		switch (_material.shading_model) {
	
			case 'shadeless':
	
				target.material 			= new THREE.MeshBasicMaterial();
	            target.material.color 		= new THREE.Color(0xFFFFFF);
				target.material.map 		= target._temp.map;
	            target.material.blending    = _material.blending || 1;
	            if( target.material.blending> 1 ) { 
	                target.material.opacity      = _material.opacity || 1;
	                target.material.transparent  = _material.transparent || false;
	                target.renderOrder = 1;
	            }
	
				break;


			case 'pbr':

				target.material 			= new THREE.MeshStandardMaterial();
				target.material.map 		=  target._temp.map;
				target.material.metalness 	= _material.metalness;
				target.material.roughness 	= _material.roughness;
				target.material.envMapIntensity = _material.envMapIntensity || 1;

				break;

	
			case 'phong':
	
				target.material 			= new THREE.MeshPhongMaterial();
	            target.material.color       = new THREE.Color(0xFFFFFF);
				target.material.map 		= target._temp.map;
				target.material.reflectivity= _material.reflectivity || 0.3;
				target.material.combine 	= _material.combine || 0;
	
				break;
	
		}
	
	}


	_setEnvMode(target, reflect) {

		if( reflect ) {

			target.material.envMap = ThreeInstance.getInstance().pmrem.cubeUVRenderTarget.texture;
			target.material.needsUpdate = true;

			target.parent.remove(target);
			ThreeInstance.getInstance().cubemapExGroup.add(target);

		} else {

			target.material.envMap = null;
			target.material.needsUpdate = true;

			target.parent.remove(target);
			ThreeInstance.getInstance().cubemapInGroup.add(target);

		}

	}


	
	
	// ⚠️该方法已过时，设置Phong材质是否采用环境贴图、环境混合方式
	setEnvmapMode(index, params) {
	
		let target = this.stagemodels[index];
	
		if (target) {
	
			// bUsingEnvmap为true，首先使用环境贴图，然后设置环境混合模式
			if (params.bUsingEnvmap) {
	
				let _material = {
					shading_model: 'phong',
					color: '#ffffff',
					reflect: true,
					reflectivity: 0.3,
					combine: 0,
					opacity: 1,
					transparent: true
				}
	
				this.changeMaterial(index, _material);
	
				target.parent.remove(target);
				ThreeInstance.getInstance().cubemapExGroup.add(target);
	
				switch (params.combineMode) {
	
					case 0:
						target.material.combine = THREE.MultiplyOperation;
						break;
	
					case 1:
						target.material.combine = THREE.MixOperation;
						break;
	
					case 2:
						target.material.combine = THREE.AddOperation;
						break;
				}
	
			} else {
	
				let _material = {
					shading_model: 'shadeless',
					color: '#ffffff',
					blending: 1,
					opacity: 1,
					transparent: false
				}
	
				this.changeMaterial(index, _material);
	
				target.parent.remove(target);
				ThreeInstance.getInstance().cubemapInGroup.add(target);
	
			}
	
	
			// CONFIG UPDATE
			this._config.meshes[index].material.reflect = params.bUsingEnvmap;
			this._config.meshes[index].material.combine = params.combineMode;
	
		}
	
	}
	
	// ⚠️该方法已过时
	changeMaterial(index, _material) {
	
		let target = this.stagemodels[index];
		let _mesh = this._meshes[index];
	
		if (target) {
	
			this._setMaterial(target, _material);
	
			_mesh.material = _material;
	
		}
	
	}
	
	// ⚠️该方法已过时，为了Phong材质的反射模式而引入，后续不再迭代 Phong 模式
	setCombineMode(index, value) {
	
		let target = this.stagemodels[index];
	
		if (target) {
	
			switch (value) {
	
				case 0:
					target.material.combine = THREE.MultiplyOperation;
					break;
	
				case 1:
					target.material.combine = THREE.MixOperation;
					break;
	
				case 2:
					target.material.combine = THREE.AddOperation;
					break;
			}
	
		}
	
		this._config.meshes[index].material.combine = value;
	
	}
	
	// ⚠️该方法已过时，为了设置材质的反射属性
	setReflectivity(index, value) {
	
		let target = this.stagemodels[index];
	
		if (target) {
			target.material.reflectivity = value;
			target.material.needsUpdate = true;
	
	
			// CONFIG UPDATE
			this._config.meshes[index].material.reflectivity = value;
	
		}
	
	}
	
	
	setBlendingMode(index, params) {
	
		let target = this.stagemodels[index];
	
		switch (params.blendingMode) {
	
			case 0:
				target.material.blending = THREE.NoBlending;
				break;
	
			case 1:
				target.material.blending = THREE.NormalBlending;
				break;
	
			case 2:
				target.material.blending = THREE.AdditiveBlending;
				target.material.transparent = true;
				target.renderOrder = 1;
				break;
	
			case 3:
				target.material.blending = THREE.SubtractiveBlending;
				target.material.transparent = true;
				target.renderOrder = 1;
				break;
	
			case 4:
				target.material.blending = THREE.MultiplyBlending;
				target.material.transparent = true;
				target.renderOrder = 1;
				break;
	
		}
	
		// CONFIG UPDATE
		this._config.meshes[index].material.blending = params.blendingMode;
		this._config.meshes[index].material.opacity = target.material.opacity = 1.0;
		this._config.meshes[index].material.transparent = target.material.transparent = true;
	
	}


	toggleReflectEnvmap( target, isReflect ) {

		target.parent.remove(target);

		// isReflect? ThreeInstance.getInstance().cubemapExGroup.add(target) : 

	}

	
	setMotion(index, params) {
	
		let target = this.stagemodels[index];
	
		switch (params.type) {
	
			// 材质透明度变化循环
			case ANIM_OPACITY_CYCLING:
	
				target.motion = _config.meshes[index].motion = {
					motion_type: params.type,
					motion_params: params.motion_params,
				};
	
				break;
	
		}
	
	}
	
	
	update(delta, frame) {
	
		for (let i = 0; i < this.stagemodels.length; i++) {
	
			let target = this.stagemodels[i];
	
			if (target.motion) {
	
				switch (target.motion.motion_type) {
	
					case ANIM_NONE:
						break;
	
					case ANIM_OPACITY_CYCLING:
						target.material.opacity = Math.sin(frame / target.motion.motion_params[0]) * target.motion.motion_params[1] + target.motion.motion_params[2];
						break;
	
					default:
						break;
	
				}
	
			}
	
		}
	
	}

	
	deleteMesh(index) {
	
		let target = this.stagemodels[index];
		target.parent.remove(target);
	
		this.stagemodels.splice(index, 1);
		this._meshes.splice(index,1);
	
	}
	
	
	
	getConfig () {

		ThreeInstance.getInstance().holoScreen.save();
		ThreeInstance.getInstance().posters.save();
		ThreeInstance.getInstance().lights.save();
		return ThreeInstance.getInstance()._config;
	
	}
	


	_testUsingPBR() {}
	_testUsingEnvmap() {}
	_testSetColor() {}

	
	
	// test debug
	debug(config) {
	
		gui = ThreeInstance.getInstance().gui.addFolder('🏜 | 模型混合模式与动画');
		gui.open();
	
		// gui.add(Editor3, '_print').onChange(function () { console.log(Editor3); });
	
	
		var dropdown = { index: 0 };
		var options = [0, 1, 2, 3];
		let self = this;
		gui.add(dropdown, "index").options(options).onChange(function (value) {
	
			self.currentIndex = value;
	
		});
	
		// gui.add(Editor3, "_delete").onChange(function () {
	
		// 	Editor3.deleteMesh(currentIndex);
	
		// });


		// 设置为 PBR 材质 
		gui.add(this, "_testUsingPBR").name("设置为PBR材质").onChange(function () {

			self.UISetShadingMode(self.currentIndex, 'pbr');

		})

		// 设置为接收环境光反射
		gui.add(this, "_testUsingEnvmap").name("设置为接收环境光反射").onChange(function () {

			self.UISetEnvironment(self.currentIndex, { bUsingEnvmap: true });

		})

        // 设置color颜色
        gui.addColor(this, "_testColor").onChange(function (value) {

            self.UISetMaterialColor(self.currentIndex, { color: value });

        });


        // 设置金属度
        gui.add(this, "_testMetalness", 0, 1).step(0.01).onChange( (value) => {

        	self.UISetMaterialProperty(self.currentIndex, { property:'metalness', value:value });

        });

		// 设置粗糙度
        gui.add(this, "_testRoughness", 0, 1).step(0.01).onChange( (value) => {

        	self.UISetMaterialProperty(self.currentIndex, { property:'roughness', value:value });

        });

		// 设置反射强度
        gui.add(this, "_testEnvMapIntensity", 0, 3).step(0.01).onChange( (value) => {

        	self.UISetMaterialProperty(self.currentIndex, { property:'envMapIntensity', value:value });

        });

	
	
		// 设置混合模式
		// gui.add(this, "_testBlending", 0, 4).step(1).name("改变blending模式").onChange(function (value) {
	
		// 	let params = {
		// 		blendingMode: value,
		// 	}
	
		// 	self.setBlendingMode(self.currentIndex, params);
	
		// })
	
	
		// gui.add(this, "_test_motion_opacity_cycling").name("增加动画：透明度循环").onChange(function (bool) {
	
		// 	let params = {
		// 		type: ANIM_OPACITY_CYCLING,
		// 		motion_params: [200, 0.4, 0.6],
		// 	}
	
		// 	self.setMotion(self.currentIndex, params);
	
		// })
	
		// gui.add(this, "isUpdating").name("开启动画").onChange(function (bool) {
		// 	self.isUpdating = bool;
		// })
	
	};
	
	
}