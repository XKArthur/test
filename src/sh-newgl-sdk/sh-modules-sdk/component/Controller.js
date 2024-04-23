import { ThreeInstance } from "../activation/threeInit";

export class Controller {
	constructor() {
		this.W = null; this.H = null;


		this.mouse_normalized = new THREE.Vector2(0, 0);
		this.mouse = new THREE.Vector2(0, 0);
		this.last = new THREE.Vector2(0, 0);
		this.raycaster = new THREE.Raycaster();
		this.selectedObjects = [];
		this.tweakingObj = null;
		this.objects;

	}
	init() {

		this.objects = ThreeInstance.getInstance().objectsGroup;

		this.W = ThreeInstance.getInstance().W;//realW;
		this.H = ThreeInstance.getInstance().H;//realH;
		this.scale = ThreeInstance.getInstance().scale;

		ThreeInstance.getInstance().renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
		ThreeInstance.getInstance().renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
		ThreeInstance.getInstance().renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
		ThreeInstance.getInstance().renderer.domElement.addEventListener('wheel', this.onMouseScroll.bind(this));

	}
	onMouseMove(event) {

		if (event.isPrimary === false) return;
		this.mouse.x = event.offsetX*this.scale - this.W / 2;
		this.mouse.y = - (event.offsetY*this.scale - this.H / 2);

		this.mouse_normalized.x = (event.offsetX*this.scale / this.W) * 2 - 1;
		this.mouse_normalized.y = - (event.offsetY*this.scale / this.H) * 2 + 1;

		if (this.tweakingObj) {

			let dx = this.mouse.x - this.last.x;
			let dy = this.mouse.y - this.last.y;

			this.tweakingObj.position.x += dx * 1.4 / 100;
			this.tweakingObj.position.y += dy * 1.4 / 100;

			// tweakingObj.rotation.x = mouse_normalized.y / 5;
			// tweakingObj.rotation.y = - mouse_normalized.x / 3.4;

			this.last.x = this.mouse.x;
			this.last.y = this.mouse.y;

		} else {

			this.raycaster.setFromCamera(this.mouse_normalized, ThreeInstance.getInstance().camera);

			const intersects = this.raycaster.intersectObject(ThreeInstance.getInstance().objectsGroup, true);

			if (intersects.length == 1) {

				// if( intersects[0].object.draggable || intersects[0].object.parent.draggable ) {

				// 	selectedObjects = [];
				// 	// selectedObjects.push(intersects[0].object);

				// 	intersects[0].object.parent.draggable && selectedObjects.push( intersects[0].object.parent );
				// 	intersects[0].object.draggable && selectedObjects.push(intersects[0].object);

				// 	Posts.outlinePass.selectedObjects = selectedObjects;

				// }


				if (intersects[0].object.draggable) {
					let target = intersects[0].object;
					this.selectedObjects = [];

					this.selectedObjects.push(target);

					// this.selectedObjects[0].material.color.setHex(0xff9900);
					this.setObjectsDefault()

					if (target.material.color) {
						target.material.color.setHex(0x00ccff);
					} else if (target.isShader) {
						target.material.uniforms.highlightColor.value.setHex(0x00ccff)
					} else if (target.is3DText) {
						target.material[0].color.setHex(0x00ccff);
					}

				}

				// changeCursorStyle( 'pointer' );

			} else {
				this.setObjectsDefault()
				// for (let i = 0; i < this.objects.children.length; i++) {

				// 	this.objects.children[i].material.color.setHex(0xffffff)

				// }

				// Posts.outlinePass.selectedObjects = [];

				// changeCursorStyle( 'default' );

			}

		}

	}
	setObjectsDefault() {

		for (let i = 0; i < this.objects.children.length; i++) {

			let target = this.objects.children[i];

			if (target.material.color) {
				target.material.color.setHex(0xffffff)
			} else if (target.isShader) {
				target.material.uniforms.highlightColor.value.setHex(0xffffff)
			} else if (target.is3DText) {
				target.material[0].color.setHex(0xffffff);
			}

		}

	}

	onMouseScroll(e) {
		var direct = 0;
		e = e || window.event;
		if (this.selectedObjects.length > 0)
			this.selectedObjects[0].position.z += e.wheelDeltaY / 600;
		// if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件             
		// 	if (e.wheelDelta > 0) { //当滑轮向上滚动时
		// 		selectedObjects[0].position.z += e.wheelDeltaY /100;
		// 	}
		// 	if (e.wheelDelta < 0) { //当滑轮向下滚动时
		// 		selectedObjects[0].position.z -= e.wheelDeltaY /100;
		// 	}
		// } else if (e.detail) {  //Firefox滑轮事件
		// 	if (e.detail> 0) { //当滑轮向上滚动时
		// 		selectedObjects[0].position.z += e.wheelDeltaY /100;
		// 	}
		// 	if (e.detail< 0) { //当滑轮向下滚动时
		// 		selectedObjects[0].position.z -= e.wheelDeltaY /100;
		// 	}
		// }
	}




	onMouseDown(event) {

		// 结合Alt键调节灯光
		// if (event.altKey == true) {
		// 	isClick = true;
		// 	dirLightStartPos.x = event.x;
		// 	dirLightStartPos.y = event.y;
		// 	return;
		// }

		this.mouse_normalized.x = (event.offsetX*this.scale / this.W) * 2 - 1;
		this.mouse_normalized.y = - (event.offsetY*this.scale / this.H) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse_normalized, ThreeInstance.getInstance().camera);

		const intersects = this.raycaster.intersectObject(ThreeInstance.getInstance().objectsGroup, true);

		// if ( intersects.length > 0 && ( intersects[0].object.draggable || intersects[0].object.parent.draggable ) ) {

		// 	selectedObjects = [];

		// 	intersects[0].object.parent.draggable && selectedObjects.push( intersects[0].object.parent );
		// 	intersects[0].object.draggable && selectedObjects.push(intersects[0].object);

		// 	Posts.outlinePass.selectedObjects = selectedObjects;

		// } else {

		// 	Posts.outlinePass.selectedObjects = [];
		// 	selectedObjects = [];

		// }


		if (this.selectedObjects.length > 0) {

			this.tweakingObj = this.selectedObjects[0];

			this.last.x = event.offsetX*this.scale - this.W / 2;
			this.last.y = - (event.offsetY*this.scale - this.H / 2);

		}

	}


	onMouseUp() {

		this.tweakingObj = null;
		this.isClick = false;
		this.saveOperation()

		// changeCursorStyle( 'default' );

	}
	saveOperation() {
		// console.log('threeInitScene.getInstance().holoScreen',threeInitScene.getInstance().holoScreen)
		// ThreeInstance.getInstance().holoScreen.save()
		// ThreeInstance.getInstance().poster.save()
		ThreeInstance.getInstance().lightBox.save()
		// ThreeInstance.getInstance().bigText.save()
	}

}