import { ThreeInstance } from "../activation/threeInit";

export class PosterManager {

	constructor() {

		this._data = null;
		this.posters = [];

		// 海报样式
		this.currentSelectedStyle = "planar_16x9";

		// 海报模板序列
		this.posterTemplates = {
			"planar_16x9": {
				width: 5.76,
				height: 3.24
			},
			"planar_9x16": {
				width: 2.7,
				height: 4.8
			},
			"planar_1x1": {
				width: 3.6,
				height: 3.6				
			},
			"planar_4x1": {
				width: 3.2,
				height: 0.8
			},
			"customize": {},
		};

		this._url = 'http://...';

		this._scale = 1.0;
		this._rotateX = 0;
		this._rotateY = 0;

	}

	init() {

		this._data = ThreeInstance.getInstance()._config.components.holo_posters;


		// 复现config中存在的posters
		for (let i = 0; i < this._data.instances.length; i++) {

			this.build(this._data.instances[i]);

		}


	}


	add(obj) {

		// 记录数据
		let instance = {
			style: obj.style,
			name: obj.name,
			p: [0, 2, 2],
			s: [1, 1, 1],
			r: [0, 0, 0],
			screen_format: "default", // [ default | image | video ]
			screen_src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220921/" + obj.style + ".png",
			motion_type: MOTION_NONE
		}

		this._data.instances.push(instance);

		this.build(instance);

	}


	build(obj) {

		let style = obj.style;

		let tex = obj.screen_src ?
			ThreeInstance.getInstance().textureloader.load(obj.screen_src) :
			ThreeInstance.getInstance().textureloader.load( "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220921/" + style + ".png" );
		

		let posterMaterial = new THREE.MeshBasicMaterial({
			map: tex,
			color: 0xffffff,
			side: THREE.DoubleSide,
			transparent: true
		});

		let posterGeometry = new THREE.PlaneBufferGeometry( this.posterTemplates[ style ].width, this.posterTemplates[ style ].height );

		let poster = new THREE.Mesh( posterGeometry, posterMaterial );
		poster.name = obj.name;
		poster.position.set(obj.p[0], obj.p[1], obj.p[2]);
		poster.rotation.set(obj.r[0], obj.r[1], obj.r[2]);
		poster.scale.set(obj.s[0], obj.s[1], obj.s[2]);
		poster.motion_type = obj.motion_type;
		poster.renderOrder = 1;
		poster.draggable = true;


		ThreeInstance.getInstance().objectsGroup.add(poster);
		this.posters.push(poster);


		// 如果已经加载过资源，则直接引用
		// 否则进行加载
		// if (this.posterTemplates[style].screen) {

		// 	this.buildPoster(tex, style, obj);

		// } else {

		// 	// customize类型，是从远程加载模型
		// 	// 其他的，是从本地获取相应资源

		// 	let path = style == 'customize' ? this._url : './resources/models/holo_poster/' + style + '/model.fbx';

		// 	ThreeInstance.getInstance().fbxloader.load(path, function (result) {

		// 		self.posterTemplates[style] = {
		// 			screen: result.children[0],
		// 			container: result.children[1],
		// 		};

		// 		self.buildPoster(tex, style, obj);

		// 	});

		// }

	}



