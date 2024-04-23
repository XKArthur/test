<template>
  <div class="top-box">
    <div class="logo-box">
      <img
        class="goback"
        style="height: 40px"
        src="https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211215/shdc05549af.png"
        alt=""
        @click="$router.back()"
      >
    </div>
    <!-- <div class="switch-box"> -->
    <!-- <el-switch
        v-model="value2"
        class="switch-item"
        inactive-text="横向面片"
        active-text="竖向面片"
      /> -->
    <!-- <el-switch
        v-model="value3"
        class="switch-item"
        inactive-text="展示辅助坐标"
      /> -->
    <!-- </div> -->
    <button class="saveButton" @click="dialogFormVisible = true">
      <span class="txt2">保存场景</span>
    </button>

    <el-dialog
      title="保存场景"
      :visible.sync="dialogFormVisible"
      :width="'600px'"
    >
      <el-form :model="form">
        <el-form-item label="场景名称" :label-width="'120px'">
          <el-input
            v-model="sceneName"
            autocomplete="off"
            style="width: 380px"
          />
        </el-form-item>
        <!-- <el-form-item label="场景价格" :label-width="'120px'">
          <el-input
            v-model="scenePrice"
            autocomplete="off"
            style="width: 380px"
          />
        </el-form-item> -->
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="display: flex; justify-content: center; align-items: center"
      >
        <el-button @click="closeDlog">取 消</el-button>
        <el-button type="primary" @click="saveScene">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="loadingBox" width="300px" center>
      <div class="show-loading">
        <i class="el-icon-loading" />
      </div>
      <div class="show-load-txt">正在处理资源上传。。。</div>
    </el-dialog>
  </div>
</template>

<script>
import uploadOss from '@/sh-oss-sdk'
import { addfilterdata, editfilterdata } from '@/api/tablelist'
import { parseTime } from '@/utils/index.js'
import { genID } from '@/utils/tools'
export default {
  data() {
    return {
      demo: false,
      rowid: '',
      sceneName: '', // 名称
      scenePrice: 12.34, // 价格
      form: {},
      value2: true,
      value3: false,
      dialogFormVisible: false,
      loadingBox: false
    }
  },
  watch: {
    value2(curVal) {
      // console.log('展示人物面片', curVal)
      const dir = curVal ? 'vertical' : 'horizontal'
      window.StageApp.fire('StageHelper_setRolePlaneDirection', dir)
      // window.StageApp.fire('StageHelper_setRolePlaneVisible', curVal)
    },
    value3(curVal) {
      // console.log('展示辅助坐标', curVal)
      window.StageApp.fire('StageHelper_setAxesVisible', curVal)
    }
  },
  mounted() {
    const rowid = this.$route.query.rowid
    const demo = this.$route.query.demo
    if (rowid) {
      this.rowid = rowid
    }
    if (demo) {
      this.demo = demo
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
    closeDlog() {
      this.dialogFormVisible = false
    },
    saveScene() {
      this.saveConfig()
      // this.dialogFormVisible = false
    },
    async saveConfig() {
      console.log('保存场景')
      this.loadingBox = true
      const upRes = await this.uploadThing()
      console.log('提交数据', upRes)
      if (upRes) {
        this.coverImage = await this.saveImage()
        if (this.demo) {
          this.submitConfig(upRes)
        } else if (this.rowid) {
          this.upDateConfig(upRes)
        } else {
          this.submitConfig(upRes)
        }
      } else {
        this.loadingBox = false
        this.dialogFormVisible = false
      }
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
    },
    async uploadThing() {
      const theConfig = this.$parent.glClient?.editor.getConfig() || {}
      console.log('uploadThing', this.$parent.glClient.editor)
      const mesh = this.$parent.mudelMesh
      console.log('======>', theConfig, mesh)
      for (let i = 0; i < mesh.length; ++i) {
        const data_model = mesh[i].file1 || ''
        const data_tex = mesh[i].file2 || ''
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

        const thestage = theConfig.meshes[i]

        if (data_model) {
          if (data_model.name) {
            const res1 = await uploadOss(data_model)
            console.log('上传文件 ', res1)
            if (res1.url) {
              // console.log('[修改模型]')
              thestage.asset_model = res1.url
              thestage.asset_model_name = mesh[i].name
              // document.getElementById('file_model').value = ''
              // this.$eventBus.$emit('moduleUrl', res1.url)
            } else {
              this.$message.warning('模型上传失败')
              this.loadingBox = false
              return
            }
          } else {
            thestage.asset_model = data_model
            thestage.asset_model_name = mesh[i].name
          }
        }
        if (data_tex) {
          if (data_tex.name) {
            const res2 = await uploadOss(data_tex)
            console.log('上传文件 ', res2)
            if (res2.url) {
              console.log('[修改贴图]')
              thestage.asset_textures.diffuse_map = res2.url
              thestage.asset_textures.diffuse_map_name = mesh[i].imgName
              // document.getElementById('file_tex').value = ''
              // this.$eventBus.$emit('texUrl', res2.url)
            } else {
              this.$message.warning('贴图上传失败')
              this.loadingBox = false
              return
            }
          } else {
            thestage.asset_textures.diffuse_map = data_tex
            thestage.asset_textures.diffuse_map_name = mesh[i].imgName
          }
        }
      }

      return new Promise((res, rej) => {
        return res(theConfig)
      })
    },
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
      this.dialogFormVisible = false
    },
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
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.top-box {
  display: flex;
  justify-content: space-between;
  background: #181819;
}
.logo-box {
  display: inline-block;
  height: 40px;
  font-size: 0;
  line-height: 0;
}
.goback {
  cursor: pointer;
}
.switch-box {
  // float: left;
  color: #fff;
  padding-top: 10px;
  margin-left: 140px;
  .switch-item {
    margin-left: 20px;
  }
}

::v-deep {
  .el-switch__label {
    color: #fff;
    font-size: 14px;
  }
}
.saveButton {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 40px;
  border: none;
  outline: none;
  background-color: rgba(6, 83, 217, 1);
  cursor: pointer;

  &:hover {
    background-color: rgb(42, 120, 254);
  }

}
.txt2 {
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-family: PingFangSC-Semibold;
  white-space: nowrap;
  line-height: 17px;
  text-align: right;
}
</style>
