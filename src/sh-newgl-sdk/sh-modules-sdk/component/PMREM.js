import { ThreeInstance } from "../activation/threeInit";

export class PMREM {
	constructor() {
		this.LOD_MIN = 4;
		this.EXTRA_LOD_SIGMA = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582];
		this.MAX_SAMPLES = 20;
		this.PHI = (1 + Math.sqrt(5)) / 2;
		this.INV_PHI = 1 / this.PHI;
		this._axisDirections = [
/*@__PURE__*/ new THREE.Vector3(1, 1, 1),
/*@__PURE__*/ new THREE.Vector3(- 1, 1, 1),
/*@__PURE__*/ new THREE.Vector3(1, 1, - 1),
/*@__PURE__*/ new THREE.Vector3(- 1, 1, - 1),
/*@__PURE__*/ new THREE.Vector3(0, this.PHI, this.INV_PHI),
/*@__PURE__*/ new THREE.Vector3(0, this.PHI, - this.INV_PHI),
/*@__PURE__*/ new THREE.Vector3(this.INV_PHI, 0,this.PHI),
/*@__PURE__*/ new THREE.Vector3(- this.INV_PHI, 0,this.PHI),
/*@__PURE__*/ new THREE.Vector3(this.PHI, this.INV_PHI, 0),
/*@__PURE__*/ new THREE.Vector3(- this.PHI, this.INV_PHI, 0)];

		this._flatCamera = new THREE.OrthographicCamera();

		this._lodMax = 9;
		this._lodPlane_0;
		this._unitSize = Math.pow(2, this._lodMax);

		this._blurShader;
		this._blurMeshes = [];

		this._pingPongRenderTarget;

		this._debug_plane; this._debug_sphere;

		this.isUsing = false;

		this.cubeUVRenderTarget = null;
		this._pingPongRenderTarget = null;

		this._lodPlanes = [];
		this._sizeLods = [];
		this._sigmas = [];

