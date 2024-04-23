<template>
  <div style="padding-top: 20px">
    <div class="scene-tit">背景设置</div>
    <div v-loading="loading" class="btn-3d mar-t-10">
      <el-button-group>
        <el-button
          class="btn-background"
          :type="useBackground===0 ? 'primary' : ''"
          @click="setBackground(0)"
        >无</el-button>
        <el-button
          class="btn-background"
          :type="useBackground===1 ? 'primary' : ''"
          @click="setBackground(1)"
        >图片</el-button>
        <el-button
          class="btn-background"
          :type="useBackground===2 ? 'primary' : ''"
          @click="setBackground(2)"
        >视频</el-button>
      </el-button-group>
      <div v-if="useBackground===1">
        <el-button
          v-show="!urlBackground"
          class="upbg"
          style="width: 100%; margin-top: 10px"
          type="primary"
        >
          上传图片
          <input id="file_bg" type="file" @change="uploadBackground">
        </el-button>
        <el-popover
          v-show="urlBackground"
          v-model="showRomoveBg"
          placement="right"
        >
          <p>确定删除吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="primary" type="mini" @click="removeBackground">
              确定
            </el-button>
            <el-button type="mini" size="text" @click="showRomoveBg = false">
              取消
            </el-button>
          </div>
          <el-button slot="reference" style="width: 100%; margin-top: 10px">
            删除
          </el-button>
        </el-popover>
        <div v-if="urlBackground" class="fileName">
          {{ urlBackground }}
        </div>
      </div>
      <div v-if="useBackground===2">
        <el-button
          v-show="!urlBackground"
          class="upbg"
          style="width: 100%; margin-top: 10px"
          type="primary"
        >
          上传视频（ MP4格式，小于50MB ）
          <input id="file_bg" type="file" @change="uploadBackgroundVideo">
        </el-button>
        <el-popover
          v-show="urlBackground"
          v-model="showRomoveBg"
          placement="right"
        >
          <p>确定删除吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="primary" type="mini" @click="removeBackground">
              确定
            </el-button>
            <el-button type="mini" size="text" @click="showRomoveBg = false">
              取消
            </el-button>
          </div>
          <el-button slot="reference" style="width: 100%; margin-top: 10px">
            删除
          </el-button>
        </el-popover>
        <div v-if="urlBackground" class="fileName">
          {{ urlBackground }}
        </div>
      </div>

      <div class="divider" style="margin-top: 40px" />

      <div class="btn-3d" style="cursor: auto;margin-top: 20px">
        <div class="cz-opt">
          <div class="zj-item-toggle">
            <span class="scene-tit"> 环境灯光 </span>
          </div>
          <div class="setItem" style="margin-top: 20px">
            <div class="labPut">
              <div class="label">环境灯光颜色</div>
              <el-color-picker v-model="color" size="mini" @change="setColor" />
            </div>
          </div>
          <div class="setItem">
            <div class="labPut">
              <div class="label" style="width: 80px">灯光强度</div>
              <el-input-number
                v-model="colorStrength"
                :min="0"
                :max="2"
                @change="setColorStrength"
              />
            </div>
            <div class="siderItem">
              <div class="siderNum">{{ 0 }}</div>
              <input
                style="width: 160px"
                class="inputItem"
                type="range"
                max="2"
                min="0"
                step="0.01"
                show-input
                :value="colorStrength"
                @input="setColorStrength"
              >
              <div class="siderNum">{{ 2 }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="divider" style="margin-top: 40px" />

      <div class="btn-3d" style="display:none; cursor: auto; margin-top: 20px;">
        <div class="cz-opt">
          <div class="zj-item-toggle">
            <span class="scene-tit"> 后处理效果 </span>
            <el-switch
              v-model="showPoster"
              class="selectLight"
              active-color="#13ce66"
              inactive-color="#858585"
              @change="setShowPoster"
            />
          </div>
          <div v-if="showPoster" class="bloomItem">
            <div class="zj-item-toggle">
              <el-switch
                v-model="isbloom"
                active-color="#13ce66"
                inactive-color="#858585"
                @change="setIsbloom"
              />
              <span class="scene-tit"> bloom光晕 </span>
            </div>
            <div v-if="isbloom" class="Mo-item">
              <div class="moLabPut">光晕阈值</div>
              <div class="siderModItem">
                <div class="siderModNum">{{ 0 }}</div>
                <input
                  v-model="lightRotia.threshold"
                  style="width: 120px"
                  class="inputItem"
                  type="range"
                  max="1"
                  min="0"
                  step="0.01"
                  show-input
                  @input="setLightMetalRotia()"
                >
                <div class="siderModNum">{{ 1 }}</div>
              </div>
            </div>
            <div v-if="isbloom" class="Mo-item">
              <div class="moLabPut">光晕强度</div>
              <div class="siderModItem">
                <div class="siderModNum">{{ 0 }}</div>
                <input
                  v-model="lightRotia.strength"
                  style="width: 120px"
                  class="inputItem"
                  type="range"
                  max="1"
                  min="0"
                  step="0.01"
                  show-input
                  @input="setLightRoughRotia()"
                >
                <div class="siderModNum">{{ 1 }}</div>
              </div>
            </div>
            <div v-if="isbloom" class="Mo-item">
              <div class="moLabPut">光晕半径</div>
              <div class="siderModItem">
                <div class="siderModNum">{{ 0 }}</div>
                <input
                  v-model="lightRotia.radius"
                  style="width: 120px"
                  class="inputItem"
                  type="range"
                  max="1"
                  min="0"
                  step="0.01"
                  show-input
                  @input="setLightEnvRotia()"
                >
                <div class="siderModNum">{{ 1 }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import uploadOss from '@/sh-oss-sdk'
export default {
  data() {
    return {
      lightRotia: {
        radius: 0,
        strength: 0,
        threshold: 0
      },
      isbloom: false,
      showPoster: false,
      colorStrength: 1,
      color: '#ffffff',
      loading: false,
      urlBackground: '',
      showRomoveBg: false,
      useBackground: 0
    }
  },
  mounted() {
    this.initEvent()
  },
  beforeDestroy() {
    this.removeEvent()
  },
  methods: {
    setIsbloom() {
      window?.StageApp.fire('PostsSet_bloomOpen', this.isbloom)
    },
    setShowPoster() {
      window?.StageApp.fire('PostsSet_Open', this.showPoster)
    },
    setLightEnvRotia() {
      // console.log('setLightEnvRotia', this.lightRotia.radius)
      window?.StageApp.fire('PostsSet_Bloom', { type: 'radius', value: this.lightRotia.radius })
    },
    setLightRoughRotia() {
      // console.log('setLightRoughRotia', this.lightRotia.strength)
      window?.StageApp.fire('PostsSet_Bloom', { type: 'strength', value: this.lightRotia.strength })
    },
    setLightMetalRotia() {
      // console.log('setLightMetalRotia', this.lightRotia.threshold)
      window?.StageApp.fire('PostsSet_Bloom', { type: 'threshold', value: this.lightRotia.threshold })
    },
    setColorStrength(e) {
      if (e.srcElement) this.colorStrength = e.srcElement.value
      window?.StageApp.fire('LightsSet_strength', this.colorStrength)
    },
    setColor(e) {
      console.log('LightsSet_Color', e)
       window?.StageApp.fire('LightsSet_Color', this.color)
    },
    // 添加监听
    initEvent() {
      this.$eventBus.$on('moduleFile', (data) => {
        console.log('添加监听background', data)
        if (data.background?.src) {
          this.urlBackground = data.background?.src
          this.useBackground = 1
        }
        if (data.lights.ambient_light) {
          this.color = data.lights.ambient_light.color
          console.log('this.color', this.color)
          this.colorStrength = data.lights.ambient_light.intensity
        }
        if (data.postprocessing?.bloom) {
          const item = data.postprocessing.bloom
          this.isbloom = item.use
          this.lightRotia.radius = item.radius
          this.lightRotia.strength = item.strength
          this.lightRotia.threshold = item.threshold
        }
      })
    },

    HexToRgb(str) {
      var r = /^\#?[0-9a-f]{6}$/
      if (!r.test(str)) return window.alert('输入hex颜色值有误！！！')
      // test方法检查在字符串中是否存在一个模式，如果存在则返回true，否则返回false
      str = str.replace('#', '')
      // 替换查找的到的字符串
      var hxs = str.match(/../g)
      // 得到查询数组
      for (var i = 0; i < 3; i++) {
        hxs[i] = parseInt(hxs[i], 16)
      }
      return hxs
    },
    // 移除监听
    removeEvent() {
      this.$eventBus.$off('moduleFile')
    },
    // 设置背景图
    setBackground(type) {
      this.useBackground = type

      switch (type) {
        case 0:
          window.StageApp.fire('StageEditor_setBackground', {
            type: 'none'
          })
          break
        case 1:
          this.urlBackground && window.StageApp.fire('StageEditor_setBackground', {
            type: 'image',
            src: this.urlBackground
          })
          break
        case 2:
          this.urlBackground && window.StageApp.fire('StageEditor_setBackground', {
            type: 'video',
            src: this.urlBackground
          })
          break

        default:
          break
      }

      // if (type === 0) {
      //   window.StageApp.fire('StageEditor_setBackground', {
      //     type: 'none'
      //   })
      // } else {
      //   if (this.urlBackground) {
      //     window.StageApp.fire('StageEditor_setBackground', {
      //       type: 'image',
      //       src: this.urlBackground
      //     })
      //   }
      // }
    },
    // /上传视频
    async uploadBackgroundVideo(e) {
      // const file = e.target.files[0]
      // if (file) {
      //   window.StageApp.fire('StageEditor_loadLocalModel', file)
      // }
      const data_file = document.getElementById('file_bg').files[0]
      console.log('上传的文件 ', data_file)
      if (data_file && data_file.size < 50 * 1024 * 1024) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 5000)
        this.urlBackground = e.target.value
        const res1 = await uploadOss(data_file)
        console.log('上传文件 ', res1)
        if (res1.url) {
          document.getElementById('file_bg').value = ''
          this.urlBackground = res1.url
          this.loading = false
          window.StageApp.fire('StageEditor_setBackground', {
            type: 'video',
            src: this.urlBackground
          })
        } else {
          this.$message.warning('背景图上传失败')
          this.loading = false
          return
        }
      } else {
        this.$message.warning('背景图上传失败,限制10m以内')
      }
    },
    // 上传背景图
    async uploadBackground(e) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 5000)
      this.urlBackground = e.target.value
      // const file = e.target.files[0]
      // if (file) {
      //   window.StageApp.fire('StageEditor_loadLocalModel', file)
      // }
      const data_file = document.getElementById('file_bg').files[0]
      if (data_file) {
        const res1 = await uploadOss(data_file)
        console.log('上传文件 ', res1)
        if (res1.url) {
          document.getElementById('file_bg').value = ''
          this.urlBackground = res1.url
          this.loading = false
          window.StageApp.fire('StageEditor_setBackground', {
            type: 'image',
            src: this.urlBackground
          })
        } else {
          this.$message.warning('背景图上传失败')
          this.loading = false
          return
        }
      }
    },
    // 移除背景屏
    removeBackground() {
      this.showRomoveBg = false
      this.urlBackground = ''
      window.StageApp.fire('StageEditor_deleteBackground')
    }
  }
}
</script>

<style>
  .el-color-picker--mini .el-color-picker__trigger {
    width: 120px;
  }
</style>
