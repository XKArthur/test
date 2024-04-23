<template>
  <div style="padding-top: 20px">
    <div class="scene-tit-point" @click="changePos('camera_near')">近景机位</div>
    <div class="btn-3d" style="cursor: auto">
      <div class="cz-opt">
        <div class="setItem">
          <div class="labPut">
            <span class="label">机位左右调节</span>
            <el-input-number v-model="nearXNum" :min="-500" :max="500" label="描述文字" size="mini" @change="setNearXNum" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ -500 }}</div>
            <input
              :v-model="nearXNum"
              style="width: 160px"
              class="inputItem"
              type="range"
              max="500"
              min="-500"
              step="1"
              show-input
              :value="nearXNum"
              @input="setNearXNum"
            >
            <div class="siderNum">{{ 500 }}</div>
          </div>
        </div>
        <div class="setItem">
          <div class="labPut">
            <span class="label">机位高度调节</span>
            <el-input-number v-model="nearHNum" :min="0" :max="400" label="描述文字" size="mini" @change="setNearHNum" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ 0 }}</div>
            <input
              :v-model="nearHNum"
              style="width: 160px"
              class="inputItem"
              type="range"
              max="400"
              min="0"
              step="1"
              show-input
              :value="nearHNum"
              @input="setNearHNum"
            >
            <div class="siderNum">{{ 400 }}</div>
          </div>
        </div>
        <div class="setItem">
          <div class="labPut">
            <span class="label">机位纵深调节</span>
            <el-input-number v-model="nearZNum" :min="100" :max="720" label="描述文字" size="mini" @change="setNearZNum" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ 100 }}</div>
            <input
              style="width: 160px"
              class="inputItem"
              type="range"
              max="720"
              min="100"
              step="1"
              show-input
              :value="nearZNum"
              @input="setNearZNum"
            >
            <div class="siderNum">{{ 720 }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="scene-tit-point" style="margin-top:40px" @click="changePos('camera_far')">远景机位</div>
    <div class="btn-3d" style="cursor: auto">
      <div class="cz-opt">
        <div class="setItem">
          <div class="labPut">
            <span class="label">机位高度调节</span>
            <el-input-number v-model="farHNum" :min="0" :max="600" label="描述文字" size="mini" @change="setFarHNum" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ 0 }}</div>
            <input
              style="width: 160px"
              class="inputItem"
              type="range"
              max="600"
              min="0"
              step="1"
              show-input
              :value="farHNum"
              @input="setFarHNum"
            >
            <div class="siderNum">{{ 600 }}</div>
          </div>
        </div>
        <div class="setItem">
          <div class="labPut">
            <span class="label">机位纵深调节</span>
            <el-input-number v-model="farZNum" :min="720" :max="2400" label="描述文字" size="mini" @change="setFarZNum" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ 720 }}</div>
            <input
              style="width: 160px"
              class="inputItem"
              type="range"
              max="2400"
              min="720"
              step="1"
              show-input
              :value="farZNum"
              @input="setFarZNum"
            >
            <div class="siderNum">{{ 2400 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      nearHNum: 160,
      nearZNum: 400,
      nearXNum: 400,
      farHNum: 160,
      farZNum: 880,
      havelight: false,
      czColor: '#ffffff',
      czRange: 0.17,
      num: 0
    }
  },
  mounted() {
    this.initEvent()
  },
  beforeDestroy() {
    this.removeEvent()
  },
  methods: {
    // 添加监听
    setNearHNum(e) {
      if (e.srcElement) this.nearHNum = Number(e.srcElement.value)
      console.log('nearHNum', this.nearHNum)
      window.StageApp.fire('CameraControlsManger_nearPositionY', this.nearHNum / 100)
    },
    setNearXNum(e) {
      if (e.srcElement) this.nearXNum = Number(e.srcElement.value)
      console.log('nearXNum', this.nearXNum)
      window.StageApp.fire('CameraControlsManger_nearPositionX', this.nearXNum / 100)
    },
    setNearZNum(e) {
      if (e.srcElement) this.nearZNum = Number(e.srcElement.value)
      console.log('nearZNum', this.nearZNum)
      window.StageApp.fire('CameraControlsManger_nearPositionZ', this.nearZNum / 100)
    },
    setFarHNum(e) {
      if (e.srcElement) this.farHNum = Number(e.srcElement.value)
      console.log('farHNum', this.farHNum)
      window.StageApp.fire('CameraControlsManger_farPositionY', this.farHNum / 100)
    },
    setFarZNum(e) {
      if (e.srcElement) this.farZNum = Number(e.srcElement.value)
      console.log('farZNum', this.farZNum)
      window.StageApp.fire('CameraControlsManger_farPositionZ', this.farZNum / 100)
    },
    changePos(str) {
      window.StageApp.fire('CameraControlsManger_changePosition', str)
    },
    initEvent() {
      this.$eventBus.$on('moduleFile', (data) => {
        console.log('添加监听camera', data)
        if (data.camera) {
          this.nearHNum = data.camera.camera_near.y * 100
          this.nearZNum = data.camera.camera_near.z * 100
          this.nearXNum = data.camera.camera_near.x * 100
          this.farHNum = data.camera.camera_far.y * 100
          this.farZNum = data.camera.camera_far.z * 100
        //   this.czColor = data.stage.material?.diffuse
        //   this.czRange = data.stage.material?.reflectivity
        //   this.havelight = true
        }
      })
    },
    // 移除监听
    removeEvent() {
    //   this.$eventBus.$off('moduleFile')
    },
    toggleLight() {
    //   this.havelight = !this.havelight
    //   window.StageApp.fire('StageEditor_setLit', this.havelight)
    },
    setCzColor(e) {
    //   this.czColor = Number(e.srcElement.value)
      // console.log('材质 颜色', this.czColor)
    //   window.StageApp.fire('StageEditor_setDiffuse', this.czColor)
    },
    setCzRange(e) {
    //   this.czRange = Number(e.srcElement.value)
      // console.log('材质 反射', this.czRange)
    //   window.StageApp.fire('StageEditor_setReflectivity', this.czRange)
    }
  }
}
</script>

<style lang="less" scoped>
// ===========================
// 滑动块
/*
::v-deep .el-slider {
   // width: 100%;
  position: relative;
}
::v-deep .el-slider__input {
  position: absolute;
  right: 0;
  top: -33px;
}
::v-deep .el-slider__runway.show-input {
  margin-right: 0;
}
::v-deep .el-slider__bar,
::v-deep .el-slider__runway {
  background-color: #181819;
}
::v-deep .el-slider__button {
  border: 2px solid #1f87ff;
  background-color: #1f87ff;
}
::v-deep .el-input-number__decrease,
::v-deep .el-input-number__increase {
  background: #434343;
  color: #999999;
  border: 0;
  font-size: 20px;
}
::v-deep .el-slider .el-icon-minus:before {
  content: "";
}
::v-deep .el-slider .el-icon-plus:before {
  content: "";
}
::v-deep {
  .el-switch__label {
    color: #fff;
  }
  .el-switch__label.is-active {
    color: #409eff;
  }
  .el-dropdown .el-button{
    width: 230px;
  }
}*/
</style>
