<template>
  <div style="padding-top: 20px">
    <div class="btn-3d" style="cursor: auto">
      <div class="cz-opt">
        <div class="zj-item-toggle">
          <span class="scene-tit"> 人物面片 </span>
          <el-switch
            v-model="roleVis"
            class="selectLight"
            active-color="#13ce66"
            inactive-color="#858585"
            @change="setRoleVis"
          />
        </div>
        <div class="mt-20" />
        <el-button-group>
          <el-button
            :type="planeDir? '' : 'primary'"
            @click="setplaneDir(false)"
          >横向</el-button>
          <el-button
            :type="planeDir? 'primary' : ''"
            @click="setplaneDir(true)"
          >竖向</el-button>
        </el-button-group>
        <div class="setItem" style="margin-top:30px;">
          <div class="labPut">
            <div class="label">面片左右</div>
            <el-input-number v-model="rolePos.x" :min="-20" :max="20" label="描述文字" size="mini" @change="setRolePosX" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ -20 }}</div>
            <input
              v-model="rolePos.x"
              style="width: 160px"
              class="inputItem"
              type="range"
              max="20"
              min="-20"
              step="0.01"
              show-input
              @input="setRolePosX"
            >
            <div class="siderNum">{{ 20 }}</div>
          </div>
        </div>
        <div class="setItem">
          <div class="labPut">
            <div class="label">面片前后</div>
            <el-input-number v-model="rolePos.z" :min="-10" :max="10" label="描述文字" size="mini" @change="setRolePosZ" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ -10 }}</div>
            <input
              v-model="rolePos.z"
              style="width: 160px"
              class="inputItem"
              type="range"
              max="10"
              min="-10"
              step="0.01"
              show-input
              @input="setRolePosZ"
            >
            <div class="siderNum">{{ 10 }}</div>
          </div>
        </div>
        <div class="setItem">
          <div class="labPut">
            <div class="label">面片上下</div>
            <el-input-number v-model="rolePos.y" :min="-2" :max="10" label="描述文字" size="mini" @change="setRolePosY" />
          </div>
          <div class="siderItem">
            <div class="siderNum">{{ -2 }}</div>
            <input
              v-model="rolePos.y"
              style="width: 160px"
              class="inputItem"
              type="range"
              max="10"
              min="-2"
              step="0.01"
              show-input
              @input="setRolePosY"
            >
            <div class="siderNum">{{ 10 }}</div>
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
      roleVis: true,
      rolePos: {
        x: 0, y: 0, z: 0
      },
      planeDir: false
    }
  },
  mounted() {
    this.initEvent()
  },
  beforeDestroy() {
    this.removeEvent()
  },
  methods: {
    setplaneDir(data) {
      this.planeDir = data
      const dir = data ? 'vertical' : 'horizontal'
      window.StageApp.fire('StageHelper_setRolePlaneDirection', dir)
    },
    setRoleVis() {
      window.StageApp.fire('RoleVisibleSet', this.roleVis)
    },
    setRolePosX(e) {
      console.log('setRolePosX', this.rolePos.x)
      if (e.srcElement) this.rolePos.x = Number(e.srcElement.value)
      window.StageApp.fire('RolePositionSet', { pos: 'x', value: this.rolePos.x })
    },
    setRolePosY(e) {
      if (e.srcElement) this.rolePos.y = Number(e.srcElement.value)
      window.StageApp.fire('RolePositionSet', { pos: 'y', value: this.rolePos.y })
    },
    setRolePosZ(e) {
      if (e.srcElement) this.rolePos.z = Number(e.srcElement.value)
      window.StageApp.fire('RolePositionSet', { pos: 'z', value: this.rolePos.z })
    },
    // 添加监听
    initEvent() {
      this.$eventBus.$on('moduleFile', (data) => {
        console.log('opt-zujian 添加监听', data)
        if (data.roleplane?.arrangement[0]) {
          console.log('添加监听arrangement', data)
          const info = data.roleplane.arrangement[0]
          this.rolePos.x = info.x
          this.rolePos.y = info.y
          this.rolePos.z = info.z
          this.planeDir = info.direction === 'vertical'
        }
      })
    },
    // 移除监听
    removeEvent() {
      this.$eventBus.$off('moduleFile')
    }
  }
}
</script>

  <style lang="less" scoped>

  .zj-item-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }

  .zj-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

  }

  .mt-20 {
    margin-top: 20px;
  }
  </style>
  <style>
  </style>
