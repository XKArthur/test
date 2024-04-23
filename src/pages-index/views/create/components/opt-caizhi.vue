<template>
  <div style="padding-top: 20px">
    <div class="scene-tit">材质调节</div>
    <div class="btn-3d guang-zhao" style="cursor: auto">
      <div>
        使用光照与反射
        <span
          style="cursor: pointer"
          :class="havelight ? 'active' : ''"
          @click="toggleLight"
        />
      </div>
      <div v-show="havelight" class="cz-opt">
        <div>
          材质颜色
          <input
            style="margin-top: -5px"
            class="cz-color"
            type="color"
            :value="czColor"
            @input="setCzColor"
          >
          <div style="width: 70px">{{ czColor }}</div>
        </div>
        <div>
          反射强度
          <input
            style="width: 120px"
            class="cz-range"
            type="range"
            max="1"
            min="0"
            step="0.01"
            :value="czRange"
            @input="setCzRange"
          >
          <div style="width: 20px">{{ czRange }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      havelight: false,
      czColor: '#ffffff',
      czRange: 0.17
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
    initEvent() {
      this.$eventBus.$on('moduleFile', (data) => {
        // console.log('添加监听', data)
        if (data.stage.material?.diffuse) {
          this.czColor = data.stage.material?.diffuse
          this.czRange = data.stage.material?.reflectivity
          this.havelight = true
        }
      })
    },
    // 移除监听
    removeEvent() {
      this.$eventBus.$off('moduleFile')
    },
    toggleLight() {
      this.havelight = !this.havelight
      window.StageApp.fire('StageEditor_setLit', this.havelight)
    },
    setCzColor(e) {
      this.czColor = e.srcElement.value
      // console.log('材质 颜色', this.czColor)
      window.StageApp.fire('StageEditor_setDiffuse', this.czColor)
    },
    setCzRange(e) {
      this.czRange = Number(e.srcElement.value)
      // console.log('材质 反射', this.czRange)
      window.StageApp.fire('StageEditor_setReflectivity', this.czRange)
    }
  }
}
</script>

<style>
</style>
