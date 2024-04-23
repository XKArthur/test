import { ThreeInstance } from "../activation/threeInit";

export class CameraControls {

	constructor() {

		this._config;
		this._camera;
		this._near;
		this._far;


		this.isCameraIdling = false;
		this.isCameraMoving = false;

		this.camera = null;
		this.cubeCamera = null;

		this.count = 400;

		this.camCurrent = 'camera_far';
		this.camDest = null;

	}

	init(config) {

		this._config = config;
		this._camera = config.camera;
		this._near = config.camera.camera_near;
		this._far = config.camera.camera_far;

		this._camera.camera_close = {}

		this.getRoleplanePosition();

		this.camera =ThreeInstance.getInstance().camera;
		this.cubeCamera =ThreeInstance.getInstance().cubeCamera;
		this.controls =ThreeInstance.getInstance().controls;

	}


	getRoleplanePosition() {

		this._camera.camera_close.x = this._config.roleplane.arrangement[0].x;
		this._camera.camera_close.y = this._config.roleplane.arrangement[0].y;
		this._camera.camera_close.z = this._config.roleplane.arrangement[0].z + 3.2;
		this._camera.camera_close.lookAt_x = this._config.roleplane.arrangement[0].x;
		this._camera.camera_close.lookAt_y = this._config.roleplane.arrangement[0].y;
		this._camera.camera_close.lookAt_z = this._config.roleplane.arrangement[0].z;

	}


	idle(bool) {
		this.isCameraIdling = bool;
	}


	updateWaving(frame) {

		let tx = 0 + Math.sin(frame / 200) * 5.5;

		this.camera.position.x = tx;
		this.camera.position.y = this._camera.camera_far.y;
		this.camera.position.z = this._camera.camera_far.z + Math.sin(frame / 200) * 1;
		this.camera.lookAt(this._camera.camera_far.lookAt_x, this._camera.camera_far.lookAt_y, this._camera.camera_far.lookAt_z);
		this.camera.updateMatrixWorld();

		this.cubeCamera.position.x = tx;
		this.cubeCamera.position.y = this._camera.camera_far.y * -1;
		this.cubeCamera.position.z = this._camera.camera_far.z + Math.sin(frame / 200) * 1;

		// this.controls.target.set(tx, 120, 0);




	}

	setCameraMoving(dest) {

		if (dest == "camera_close") {
			this.getRoleplanePosition();
		}

		this.camDest = dest;
		this.count = 0;
		this.isCameraMoving = true;
	}


    // 运镜刷新
	updateMoving() {

		if (this.count < 400) {

			this.count += 2;

			let count_motion = Math.floor(this.count / 1);

			let progress = motionArr_400[count_motion] / 100;

			this.camera.position.x = (this._camera[this.camDest].x - this._camera[this.camCurrent].x) * progress + this._camera[this.camCurrent].x;
			this.camera.position.y = (this._camera[this.camDest].y - this._camera[this.camCurrent].y) * progress + this._camera[this.camCurrent].y;
			this.camera.position.z = (this._camera[this.camDest].z - this._camera[this.camCurrent].z) * progress + this._camera[this.camCurrent].z;


			let lookAt_x = (this._camera[this.camDest].lookAt_x - this._camera[this.camCurrent].lookAt_x) * progress + this._camera[this.camCurrent].lookAt_x;
			let lookAt_y = (this._camera[this.camDest].lookAt_y - this._camera[this.camCurrent].lookAt_y) * progress + this._camera[this.camCurrent].lookAt_y;
			let lookAt_z = (this._camera[this.camDest].lookAt_z - this._camera[this.camCurrent].lookAt_z) * progress + this._camera[this.camCurrent].lookAt_z;
			this.camera.lookAt(lookAt_x, lookAt_y, lookAt_z);
			// this.camera.updateMatrixWorld();

			this.cubeCamera.position.x = (this._camera[this.camDest].x - this._camera[this.camCurrent].x) * progress + this._camera[this.camCurrent].x;
			this.cubeCamera.position.y = ((this._camera[this.camDest].y - this._camera[this.camCurrent].y) * progress + this._camera[this.camCurrent].y) * -1;
			this.cubeCamera.position.z = (this._camera[this.camDest].z - this._camera[this.camCurrent].z) * progress + this._camera[this.camCurrent].z;

			if (this.count == 400) {
				this.camCurrent = this.camDest;
				this.isCameraMoving = false;
			}



		}


	}