		this.renderer = null;
		this.cubemapRT = null;

	}
	init(renderer, cubemapRenderTarget) {

		this.isUsing = true;

		this.renderer = renderer;
		this.cubemapRT = cubemapRenderTarget;

		// _allocateTargets
		const width = 3 * Math.max(this._unitSize, 16 * 7);
		const height = 4 * this._unitSize - 32;

		const params = {
			magFilter: THREE.LinearFilter,
			minFilter: THREE.LinearFilter,
			generateMipmaps: false,
			type: THREE.HalfFloatType,
			format: THREE.RGBAFormat,
			encoding: THREE.LinearEncoding,
			depthBuffer: false
		};




		// _createRenderTarget
		this.cubeUVRenderTarget = new THREE.WebGLRenderTarget(width, height, params);
		this.cubeUVRenderTarget.texture.mapping = THREE.CubeUVReflectionMapping;
		this.cubeUVRenderTarget.texture.name = 'PMREM.cubeUv';
		this.cubeUVRenderTarget.scissorTest = true;

		this._pingPongRenderTarget = new THREE.WebGLRenderTarget(width, height, params);
		this._pingPongRenderTarget.texture.mapping = THREE.CubeUVReflectionMapping;
		this._pingPongRenderTarget.texture.name = 'PMREM.cubeUv';
		this._pingPongRenderTarget.scissorTest = true;



		let obj = this._createPlanes(this._lodMax);

		this._lodPlanes = obj.lodPlanes;
		this._sizeLods = obj.sizeLods;
		this._sigmas = obj.sigmas;



		// compile material
		this._blurShader = this._getBlurShader(this._lodMax, width, height);


		for (let i = 0; i < this._lodPlanes.length; i++) {

			let blurMesh = new THREE.Mesh(this._lodPlanes[i], this._blurShader);
			this._blurMeshes.push(blurMesh);

		}

		let t = this._blurMeshes;


		// 渲染第一张最清楚的环境UV
		let cubemapToCubeUVShader = this._getCubemapMaterial();
		this._lodPlane_0 = new THREE.Mesh(this._lodPlanes[0], cubemapToCubeUVShader);
		cubemapToCubeUVShader.uniforms['envMap'].value = this.cubemapRT.texture;

	}

	render() {

		this.textureToCubeUV();

		this.applyPMREM();

	}


	textureToCubeUV() {

		this._setViewport(this.cubeUVRenderTarget, 0, 0, 3 * this._unitSize, 2 * this._unitSize);

		this.renderer.setRenderTarget(this.cubeUVRenderTarget);
		this.renderer.render(this._lodPlane_0, this._flatCamera);

	}


	applyPMREM() {
		let autoClear = this.renderer.autoClear;
		//console.log('applyPMREM',autoClear,this.renderer.autoClear);
		this.renderer.autoClear = false;

		for (let i = 1; i < this._lodPlanes.length; i++) {

			const sigma = Math.sqrt(this._sigmas[i] * this._sigmas[i] - this._sigmas[i - 1] * this._sigmas[i - 1]);

			const poleAxis = this._axisDirections[(i - 1) % this._axisDirections.length];

			this.blur(this.cubeUVRenderTarget, i - 1, i, sigma, poleAxis);

		}

		this.renderer.autoClear = autoClear;
		//console.log('applyPMREM',this.renderer.autoClear,autoClear);

	}


	blur(cubeUVRenderTarget, lodIn, lodOut, sigma, poleAxis) {

		const pingPongRenderTarget = this._pingPongRenderTarget;

		this.halfBlur(
			cubeUVRenderTarget,
			pingPongRenderTarget,
			lodIn,
			lodOut,
			sigma,
			'latitudinal',
			poleAxis);

		this.halfBlur(
			pingPongRenderTarget,
			cubeUVRenderTarget,
			lodOut,
			lodOut,
			sigma,
			'longitudinal',
			poleAxis);

	}


	halfBlur(targetIn, targetOut, lodIn, lodOut, sigmaRadians, direction, poleAxis) {

		const renderer = this.renderer;
		const blurMaterial = this._blurShader;


		const STANDARD_DEVIATIONS = 3;

		// const blurMesh = new THREE.Mesh( this._lodPlanes[ lodOut ], blurMaterial );
		const blurMesh = this._blurMeshes[lodOut];
		const blurUniforms = blurMaterial.uniforms;



		const pixels = this._sizeLods[lodIn] - 1;
		const radiansPerPixel = isFinite(sigmaRadians) ? Math.PI / (2 * pixels) : 2 * Math.PI / (2 * this.MAX_SAMPLES - 1);
		const sigmaPixels = sigmaRadians / radiansPerPixel;
		const samples = isFinite(sigmaRadians) ? 1 + Math.floor(STANDARD_DEVIATIONS * sigmaPixels) : this.MAX_SAMPLES;

		if (samples > this.MAX_SAMPLES) {

			console.warn(`sigmaRadians, ${sigmaRadians}, is too large and will clip, as it requested ${samples} samples when the maximum is set to ${this.MAX_SAMPLES}`);

		}

		const weights = [];
		let sum = 0;

		for (let i = 0; i < this.MAX_SAMPLES; ++i) {

			const x = i / sigmaPixels;
			const weight = Math.exp(- x * x / 2);
			weights.push(weight);

			if (i === 0) {

				sum += weight;

			} else if (i < samples) {

				sum += 2 * weight;

			}

		}

		for (let i = 0; i < weights.length; i++) {

			weights[i] = weights[i] / sum;

		}

		blurUniforms['envMap'].value = targetIn.texture;
		blurUniforms['samples'].value = samples;
		blurUniforms['weights'].value = weights;
		blurUniforms['latitudinal'].value = direction === 'latitudinal';

		if (poleAxis) {

			blurUniforms['poleAxis'].value = poleAxis;

		}

		// const { _lodMax } = this;
		blurUniforms['dTheta'].value = radiansPerPixel;
		blurUniforms['mipInt'].value = this._lodMax - lodIn;

		const outputSize = this._sizeLods[lodOut];
		const x = 3 * outputSize * (lodOut > this._lodMax - this.LOD_MIN ? lodOut - this._lodMax + this.LOD_MIN : 0);
		const y = 4 * (this._unitSize - outputSize);

		this._setViewport(targetOut, x, y, 3 * outputSize, 2 * outputSize);
		renderer.setRenderTarget(targetOut);
		renderer.render(blurMesh, this._flatCamera);

	}


	_createPlanes(lodMax) {

		const lodPlanes = [];
		const sizeLods = [];
		const sigmas = [];

		let lod = lodMax;

		const totalLods = lodMax - this.LOD_MIN + 1 + this.EXTRA_LOD_SIGMA.length;

		for (let i = 0; i < totalLods; i++) {

			const sizeLod = Math.pow(2, lod);
			sizeLods.push(sizeLod);
			let sigma = 1.0 / sizeLod;

			if (i > lodMax - this.LOD_MIN) {

				sigma = this.EXTRA_LOD_SIGMA[i - lodMax + this.LOD_MIN - 1];

			} else if (i === 0) {

				sigma = 0;

			}

			sigmas.push(sigma);

			const texelSize = 1.0 / (sizeLod - 2);
			const min = - texelSize;
			const max = 1 + texelSize;
			const uv1 = [min, min, max, min, max, max, min, min, max, max, min, max];

			const cubeFaces = 6;
			const vertices = 6;
			const positionSize = 3;
			const uvSize = 2;
			const faceIndexSize = 1;

			const position = new Float32Array(positionSize * vertices * cubeFaces);
			const uv = new Float32Array(uvSize * vertices * cubeFaces);
			const faceIndex = new Float32Array(faceIndexSize * vertices * cubeFaces);

			for (let face = 0; face < cubeFaces; face++) {

				const x = (face % 3) * 2 / 3 - 1;
				const y = face > 2 ? 0 : - 1;
				const coordinates = [
					x, y, 0,
					x + 2 / 3, y, 0,
					x + 2 / 3, y + 1, 0,
					x, y, 0,
					x + 2 / 3, y + 1, 0,
					x, y + 1, 0
				];
				position.set(coordinates, positionSize * vertices * face);
				uv.set(uv1, uvSize * vertices * face);
				const fill = [face, face, face, face, face, face];
				faceIndex.set(fill, faceIndexSize * vertices * face);

			}

			const planes = new THREE.BufferGeometry();
			planes.setAttribute('position', new THREE.BufferAttribute(position, positionSize));
			planes.setAttribute('uv', new THREE.BufferAttribute(uv, uvSize));
			planes.setAttribute('faceIndex', new THREE.BufferAttribute(faceIndex, faceIndexSize));
			lodPlanes.push(planes);

			if (lod > this.LOD_MIN) {

				lod--;

			}

		}

		return { lodPlanes, sizeLods, sigmas };

	}

	_setViewport(target, x, y, width, height) {

		target.viewport.set(x, y, width, height);
		target.scissor.set(x, y, width, height);

	}

	_getCubemapMaterial() {

		return new THREE.ShaderMaterial({
	
			name: 'CubemapToCubeUV',
	
			uniforms: {
				'envMap': { value: null },
				'flipEnvMap': { value: -1 }, // -1, -1, 1
			},
	
			vertexShader: this._getCommonVertexShader(),
	
			fragmentShader: /* glsl */`
				
				precision mediump float;
				precision mediump int;
	
				uniform float flipEnvMap;
	
				uniform samplerCube envMap;
	
				varying vec3 vOutputDirection;
	
				void main() {
					gl_FragColor = textureCube( envMap, vec3( -1.0 * vOutputDirection.x, -1.0 * vOutputDirection.y, 1.0 * vOutputDirection.z ) );
				}
			`,
	
			blending: THREE.NoBlending,
			depthTest: false,
			depthWrite: false
	
		});
	
	}
	
	_getBlurShader(lodMax, width, height) {
	
		const weights = new Float32Array(this.MAX_SAMPLES);
		const poleAxis = new THREE.Vector3(0, 1, 0);
		const shaderMaterial = new THREE.ShaderMaterial({
	
			name: 'SphericalGaussianBlur',
	
			defines: {
				'n': this.MAX_SAMPLES,
				'CUBEUV_TEXEL_WIDTH': 1.0 / width,
				'CUBEUV_TEXEL_HEIGHT': 1.0 / height,
				'CUBEUV_MAX_MIP': `${lodMax}.0`,
			},
	
			uniforms: {
				'envMap': { value: null },
				'samples': { value: 1 },
				'weights': { value: weights },
				'latitudinal': { value: false },
				'dTheta': { value: 0 },
				'mipInt': { value: 0 },
				'poleAxis': { value: poleAxis }
			},
	
			vertexShader: this._getCommonVertexShader(),
	
			fragmentShader: /* glsl */`
	
				precision mediump float;
				precision mediump int;
	
				varying vec3 vOutputDirection;
	
				uniform sampler2D envMap;
				uniform int samples;
				uniform float weights[ n ];
				uniform bool latitudinal;
				uniform float dTheta;
				uniform float mipInt;
				uniform vec3 poleAxis;
	
				#define ENVMAP_TYPE_CUBE_UV
				#include <cube_uv_reflection_fragment>
	
				vec3 getSample( float theta, vec3 axis ) {
	
					float cosTheta = cos( theta );
					// Rodrigues' axis-angle rotation
					vec3 sampleDirection = vOutputDirection * cosTheta
						+ cross( axis, vOutputDirection ) * sin( theta )
						+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );
	
					return bilinearCubeUV( envMap, sampleDirection, mipInt );
	
				}
	
				void main() {
	
					vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );
	
					if ( all( equal( axis, vec3( 0.0 ) ) ) ) {
	
						axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );
	
					}
	
					axis = normalize( axis );
	
					gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
					gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );
	
					for ( int i = 1; i < n; i++ ) {
	
						if ( i >= samples ) {
	
							break;
	
						}
	
						float theta = dTheta * float( i );
						gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
						gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );
	
					}
	
				}
			`,
	
			blending: THREE.NoBlending,
			depthTest: false,
			depthWrite: false
	
		});
	
		return shaderMaterial;
	
	}
	
	_getCommonVertexShader() {
	
		return /* glsl */`
			precision mediump float;
			precision mediump int;
			attribute float faceIndex;
			varying vec3 vOutputDirection;
			// RH coordinate system; PMREM face-indexing convention
			vec3 getDirection( vec2 uv, float face ) {
				uv = 2.0 * uv - 1.0;
				vec3 direction = vec3( uv, 1.0 );
				if ( face == 0.0 ) {
					direction = direction.zyx; // ( 1, v, u ) pos x
				} else if ( face == 1.0 ) {
					direction = direction.xzy;
					direction.xz *= -1.0; // ( -u, 1, -v ) pos y
				} else if ( face == 2.0 ) {
					direction.x *= -1.0; // ( -u, v, 1 ) pos z
				} else if ( face == 3.0 ) {
					direction = direction.zyx;
					direction.xz *= -1.0; // ( -1, v, -u ) neg x
				} else if ( face == 4.0 ) {
					direction = direction.xzy;
					direction.xy *= -1.0; // ( -u, -1, v ) neg y
				} else if ( face == 5.0 ) {
					direction.z *= -1.0; // ( u, v, -1 ) neg z
				}
				return direction;
			}
			void main() {
				vOutputDirection = getDirection( uv, faceIndex );
				gl_Position = vec4( position, 1.0 );
			}
		`;
	
	}
	
	
	
	
	// --- DEBUG ---
	
	_use() {
	
		// this.render();
		this.isUsing = true;
	
	}
	
	
	_addTestPlane() {
	
		// test plane
		let debug_geo = new THREE.PlaneBufferGeometry(4, 4);
		let debug_mat = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			// map: ldrCubeRenderTarget.texture
			// map: PMREM.cubeUVRenderTarget.texture
		});
	
		this._debug_plane = new THREE.Mesh(debug_geo, debug_mat);
		this._debug_plane.position.set(3, 2, 1);
		this._debug_plane.name = 'debug pmrem plane';
		this._debug_plane.renderOrder = 1;
	
		ThreeInstance.getInstance().cubemapExGroup.add(this._debug_plane);
	
	
	
		this._debug_sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 64, 64), new THREE.MeshStandardMaterial());
		this._debug_sphere.material = new THREE.MeshStandardMaterial({
			color: 0xffffff,
			metalness: 1.0,
			roughness: 0.0,
		});
		this._debug_sphere.position.set(-3, 2, 1);
		ThreeInstance.getInstance().cubemapExGroup.add(this._debug_sphere);
	
	
	}
	
	
	_testUsingTexture() {
	
		this._debug_plane.material.map = this.cubeUVRenderTarget.texture;
		this._debug_plane.material.needsUpdate = true;
	
	
		this._debug_sphere.material.envMap = this.cubeUVRenderTarget.texture;
	
		// let groundgeo = new THREE.PlaneBufferGeometry( 1500, 1500 );
		// let groundmat = new THREE.MeshStandardMaterial({
		// 	color: 0xffffff,
		// 	metalness: 0.8,
		// 	roughness: 0.0,
		// 	envMap: this.cubeUVRenderTarget.texture
		// });
	
		// let ground = new THREE.Mesh( groundgeo, groundmat );
		// ground.rotation.x = - Math.PI / 2;
	
	
	
		// ThreeInstance.getInstance().cubemapExGroup.add( _debug_plane );
	
	}
	
	
	debug() {
		let folder = ThreeInstance.getInstance().gui.addFolder("🌏 | PMREM");
		folder.open();
	
		folder.add(this, '_use');
		folder.add(this, '_addTestPlane');
		folder.add(this, '_testUsingTexture');
	}
	

}
