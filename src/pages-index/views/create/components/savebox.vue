<template>
  <div class="save-box">
    <div class="scene-name-box">
      <div class="scene-tit">
        场景名称：<el-tooltip
          class="item"
          effect="dark"
          content="默认名称：新建场景"
          placement="right"
        >
          <i class="el-icon-question" style="font-size: 18px" />
        </el-tooltip>
      </div>

      <el-input v-model="sceneName" placeholder="新建场景" />
    </div>
    <div class="scene-name-box">
      <div class="scene-tit">
        场景价格：
        <el-tooltip
          class="item"
          effect="dark"
          content="场景累计小时，需支付的费用"
          placement="right"
        >
          <i class="el-icon-question" style="font-size: 18px" />
        </el-tooltip>
      </div>
      <el-input-number
        v-model="scenePrice"
        :precision="2"
        :step="0.1"
        :max="10000"
        :min="0.01"
      />
    </div>
    <div
      class="save-btn btn-3d"
      style="background: #ffe495"
      @click="saveConfig"
    >
      保存场景
    </div>

    <el-dialog title="提示" :visible.sync="loadingBox" width="300px" center>
      <div class="show-loading">
        <i class="el-icon-loading" />
      </div>
      <div class="show-load-txt">正在处理资源上传。。。</div>
    </el-dialog>
  </div>
</template>

<script>
import { addfilterdata, editfilterdata } from '@/api/tablelist'
import { parseTime } from '@/utils/index.js'
import { genID } from '@/utils/tools'
import uploadOss from '@/sh-oss-sdk'

export default {
  data() {
    return {
      rowid: '', // 数据库id
      sceneName: '', // 名称
      scenePrice: 12.34, // 价格
      loadingBox: false // 显示 loading
    }
  },
  watch: {},
  // 添加监听
  mounted() {
    const rowid = this.$route.query.rowid
    if (rowid) {
      this.rowid = rowid
    }

    this.initEvent()
  },
  // 移除监听
  beforeDestroy() {
    this.removeEvent()
  },

  methods: {
    initEvent() {
      this.$eventBus.$on('sceneMesg', (data) => {
        // console.log('meetingconfig', data)
        this.scenePrice = data.scene_price
        this.sceneName = data.sname
      })
    },
    removeEvent() {
      this.$eventBus.$off('sceneMesg')
    },
    // 保存场景
    async saveConfig() {
      console.log('保存场景')
      this.loadingBox = true
      const upRes = await this.uploadThing()
      console.log('提交数据', upRes)
      if (upRes) {
        this.coverImage = await this.saveImage()
        if (this.rowid) {
          this.upDateConfig(upRes)
        } else {
          this.submitConfig(upRes)
        }
      } else {
        this.loadingBox = false
      }
    },

    // 上传场景文件
    async uploadThing() {
      const theConfig = this.$parent.glClient?.editor.getConfig() || {}
      console.log('======>', theConfig)
      const data_model =
        document.getElementById('file_model')?.files?.[0] || ''
      const data_tex = document.getElementById('file_tex')?.files?.[0] || ''
      if (!this.rowid) {
        if (!data_model) {
          this.$message.warning('选择要提交模型文件先')
          return
        }
        if (!data_tex) {
          this.$message.warning('选择要提交贴图文件先')
          return
        }
      }

      const thestage = theConfig.stage

      if (data_model) {
        const res1 = await uploadOss(data_model)
        console.log('上传文件 ', res1)
        if (res1.url) {
          // console.log('[修改模型]')
          thestage.path_model = res1.url
          document.getElementById('file_model').value = ''
          this.$eventBus.$emit('moduleUrl', res1.url)
        } else {
          this.$message.warning('模型上传失败')
          this.loadingBox = false
          return
        }
      }
      if (data_tex) {
        const res2 = await uploadOss(data_tex)
        console.log('上传文件 ', res2)
        if (res2.url) {
          console.log('[修改贴图]')
          thestage.path_tex = res2.url
          document.getElementById('file_tex').value = ''
          this.$eventBus.$emit('texUrl', res2.url)
        } else {
          this.$message.warning('贴图上传失败')
          this.loadingBox = false
          return
        }
      }

      return new Promise((res, rej) => {
        return res(theConfig)
      })
    },
    // 提交数据
    submitConfig(data) {
      addfilterdata({
        worksheetDesc: '平台商品',
        meetingconfig: JSON.stringify(data),
        update_time: parseTime(new Date()),
        cover_picture: this.coverImage,
        scene_price: this.scenePrice,
        sname:
          this.sceneName || `新建场景${parseTime(new Date(), '{y}{m}{d}')}`,
        id: genID(1)
      })
        .then((res) => {
          console.log('[提交数据]', res)
          this.$message.success('保存成功')
          this.rowid = res.rowId
          this.$router.replace({
            path: '/create',
            query: {
              rowid: res.rowId
            }
          })
        })
        .catch((err) => {
          console.log('[提交数据 err ]', err)
          this.$message.warning('保存失败')
        })
      this.loadingBox = false
    },

    // 更新数据
    upDateConfig(data) {
      editfilterdata({
        worksheetDesc: '平台商品',
        rowId: this.rowid,
        meetingconfig: JSON.stringify(data),
        update_time: parseTime(new Date()),
        cover_picture: this.coverImage,
        scene_price: this.scenePrice,
        sname:
          this.sceneName || `新建场景${parseTime(new Date(), '{y}{m}{d}')}`
      })
        .then((res) => {
          console.log('[更新数据]', res)
          this.$message.success('更新成功')
          setTimeout(() => {
            // window.location.reload()
          }, 1000)
        })
        .catch((err) => {
          console.log('[更新数据 err ]', err)
          this.$message.warning('保存失败')
        })
      this.loadingBox = false
    },
    async saveImage() {
      var canvas = document.querySelector('#playContainer canvas')
      // console.log('保存封面', canvas)
      var base64Data = canvas.toDataURL('image/jpeg')
      var data = this.dataURItoBlob(base64Data)
      // var data = new window.OSS.Buffer(base64Data, 'base64')
      data.name = 'image.jpg'
      const res1 = await uploadOss(data)
      console.log('上传封面 ', res1)
      return new Promise((res, rej) => {
        return res(res1.url)
      })
    },
    dataURItoBlob(base64Data) {
      var byteString
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1])
      } else {
        byteString = unescape(base64Data.split(',')[1])
      }
      var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
      var ia = new Uint8Array(byteString.length)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], { type: mimeString })
    }
  }
}
</script>

<style></style>