	setCameraDistance_Z(target, value) {
		var data = this._config.camera[target];
		this.camera.position.z = value;
		this.camera.position.x = data.x;
		this.camera.position.y = data.y;
		this.cubeCamera.position.z = value;


		// 写入CONFIG
		this._config.camera[target].z = value;

	}

    setCamera(dest) {
        this.camCurrent = dest;

        let cam = this._camera[dest];

        this.camera.position.x = cam.x;
        this.camera.position.y = cam.y;
        this.camera.position.z = cam.z;

        this.camera.lookAt(cam.lookAt_x, cam.lookAt_y, cam.lookAt_z);


        this.cubeCamera.position.x = cam.x;
        this.cubeCamera.position.y = cam.y * -1;
        this.cubeCamera.position.z = cam.z;

    }

	setCameraHeight_Y(target, value) {
		var data = this._config.camera[target];

		this.camera.position.y = value;
		this.camera.position.x = data.x;
		this.camera.position.z = data.z;
		this.camera.lookAt(data.lookAt_x , value, data.lookAt_z);
		this.camera.updateMatrixWorld();

		this.cubeCamera.position.y = -1 * this.camera.position.y;


		// 写入CONFIG
		this._config.camera[target].y = value;
		this._config.camera[target].lookAt_y = value;

	}
	setCamera_X(target, value) {
		var data = this._config.camera[target];
		this.camera.position.x = value;
		this.camera.position.y = data.y;
		this.camera.position.z = data.z;
		this.camera.lookAt(value, data.lookAt_y, data.lookAt_z);
		this.camera.updateMatrixWorld();

		this.cubeCamera.position.x =  this.camera.position.x;


		// 写入CONFIG
		this._config.camera[target].x = value;
		this._config.camera[target].lookAt_x = value;

	}



	// DEBUG
	_startMovingFar  () { this.setCameraMoving('camera_far') }
	_startMovingNear () { this.setCameraMoving('camera_near') }
	_startMovingClose () { this.setCameraMoving('camera_close') }


	debug() {

		let folder_camera = ThreeInstance.getInstance().gui.addFolder("📽 | 机位切换");
		let self = this;
		folder_camera.open();

		folder_camera.add(this, 'isCameraIdling').name('试验镜头摇镜').onChange(function (value) {

			self.isCameraIdling = value;

		});



		folder_camera.add(this, '_startMovingNear').name('切近景');

		folder_camera.add(this._near, 'y', 0, 8).step(0.01).name('近景机位高度调节').onChange(function (value) {
			self.setCameraHeight_Y('camera_near', value);
		})

		folder_camera.add(this._near, 'z', 3.2, 7.2).step(0.01).name('近景机位纵深调节').onChange(function (value) {
			self.setCameraDistance_Z('camera_near', value);
		})



		folder_camera.add(this, '_startMovingFar').name('切远景');

		folder_camera.add(this._far, 'y', 0, 10).step(0.01).name('远景机位高度调节').onChange(function (value) {
			self.setCameraHeight_Y('camera_far', value);
		})

		folder_camera.add(this._far, 'z', 0, 50).step(0.01).name('远景机位纵深调节').onChange(function (value) {
			self.setCameraDistance_Z('camera_far', value);
		})

	}


}