	buildPoster(tex, style, obj) {

		let screen = this.posterTemplates[style].screen.clone();
		let poster = this.posterTemplates[style].container.clone();

		screen.material = new THREE.MeshBasicMaterial({
			map: tex,

			side: THREE.DoubleSide,
			transparent: true
		});

		poster.material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.0
		});

		// poster.draggable = true;
		screen.draggable = true;

		poster.name = obj.name;
		poster.position.set(obj.p[0], obj.p[1], obj.p[2]);
		poster.rotation.set(obj.r[0], obj.r[1], obj.r[2]);
		poster.scale.set(obj.s[0], obj.s[1], obj.s[2]);
		poster.motion_type = obj.motion_type;
		poster.renderOrder = 1;

		poster.add(screen);

		ThreeInstance.getInstance().objectsGroup.add(poster);
		this.posters.push(poster);

	}


	// 设置图片
	set(obj) {

		var poster =ThreeInstance.getInstance().objectsGroup.getObjectByName(obj.name);

		switch (obj.format) {

			case ('image'):

				let tex =ThreeInstance.getInstance().textureloader.load(obj.src, function (result) {

					poster.material.map = result;

				});

				break;

		}

		let pi = this.getObjectByNameFromArray(this._data.instances, obj.name);
		pi.screen_format = obj.format;
		pi.screen_src = obj.src;

	}


	del(obj) {

		var target =ThreeInstance.getInstance().objectsGroup.getObjectByName(obj.name);

		if (target){
			for (let i = 0; i < this._data.instances.length; i++) {
				if( obj.name== this._data.instances[i].name){
					this._data.instances.splice(i,1)
					break
				}
			}
			ThreeInstance.getInstance().objectsGroup.remove(target);
		}
		target = null;

	}


	scale = function (obj) {

		let s = obj.scale;

		var target =ThreeInstance.getInstance().objectsGroup.getObjectByName(obj.name);

		if (target) {

			target.scale.set(s, s, s);

		}

	}


	rotate(obj) {

		let degree = obj.angle;

		var target =ThreeInstance.getInstance().objectsGroup.getObjectByName(obj.name);

		if (target) {

			switch (obj.axis) {

				case 'x':

					target.rotation.x = degree * Math.PI / 180;

					break;

				case 'y':

					target.rotation.y = degree * Math.PI / 180;

					break;

			}

		}

	}


	setMotion(obj) {

		let target =ThreeInstance.getInstance().objectsGroup.getObjectByName(obj.name);

		if (target) target.motion_type = obj.motion_type;

	}


	update(delta, frame) {

		for (let i = 0; i < this.posters.length; i++) {

			let poster = this.posters[i];

			switch (poster.motion_type) {

				case MOTION_FLOATING:

					poster.position.y += Math.sin(frame * Math.PI / 400 + i) * 0.1;
					poster.rotation.y = - Math.sin(frame * Math.PI / 400 + i) * 0.05;

					break

				case MOTION_ROTATE:

					poster.rotation.y += delta / 10;

					break;
			}

		}

	}


	save() {

		for (let i = 0; i < this._data.instances.length; i++) {

			let name = this._data.instances[i].name;
			

			let target =ThreeInstance.getInstance().objectsGroup.getObjectByName(name);

			this._data.instances[i].p[0] = target.position.x;
			this._data.instances[i].p[1] = target.position.y;
			this._data.instances[i].p[2] = target.position.z;

			this._data.instances[i].s[0] = target.scale.x;
			this._data.instances[i].s[1] = target.scale.y;
			this._data.instances[i].s[2] = target.scale.z;

			this._data.instances[i].r[0] = target.rotation.x;
			this._data.instances[i].r[1] = target.rotation.y;
			this._data.instances[i].r[2] = target.rotation.z;

			this._data.instances[i].motion_type = target.motion_type;

		}

	}


	getObjectByNameFromArray(array, name) {

		for (let i = 0, l = array.length; i < l; i++) {

			if (array[i].name === name) {

				return array[i];

			}

		}

	}



	// DEBUG
	testDebug(){}

	debug() {

		let folder =ThreeInstance.getInstance().gui.addFolder('🌁 | 动态海报');
		folder.open();
		let self = this;
		var dropdown = { name: 'planar_16x9' };
		var options = ['planar_16x9', 'planar_9x16', 'planar_1x1', 'planar_4x1', 'customize'];

		folder.add(dropdown, "name").options(options).onChange(function (value) {

			if (value != 'style-00') {

				self.currentSelectedStyle = value;

			}

			if (value == 'customize') {
				folder.add(this, '_url').name('模型地址').onChange(function (value) {

					self._url = value;

					console.log(self._url);

				});
			}

		});

		folder.add(this, "testDebug").name("添加动态海报").onChange(function () {

			self.add({
				style: self.currentSelectedStyle,
				name: self.currentSelectedStyle + 'name',
			});

		});


		folder.add(this, "testDebug").name("设置图片").onChange(function (value) {

			self.set({
				name: self.currentSelectedStyle + "name",
				format: "image",
				// src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211130/shd738c8aa2.jpg"
				// src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220216/WechatIMG214.jpeg" // 31会议 16:9地面
				// src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220217/p2.jpeg" // 31会议 4：1地面
				// src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220228/Artboard.png", // 宁波银行logo
				src: "https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220313/shf853a0bde.png", // 随幻logo
			});

		});


		folder.add(this, "testDebug").name("删除动态海报").onChange(function (value) {

			self.del({
				name: self.currentSelectedStyle + "name"
			})

		});


		folder.add(this, 'testDebug', 0.0, 5.0).name("调整尺寸").onChange(function (value) {

			self.scale({
				name: self.currentSelectedStyle + "name",
				scale: value
			});

		});


		folder.add(this, '_rotateX', -180, 180).step(1).name("调整旋转 X轴").onChange(function (value) {

			self.rotate({
				name: self.currentSelectedStyle + "name",
				axis: 'x',
				angle: value
			});

		});

		folder.add(this, '_rotateY', -180, 180).step(1).name("调整旋转 Y轴").onChange(function (value) {

			self.rotate({
				name: self.currentSelectedStyle + "name",
				axis: 'y',
				angle: value
			});

		});

		folder.add(this, 'testDebug').name("设置海报运动：浮动").onChange(function (value) {

			self.setMotion({
				name: self.currentSelectedStyle + "name",
				motion_type: MOTION_FLOATING
			});

		});

		folder.add(this, 'testDebug').name("设置海报运动：自转").onChange(function (value) {

			self.setMotion({
				name: self.currentSelectedStyle + "name",
				motion_type: MOTION_ROTATE
			});

		});

		// folder.add( PosterManager, 'save' ).name("保存组件");

	}

}
// let _data;


const MOTION_NONE = 0;
const MOTION_FLOATING = 1;
const MOTION_ROTATE = 2;
