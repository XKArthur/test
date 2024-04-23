<template>
  <div class="upload-group">
    <!-- <div class="remove-btn btn-3d" @click="clearModel">
      <span>清空</span>
      <i class="el-icon-delete del-btn" />
    </div> -->
    <div class="titNum">已上传模型数: {{ modNum }} / 4</div>
    <div v-for="(data, i) in mudelArr" :key="data.idx">
      <div v-if="!data.file1" class="addModule">
        <input
          id="file_model"
          type="file"
          @change="uploadModel($event, data.idx)"
        >
        <span class="addModuleLab">上传FBX模型</span>
      </div>

      <div v-if="data.file1" class="modelbg">
        <div class="modTitle">
          <div class="modWord">{{ data.name }}</div>
          <i class="el-icon-delete delMod" @click="deleteModelMapping(i)" />
        </div>
        <div v-if="!data.file2" class="addImg">
          <input
            id="file_model"
            type="file"
            @change="uploadMapping($event, data.idx)"
          >
          <span class="addModuleLab">上传纹理贴图</span>
        </div>

        <div class="modBox" style="padding: 0 20px">
          <div v-if="data.file2" class="ImgMod">
            <div class="modPropsName"> 纹理贴图</div>
            <div class="tihuanLabBox">
              <span style="font-size:12px">{{ data.imgName }}</span>
              <div class="tihuanLab">
                <input
                  id="file_model"
                  type="file"
                  @change="uploadMapping($event, data.idx)"
                >
                <span style="cursor: pointer;">替换</span>
                <!-- <input id="file_model" type="file" @change="uploadMapping"> -->
              </div>
            </div>
          </div>

          <div v-if="data.file2">
            <div class="lightSet" style="margin-top: 10px">
            <div class="modPropsName">光照着色模式</div>
            </div>
            <!-- <div class="selectD">
              <div
                v-for="item in lightMudel"
                :key="item.data"
                class="SelcetGrop"
                @click="setLightType(item.data, data.idx)"
              >
                <div
                  class="selectMod"
                  :class="data.lightType === item.data ? 'active' : ''"
                >
                  <div v-if="data.lightType === item.data" class="crelie" />
                </div>
                <span style="font-size: 12px; margin-left: 5px">{{
                  item.lable
                }}</span>
              </div>
            </div> -->
            <div class="newSelect">
              <div
                v-for="item in newLightMudel"
                :key="item.data"
                class="newSelectGrop"
                @click="setLightType(item.data, data.idx)"
              >
                <div
                  class="selectMod"
                  :class="data.lightType === item.data ? 'active' : ''"
                >
                  <div v-if="data.lightType === item.data" class="crelie" />
                </div>
                <span style="font-size: 12px; margin-left: 5px; line-height: 20px">{{
                  item.lable
                }}</span>
              </div>
            </div>
            <div v-if="data.lightType">

              <div class="modPropsName">材质属性</div>

              <div v-if="data.lightType" class="envMod">
                <div>
                  <span style="font-size: 12px">接受环境反射</span>
                </div>
                <el-switch
                  v-model="data.value"
                  class="selectLight"
                  active-color="#13ce66"
                  inactive-color="#858585"
                  @change="changeLightType(data.idx)"
                />
              </div>

              <div class="Mo-item">
                <div class="moLabPut">金属度</div>
                <div class="siderModItem">
                  <div class="siderModNum">{{ 0 }}</div>
                  <input
                    v-model="data.metalRotia"
                    style="width: 120px"
                    class="inputItem"
                    type="range"
                    max="1"
                    min="0"
                    step="0.01"
                    show-input
                    @input="setMetalRotia(data.idx)"
                  >
                  <div class="siderModNum">{{ 1 }}</div>
                </div>
              </div>
              <div class="Mo-item">
                <div class="moLabPut">粗糙度</div>
                <div class="siderModItem">
                  <div class="siderModNum">{{ 0 }}</div>
                  <input
                    v-model="data.roughRotia"
                    style="width: 120px"
                    class="inputItem"
                    type="range"
                    max="1"
                    min="0"
                    step="0.01"
                    show-input
                    @input="setRoughRotia(data.idx)"
                  >
                  <div class="siderModNum">{{ 1 }}</div>
                </div>
              </div>

              <div class="Mo-item">
                <div class="moLabPut">环境反射</div>
                <div class="siderModItem">
                  <div class="siderModNum">{{ 0 }}</div>
                  <input
                    v-model="data.envRotia"
                    style="width: 120px"
                    class="inputItem"
                    type="range"
                    max="3"
                    min="0"
                    step="0.01"
                    show-input
                    @input="setEnvRotia(data.idx)"
                  >
                  <div class="siderModNum">{{ 3 }}</div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>

    <div v-if="showAddModel" class="botLab" @click="addMudel">
      <span class="modelLab">+ 继续添加下一个模型</span>
    </div>

    <div class="bottom-space"></div>

    <!-- <div v-if="file1" class="fileName">模型: {{ file1 }}</div>
    <div v-if="file2" class="fileName">贴图: {{ file2 }}</div> -->
  </div>
  <!-- <div class="modul-group">
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      envRotia: 0,
      roughRotia: 0,
      metalRotia: 0,
      mudelArr: [],
      mudelInfo: {
        metalRotia: 1.0,
        roughRotia: 0.125,
        envRotia: 1,
        idx: 0,
        value: false,
        name: '',
        imgName: '',
        file1: '',
        file2: '',
        lightType: 0,
        lightStrength: 0.3
      },
      modNum: 0,
      showAddModel: false,
      value: false,
      name: '',
      imgName: '',
      file1: '',
      file2: '',
      lightType: 0,
      lightStrength: 0.3,
      newLightMudel: [
        { lable: '不使用光照,直接使用贴图颜色', data: 0 },
        { lable: '贴图叠加光照着色', data: 1 }
      ],
      lightMudel: [
        { lable: '正片叠底', data: 0 },
        { lable: '线性混合', data: 1 },
        { lable: '变亮叠加', data: 2 }
      ]
    }
  },
  mounted() {
    this.mudelArr.push(JSON.parse(JSON.stringify(this.mudelInfo)))
    this.initEvent()
    this.$parent.mudelMesh = this.mudelArr
  },
  beforeDestroy() {
    this.removeEvent()
  },
  methods: {
    setEnvRotia(idx) {
      // if (e.srcElement) this.envRotia = e.srcElement.value
      const data = { idx: idx, params: {
        property: 'envMapIntensity',
        value: this.mudelArr[idx].envRotia }}
      console.log('setEnvRotia', data, idx)
      window.StageApp.fire('StageEditor_setMater', data)
    },
    setRoughRotia(idx) {
      const data = { idx: idx, params: {
        property: 'roughness',
        value: this.mudelArr[idx].roughRotia }}
      console.log('setRoughRotia', data, idx)
      window.StageApp.fire('StageEditor_setMater', data)
    },
    setMetalRotia(idx) {
      const data = { idx: idx, params: {
        property: 'metalness',
        value: this.mudelArr[idx].metalRotia }}
      console.log('setMetalRotia', data, idx)
      window.StageApp.fire('StageEditor_setMater', data)
    },
    clearModel() {
      this.mudelArr.splice(0, this.mudelArr.length)
      this.modNum = 0
      this.mudelArr.push(JSON.parse(JSON.stringify(this.mudelInfo)))
      this.showAddModel = false
    },
    addMudel() {
      const info = JSON.parse(JSON.stringify(this.mudelInfo))
      info.idx = this.mudelArr.length
      this.mudelArr.push(info)
      this.showAddModel = false
    },
    changelightStrength(idx) {
      const data = { idx: idx, value: this.mudelArr[idx].lightStrength }
      window.StageApp.fire('StageEditor_setEnvMapReflectivity', data)
    },
    changeLightType(idx) {
      const data = {
        idx: idx,
        params: {
          bUsingEnvmap: this.mudelArr[idx].value
        }
      }
      window.StageApp.fire('StageEditor_setEnvironment', data)
    },
    setLightType(vue, idx) {
      // this.lightType = vue
      this.mudelArr[idx].lightType = vue
      if (!this.mudelArr[idx].file2) {
        this.$message.warning('请先上传模型~')
        return
      }
      let type = 'shadeless'
      if (this.mudelArr[idx].lightType) type = 'pbr'
      const data = {
        idx: idx,
        type: type
      }
      window.StageApp.fire('StageEditor_setShadingMode', data)
    },
    // 添加监听
    initEvent() {
      const self = this
      this.$eventBus.$on('moduleFile', (data) => {
        console.log('模型tab页收到data：', data)
        self.mudelArr.splice(0, this.mudelArr.length)
        this.modNum = data.meshes.length
        for (let i = 0; i < data.meshes.length; ++i) {
          const item = data.meshes[i]
          const info = JSON.parse(JSON.stringify(self.mudelInfo))
          info.idx = i
          info.value = item.material.reflect
          info.name = item.asset_model_name
          info.imgName = item.asset_textures.diffuse_map_name
          info.file1 = item.asset_model
          info.file2 = item.asset_textures.diffuse_map
          if (item.material.shading_model === 'pbr') { info.lightType = 1 } else { info.lightType = 0 }
          info.lightStrength = item.material.reflectivity
          info.envRotia = item.material.envMapIntensity
          info.roughRotia = item.material.roughness
          info.metalRotia = item.material.metalness
          self.mudelArr.push(info)
        }
        if (
          !self.mudelArr[self.mudelArr.length - 1].file1 ||
          self.mudelArr.length >= 3
        ) {
          console.log('initEventfalse')
          self.showAddModel = false
        } else {
          console.log('initEventttrue')
          self.showAddModel = true
        }
      })
      this.$eventBus.$on('moduleUrl', (data) => {
        // this.file1 = data
      })
      this.$eventBus.$on('texUrl', (data) => {
        // this.file2 = data
      })
    },
    // 移除监听
    removeEvent() {
      this.$eventBus.$off('moduleFile')
      this.$eventBus.$off('moduleUrl')
      this.$eventBus.$off('texUrl')
    },
    // 删除模型 贴图
    deleteModelMapping(idx) {
      this.mudelArr.splice(idx, 1)
      this.modNum = this.mudelArr.length
      window.StageApp.fire('StageEditor_deleteModel', idx)
      this.$message.success('模型资源已移除')
      if (this.mudelArr.length <= 0) {
        this.mudelArr.push(JSON.parse(JSON.stringify(this.mudelInfo)))
        this.showAddModel = false
      } else {
        this.showAddModel = true
      }
    },
    // 上传模型
    uploadModel(e, idx) {
      const file = e.target.files[0]
      this.mudelArr[idx].file1 = file // e.target.value
      this.mudelArr[idx].name = file.name
      this.modNum = this.mudelArr.length
      if (
        !this.mudelArr[this.mudelArr.length - 1].file1 ||
        this.mudelArr.length >= 4
      ) {
        this.showAddModel = false
      } else {
        this.showAddModel = true
      }
      console.log('initEvent', file, idx)
      if (file) {
        window.StageApp.fire('StageEditor_loadLocalModel', file)
      }
    },
    // 上传贴图
    uploadMapping(e, idx) {
      console.log('!this.file1', !this.file1)
      if (!this.mudelArr[idx].file1) {
        this.$message.warning('请先上传模型~')
        return
      }
      const file = e.target.files[0]
      this.mudelArr[idx].file2 = file // e.target.value
      console.log('initEventIMG', file)
      this.mudelArr[idx].imgName = file.name
      if (file) {
        const data = { idx: idx, file: file }
        window.StageApp.fire('StageEditor_loadLocalTexture', data)
      }
    }
  }
}
</script>

<style>
#file_model {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.bottom-space {
  height: 100px;
}
</style>