const motionArr_400 = [0, 0.005, 0.01, 0.015, 0.02, 0.0275, 0.0325, 0.04, 0.05, 0.0575, 0.0675, 0.0775, 0.0875, 0.1, 0.1125, 0.125, 0.1375, 0.1525, 0.165, 0.1825, 0.1975, 0.215, 0.2325, 0.25, 0.2675, 0.2875, 0.3075, 0.3275, 0.35, 0.3725, 0.395, 0.42, 0.4425, 0.47, 0.495, 0.5225, 0.55, 0.5775, 0.6075, 0.6375, 0.6675, 0.7, 0.7325, 0.765, 0.8, 0.835, 0.87, 0.905, 0.945, 0.9825, 1.0225, 1.0625, 1.1025, 1.145, 1.1875, 1.2325, 1.2775, 1.3225, 1.37, 1.4175, 1.4675, 1.5175, 1.5675, 1.62, 1.6725, 1.725, 1.78, 1.8375, 1.895, 1.9525, 2.0125, 2.0725, 2.135, 2.1975, 2.2625, 2.3275, 2.3925, 2.46, 2.53, 2.6, 2.67, 2.745, 2.8175, 2.8925, 2.97, 3.0475, 3.1275, 3.2075, 3.29, 3.3725, 3.4575, 3.5425, 3.6325, 3.72, 3.8125, 3.905, 3.9975, 4.0925, 4.19, 4.29, 4.39, 4.4925, 4.595, 4.7, 4.8075, 4.9175, 5.0275, 5.14, 5.255, 5.3725, 5.49, 5.61, 5.7325, 5.855, 5.9825, 6.11, 6.24, 6.375, 6.5075, 6.645, 6.785, 6.9275, 7.07, 7.215, 7.365, 7.5175, 7.67, 7.825, 7.985, 8.1475, 8.31, 8.4775, 8.6475, 8.82, 8.995, 9.1725, 9.355, 9.54, 9.7275, 9.92, 10.115, 10.3125, 10.5125, 10.7175, 10.925, 11.1375, 11.3525, 11.5725, 11.795, 12.0225, 12.255, 12.49, 12.7325, 12.975, 13.225, 13.4775, 13.7375, 14, 14.27, 14.5425, 14.82, 15.105, 15.395, 15.69, 15.9925, 16.2975, 16.6125, 16.9325, 17.2575, 17.5925, 17.93, 18.28, 18.635, 18.9975, 19.3675, 19.745, 20.13, 20.525, 20.93, 21.3425, 21.7675, 22.1975, 22.64, 23.095, 23.5575, 24.0325, 24.52, 25.02, 25.53, 26.0525, 26.5925, 27.1425, 27.71, 28.29, 28.885, 29.495, 30.1225, 30.765, 31.4275, 32.1075, 32.805, 33.52, 34.255, 35.01, 35.785, 36.58, 37.395, 38.23, 39.085, 39.96, 40.855, 41.77, 42.7025, 43.6525, 44.6175, 45.595, 46.5875, 47.5925, 48.6025, 49.62, 50.64, 51.6625, 52.68, 53.695, 54.7025, 55.7, 56.6875, 57.66, 58.62, 59.5625, 60.485, 61.39, 62.2775, 63.1425, 63.9875, 64.81, 65.615, 66.4, 67.1625, 67.905, 68.63, 69.335, 70.0175, 70.6875, 71.335, 71.9675, 72.585, 73.1825, 73.765, 74.3325, 74.8875, 75.4275, 75.9525, 76.465, 76.965, 77.4525, 77.9275, 78.39, 78.8425, 79.285, 79.7175, 80.1375, 80.55, 80.95, 81.345, 81.7275, 82.105, 82.4725, 82.83, 83.1825, 83.5275, 83.8625, 84.1925, 84.515, 84.83, 85.14, 85.4425, 85.74, 86.03, 86.3175, 86.595, 86.87, 87.1375, 87.4025, 87.66, 87.9125, 88.1625, 88.4075, 88.645, 88.88, 89.11, 89.3375, 89.5575, 89.7775, 89.99, 90.2, 90.4075, 90.61, 90.8075, 91.0025, 91.195, 91.385, 91.57, 91.75, 91.93, 92.105, 92.2775, 92.4475, 92.6125, 92.7775, 92.9375, 93.095, 93.25, 93.4025, 93.5525, 93.7, 93.845, 93.9875, 94.1275, 94.265, 94.4, 94.5325, 94.665, 94.7925, 94.9175, 95.0425, 95.165, 95.285, 95.4025, 95.5175, 95.6325, 95.7425, 95.8525, 95.96, 96.0675, 96.1725, 96.275, 96.375, 96.4725, 96.57, 96.6675, 96.76, 96.8525, 96.9425, 97.0325, 97.12, 97.205, 97.29, 97.3725, 97.455, 97.5325, 97.6125, 97.6875, 97.765, 97.8375, 97.9125, 97.9825, 98.0525, 98.12, 98.19, 98.255, 98.32, 98.3825, 98.445, 98.5075, 98.5675, 98.625, 98.6825, 98.74, 98.795, 98.8475, 98.9025, 98.9525, 99.005, 99.0525, 99.1025, 99.15, 99.195, 99.2425, 99.285, 99.33, 99.3725, 99.4125, 99.4525, 99.4925, 99.5325, 99.57, 99.605, 99.64, 99.675, 99.71, 99.7425, 99.775, 99.805, 99.835, 99.865, 99.895, 99.9225, 99.9475, 99.975, 100];
