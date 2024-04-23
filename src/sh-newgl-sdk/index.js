import {
   ThreeInstance
  // moveRoleplaneX,
  // moveRoleplaneZ,
  // rendererResize,
  // rotateRolePlaneZ,
  // scaleRolePlane
} from './sh-modules-sdk/activation/threeInit'
// import { Editor } from "./sh-modules-sdk/libs/StageEditor";
import initEvent from './initEvent'
export function Loadscene(options) {
  if (!(this instanceof Loadscene)) {
    return new Loadscene(options)
  }
  this.name = 'origin name'
  this.clear()

  this.options = Object.assign({}, this.options, options)
  console.log('** init webgl **')

  // initVideo(options.videoId)
  if (options.renderViewId) {
    ThreeInstance.getInstance().creat(options)
    ThreeInstance.getInstance().init()
    //threeInit(options)
  }
  initEvent()
}
Loadscene.prototype.clear = function() {
  if (ThreeInstance.getInstance()?.animation) {
    window.cancelAnimationFrame(ThreeInstance.getInstance().animation) // 可以取消该次动画。
  }
  window.StageApp = null
  window.shgl = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    matteMaterial: null,
    materialCubeEnv: null,
    cubeCamera: null
  }
  const guidom = document.getElementById('shglgui')
  if( guidom ){
    guidom.remove()
  }
}
Loadscene.prototype.editor = ThreeInstance

function initVideo(videoid) {
  const video = document.getElementById(videoid)
  console.log(videoid, video)

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    const constraints = { video: { width: 1920, height: 1080 }}

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function(stream) {
        video.srcObject = stream
        video.play()
      })
      .catch(function(error) {
        console.log('无法访问摄像头/网络摄像头。', error)
      })
  } else {
    console.log('MediaDevices接口不可用。')
  }
}

