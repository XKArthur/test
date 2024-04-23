import EventEmitter from "./EventEmitter";
import { HologramScreen } from "./sh-modules-sdk/component/component-HologramScreen";
import { ThreeInstance } from "./sh-modules-sdk/activation/threeInit";
import { CameraControls } from "./sh-modules-sdk/component/CameraControls";
import { PosterManager } from "./sh-modules-sdk/component/component-HoloPoster";
import { Background } from "./sh-modules-sdk/component/SceneBackground";
import { Helper } from "./sh-modules-sdk/component/Helper";
import { Editor } from "./sh-modules-sdk/libs/StageEditor";
import { Editor3 } from "./sh-modules-sdk/libs/Editor";
function initEvent() {
  const StageApp = new EventEmitter();
  const eventList = [
    {
      label: "获取当前配置",
      name: "PosterManager_config",
      cb: function (data) {
        console.log("获取当前配置", ThreeInstance.getInstance().posts.save());
      },
    },
    {
      label: "删除模型、贴图",
      name: "StageEditor_deleteModel",
      cb: function (data) {
        ThreeInstance.getInstance().editor.deleteMesh(data);
      },
    },
    {
      label: "上传模型",
      name: "StageEditor_loadLocalModel",
      cb: function (data) {
        ThreeInstance.getInstance().editor.loadLocalModel(data);
      },
    },
    {
      label: "上传贴图",
      name: "StageEditor_loadLocalTexture",
      cb: function (data) {
        ThreeInstance.getInstance().editor.loadLocalTexture(data.idx,data.file);
      },
    },
    // ===================== v0.3 新增 ================
    {
      label: "面片显示隐藏",
      name: "StageHelper_setRolePlaneVisible",
      cb: function (data) {
        ThreeInstance.getInstance().helper.setRolePlaneVisible( data );
      },
    },
    {
      label: "面片显示隐藏",
      name: "StageHelper_setRolePlaneDirection",
      cb: function (data) {
        ThreeInstance.getInstance().helper.UISetRolePlaneDirection( data );
      },
    },
    {
      label: "坐标显示隐藏",
      name: "StageHelper_setAxesVisible",
      cb: function (data) {
        ThreeInstance.getInstance().helper.setAxesVisible( data );
      },
    },
    {
      label: "背景设置",
      name: "StageEditor_setBackground",
      cb: function (data) {
        ThreeInstance.getInstance().background.setBackground(data);
      },
    },
    {
      label: "删除背景",
      name: "StageEditor_deleteBackground",
      cb: function (data) {
        ThreeInstance.getInstance().background.deleteBackground();
      },
    },
    {
      label: "贴图叠加光照颜色",
      name: "StageEditor_setShadingMode",
      cb: function (data) {
        ThreeInstance.getInstance().editor.UISetShadingMode(data.idx,data.type);
      },
    },
    {
      label: "接受环境反射",
      name: "StageEditor_setEnvironment",
      cb: function (data) {
        ThreeInstance.getInstance().editor.UISetEnvironment(data.idx,data.params);
      },
    },

    {
      label: "金属度 metalness 粗糙度 roughness 环境反射 envMapIntensity",
      name: "StageEditor_setMater",
      cb: function (data) {
        ThreeInstance.getInstance().editor.UISetMaterialProperty(data.idx,data.params);
      },
    },

    {
      label: "使用光照与反射",
      name: "StageEditor_setLit",
      cb: function (data) {
        ThreeInstance.getInstance().editor.setLit(data);
      },
    },
    {
      label: "使用光照与反射 颜色",
      name: "StageEditor_setDiffuse",
      cb: function (data) {
        ThreeInstance.getInstance().editor.setDiffuse(data);
      },
    },
    {
      label: "使用光照与反射 反射程度",
      name: "StageEditor_setReflectivity",
      cb: function (data) {
        ThreeInstance.getInstance().editor.setReflectivity(data);
      },
    },
    {
      label: "启用环境反射",
      name: "StageEditor_setEnvMap",
      cb: function (data) {
        ThreeInstance.getInstance().editor.setEnvmapMode(data.idx,data.params)
      },
    },
    {
      label: "切换环境反射混合模式",
      name: "StageEditor_setEnvMapCombine",
      cb: function (data) {
        ThreeInstance.getInstance().editor.setCombineMode(data.idx,data.params)
      },
    },
    {
      label: "环境反射系数",
      name: "StageEditor_setEnvMapReflectivity",
      cb: function (data) {
        ThreeInstance.getInstance().editor.setReflectivity(data.idx,data.value)
      },
    },
    /**light */
    {
      label: "灯光强度",
      name: "LightsSet_strength",
      cb: function (data) {
        ThreeInstance.getInstance().lights.setAmbLight(data)
      },
    },
    {
      label: "灯光颜色",
      name: "LightsSet_Color",
      cb: function (data) {
        ThreeInstance.getInstance().lights.setAmbLightColor(data)
      },
    },
    /**posts */
    
    {
      label: "开启后处理",
      name: "PostsSet_Open",
      cb: function (data) {
        ThreeInstance.getInstance().posts.togglePostProcessing(data)
      },
    },
    {
      label: "开启bloom光晕",
      name: "PostsSet_bloomOpen",
      cb: function (data) {
        ThreeInstance.getInstance().posts.setBloom(data)
      },
    },
    {
      label: "设施pbr",
      name: "PostsSet_Bloom",
      cb: function (data) {
        ThreeInstance.getInstance().posts.setBloomstrength(data)
      },
    },
    /**role */
    {
      label: "人物显示",
      name: "RoleVisibleSet",
      cb: function (data) {
        ThreeInstance.getInstance().helper.setRolePlaneVisible(data)
      },
    },
    {
      label: "人物位置",
      name: "RolePositionSet",
      cb: function (data) {
        ThreeInstance.getInstance().helper.UISetRolePlaneTranslate(data.pos,data.value)
      },
    },
    // 海报 ================================================

    {
      label: "添加动态海报",
      name: "PosterManager_add",
      cb: function (data) {
        ThreeInstance.getInstance().posters.add(data)
      },
    },
    {
      label: "设置图片",
      name: "PosterManager_set",
      cb: function (data) {
        ThreeInstance.getInstance().posters.set(data)
      },
    },
    {
      label: "旋转海报",
      name: "PosterManager_setRotate",
      cb: function (data) {
        ThreeInstance.getInstance().posters.rotate(data)
      },
    },
    {
      label: "海报运动类型",
      name: "PosterManager_setMotion",
      cb: function (data) {
        ThreeInstance.getInstance().posters.setMotion(data);
      },
    },
    {
      label: "删除动态海报",
      name: "PosterManager_del",
      cb: function (data) {
        ThreeInstance.getInstance().posters.del(data)
      },
    },
    {
      label: "海报调整尺寸",
      name: "PosterManager_scale",
      cb: function (data) {
        ThreeInstance.getInstance().posters.scale(data);
      },
    },

     // ================================================
     {
      label: "添加轮播灯",
      name: "LightBox:addLightBox",
      cb: function (data) {
        console.log('=====LightBox:addLightBox=====>',data)
        ThreeInstance.getInstance().lightBox.add(data)
        //PosterManager.set(data)
        // setOproation("post:setImage",data);
      },
    },
    {
      label: "设置灯箱",
      name: "lightBox:posterProp",
      cb: function (data) {
        console.log('=====lightBox:posterProp=====>',data)
        ThreeInstance.getInstance().lightBox.PropSet(data)
        //PosterManager.set(data)
        // setOproation("post:setImage",data);
      },
    },
    {
      label: "设置灯箱图片",
      name: "lightBox:setImage",
      cb: function (data) {
        console.log('=====lightBox:setImage=====>',data)
        ThreeInstance.getInstance().lightBox.set(data)
        //PosterManager.set(data)
        // setOproation("lightBox:setImage",data);
      },
    },
    {
      label: "删除灯箱",
      name: "lightBox:del",
      cb: function (data) {
        console.log('=====lightBox:del=====>',data)
        ThreeInstance.getInstance().lightBox.del(data)
        //PosterManager.set(data)
        // setOproation("post:setImage",data);
      },
    },
    {
      label: "设置灯箱可见",
      name: "lightBox:visible",
      cb: function (data) {
        console.log('=====lightBox:visible=====>',data)
        ThreeInstance.getInstance().lightBox.setVisible(data)
        //PosterManager.set(data)
        // setOproation("post:setImage",data);
      },
    },

    // ================================================
    {
      label: "显示/隐藏 屏幕",
      name: "HologramScreenManger_setVisible",
      cb: function (data) {
        console.log('HologramScreenManger_setVisible');
        ThreeInstance.getInstance().holoScreen.setVisible(data);
      },
    },
    {
      label: "旋转 屏幕",
      name: "HologramScreenMangerRotate",
      cb: function (data) {
        console.log('HologramScreenMangerRotate',data);
        ThreeInstance.getInstance().holoScreen.rotate('y',data);
      },
    },
    
    {
      label: "缩放 屏幕",
      name: "HologramScreenManger_scale",
      cb: function (data) {
        console.log('HologramScreenManger_scale',data);
        ThreeInstance.getInstance().holoScreen.scale(data);
      },
    },
    {
      label: "缩放 屏幕",
      name: "HologramScreenManger_Img",
      cb: function (data) {
        console.log('HologramScreenManger_Img',data);
        ThreeInstance.getInstance().holoScreen.setImage(data);
      },
    },

    // {
    //   label: "替换海报图片",
    //   name: "HologramScreenManger_useImage",
    //   cb: function(data) {
    //     ThreeInstance.getInstance().holoScreen.useImage(data);
    //   },
    // },
    // {
    //   label: "替换海报视频",
    //   name: "HologramScreenManger_useShare",
    //   cb: function(data) {
    //     ThreeInstance.getInstance().holoScreen.useVideo(data);
    //   },
    // },
    {
      label: "替换 分享的屏幕",
      name: "HologramScreenManger_useShare",
      cb: function (data) {
        ThreeInstance.getInstance().holoScreen.useShare(data);
      },
    },

    {
      label: "镜头 运动",
      name: "CameraControlsManger_idle",
      cb: function (data) {
        ThreeInstance.getInstance().cameraControls.idle(data);
      },
    },
    {
      label: "近景 远景",
      name: "CameraControlsManger_setCameraMoving",
      cb: function (data) {
        ThreeInstance.getInstance().cameraControls.setCameraMoving(data);
      },
    },
    {
      label: "场景大小",
      name: "RendererSettings:resize",
      cb: function (data) {
        ThreeInstance.getInstance().rendererResize(data.width, data.height);
      },
    },
    {
      label: "近景 纵深",
      name: "CameraControlsManger_nearPositionZ",
      cb: function (data) {
        ThreeInstance.getInstance().cameraControls.setCameraDistance_Z('camera_near',data);
      },
    },
    {
      label: "近景 高度",
      name: "CameraControlsManger_nearPositionY",
      cb: function (data) {
        ThreeInstance.getInstance().cameraControls.setCameraHeight_Y('camera_near',data);
      },
    },
    {
      label: "近景 左右",
      name: "CameraControlsManger_nearPositionX",
      cb: function (data) {
        console.log('CameraControlsManger_nearPositionX',data)
        ThreeInstance.getInstance().cameraControls.setCamera_X('camera_near',data);
      },
    },
    {
      label: "远景 纵深",
      name: "CameraControlsManger_farPositionZ",
      cb: function (data) {
        ThreeInstance.getInstance().cameraControls.setCameraDistance_Z('camera_far',data);
      },
    },
    {
      label: "远景 高度",
      name: "CameraControlsManger_farPositionY",
      cb: function (data) {
        ThreeInstance.getInstance().cameraControls.setCameraHeight_Y('camera_far',data);
      },
    },
    {
      label: "闪切",
      name: "CameraControlsManger_changePosition",
      cb: function (data) {
        ThreeInstance.getInstance().cameraControls.setCamera(data);
      },
    },
    // {
    //   label: "设置抠像主色",
    //   name: "roleplane:setColor",
    //   cb: function (data) {
    //     GreenKeyer.setKeyColor(data)
    //   },
    // },
    // {
    //   label: "设置抠像强度",
    //   name: "roleplane:setKeyingStrength",
    //   cb: function (data) {
    //     GreenKeyer.setGreenKey(data)
    //   },
    // },
    {
      label: "人物上下",
      name: "SetRoleplaneY",
      cb: function (data) {
        moveRoleplaneY(data);
      },
    },
    {
      label: "人物左右",
      name: "SetRoleplaneX",
      cb: function (data) {
        moveRoleplaneX(data);
      },
    },
    {
      label: "人物前后",
      name: "SetRoleplaneZ",
      cb: function (data) {
        moveRoleplaneZ(data);
      },
    },
    {
      label: "人物旋转",
      name: "roleplane:rotate",
      cb: function (data) {
        rotateRolePlaneZ(data);
      },
    },
    {
      label: "人物放缩",
      name: "roleplane:scale",
      cb: function (data) {
        scaleRolePlane(data);
      },
    },

    // ==========================================================

    {
      label: "图表 加载",
      name: "ARCtrl:load",
      cb: function (data) {
        AR.load();
      },
    },
    {
      label: "图表 显示",
      name: "ARCtrl:startMovingIn",
      cb: function (data) {
        AR.startMovingIn();
      },
    },
    {
      label: "图表 隐藏",
      name: "ARCtrl:startMovingOut",
      cb: function (data) {
        AR.startMovingOut();
      },
    },
    {
      label: "无人机 加载",
      name: "ARCtrl2:load",
      cb: function (data) {
        AR2.load();
      },
    },
    {
      label: "无人机 显示",
      name: "ARCtrl2:startMovingIn",
      cb: function (data) {
        AR2.startMovingIn();
      },
    },
    {
      label: "无人机 隐藏",
      name: "ARCtrl2:startMovingOut",
      cb: function (data) {
        AR2.startMovingOut();
      },
    },

    {
      label: "会议桌 加载",
      name: "ARCtrl3:load",
      cb: function (data) {
        ARTable.load();
      },
    },
    {
      label: "会议桌 显示",
      name: "ARCtrl3:startMovingIn",
      cb: function (data) {
        ARTable.table.visible = true;
      },
    },
    {
      label: "会议桌 隐藏",
      name: "ARCtrl3:startMovingOut",
      cb: function (data) {
        ARTable.table.visible = false;
      },
    },
  ];
  eventList.forEach((tevent) => {
    StageApp.on(tevent.name, tevent.cb);
  });

  // StageApp.on("comp_HoloScreen:hide", function(data) {
  //   ThreeInstance.getInstance().holoScreen.setVisible(false);
  // });
  // StageApp.on("comp_HoloScreen:getImageFromUrl", function(data) {
  //   ThreeInstance.getInstance().holoScreen.useImage(data);
  // });

  window.StageApp = StageApp;
}
export default initEvent;
