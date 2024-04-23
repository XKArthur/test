import {
  ThreeInstance,
} from "./activation/threeInit";
import component3DBigText from "./component/component-3DBigText";
import componentAvatar from "./component/component-Avatar";
import componentTest from "./component/component-test";
import { HologramScreen } from "./component/component-HologramScreen";
import { CameraControls } from "./component/CameraControls";
import { StageManager } from "./libs/StageManager";


export function createGl(options) {
  if (!(this instanceof createGl)) {
    return new createGl(options);
  }
  this.name = "origin name";
  this.clear();

  this.options = Object.assign({}, this.options, options);
  console.log("** init webgl1 **");

  initVideo(options.videoId);
  if (options.renderViewId) {
    ThreeInstance.getInstance().creat(options);
    ThreeInstance.getInstance().init();
    // threeInit(options);
  }
}
createGl.prototype.setName = function(name) {
  this.name = name;
};
createGl.prototype.getName = function() {
  return this.name;
};
createGl.prototype.clear = function() {
  if (window.shgl?.animate) {
    window.cancelAnimationFrame(window.shgl.animate); //可以取消该次动画。
  }
  window.shgl = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    matteMaterial: null,
    materialCubeEnv: null,
    cubeCamera: null,
  };
};

function initVideo(videoid) {
  const video = document.getElementById(videoid);
  console.log(123,video)
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = { video: { width: 1920, height: 1080 } };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(error) {
        console.log("无法访问摄像头/网络摄像头。", error);
      });
  } else {
    console.log("MediaDevices接口不可用。");
  }
}
// export default {
//   name,
//   threeInit,
//   BigText,
//   AvatarsManager,
// };

// console.log("componentTest", componentTest);
// export const shTest = new componentTest();
// // export const videoInit = threeInit;
// export const SetRoleplaneX = moveRoleplaneX;
// export const SetRoleplaneZ = moveRoleplaneZ;
// export const SetRoleplaneY = moveRoleplaneY;
// export const RendererResize = rendererResize;
// export const RotateRolePlaneZ = rotateRolePlaneZ;
// export const ScaleRolePlane = scaleRolePlane;
// export const BigText = component3DBigText.BigText;
// export const AvatarsManager = componentAvatar.videoInitAvatarsManager;
// export const HologramScreenManger = HologramScreen;
// export const CameraControlsManger = CameraControls;
// export const StageManagerCtrl = StageManager;
// export const ARCtrl = AR;
// export const ARCtrl2 = AR2;
