<template>
  <div>
    <div class="scene-title">
      <div style="margin: 30px 20px 0; display: inline-block">
        已经提交的场景
        <span
          style="font-size: 12px; color: #999; font-weight: normal"
        >（双击鼠标，编辑场景）</span>
      </div>
    </div>
    <div v-if="showEmpty">
      <el-empty :image-size="200" />
    </div>
    <div
      v-else
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.3)"
    >
      <div
        v-for="item in scenelist"
        :key="item.rowid"
        class="scene-box"
        @dblclick="gotoDetail(item.rowid)"
      >
        <!-- @click="gotoDetail(item.rowid)" -->
        <div class="scene-img">
          <img
            :src="
              item.cover_picture ||
                'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211122/shd4ad72a0d.jpg'
            "
            alt="封面图"
          >
        </div>
        <div class="scene-name">{{ item.sname || "新建场景" }}</div>
        <!-- <div class="scene-ud">价格：{{ item.scene_price }}/小时</div> -->
        <!-- <div class="scene-ud">
          更新: {{ item.update_time || "long long ago ~" }}
        </div> -->
        <i class="el-icon-delete scene-del" @click.stop="removeScene(item)" />
        <i
          class="el-icon-upload2 scene-edit"
          @click.stop="showSceneOption(item)"
        />
      </div>
    </div>
    <!-- 配置弹框 -->
    <el-dialog
      title="上传场景至开发者渠道"
      :visible.sync="showOption"
      width="600px"
      center
      :close-on-click-modal="false"
    >
      <!-- <span style="margin-left: 20%">是否将当前场景，上传至您同名账号下的开发者渠道</span> -->
      <el-radio v-model="radio" label="1">上传至您同名账号下的开发者渠道</el-radio><br>
      <el-radio v-model="radio" label="2" style="margin: 10px 0;">其他账号下的开发者渠道</el-radio><br>
      <input v-if="radio === '2'" v-model="otherID" style="margin-left: 22px;" type="text" placeholder="请输入开发者渠道ID">
      <span slot="footer" class="dialog-footer">
        <el-button @click="showOption = false">取 消</el-button>
        <el-button type="primary" @click="saveSceneOption">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addfilterdata, getfilterdata, deleterowid } from '@/api/tablelist'
import { getUserInfo } from '@/utils/auth'
export default {
  data() {
    return {
      labelPosition: 'left', // 对齐方式
      sceneChannel: [], // 要上架的渠道
      scenePutChannel: false, // 下降 所有渠道
      saveLoading: false, // 保存配置信息
      showOption: false, // 显示 场景的对应配置
      currentScene: {}, // 当前渠道
      channelList: [],
      otherID: '',
      radio: '1',
      loading: true,
      showEmpty: false,
      scenelist: ''
    }
  },

  mounted() {
    this.initData()
    this.getChannelList()
  },

  methods: {
    initData() {
      this.getMineSceneList()
    },
    // 获取我的 场景列表
    getMineSceneList() {
      getfilterdata({
        worksheetDesc: '平台商品',
        pageNo: 1,
        pageSize: 120
      })
        .then((res) => {
          // console.log('[平台商品]', res)
          if (res?.data?.data?.rows) {
            this.scenelist = res?.data?.data?.rows
            if (!this.scenelist || this.scenelist.length < 1) {
              this.showEmpty = true
            }
          }
          this.loading = false
          console.log('[平台商品]', this.scenelist)
        })
        .catch((err) => {
          console.log('[平台商品 err ]', err)
        })
    },
    // 获取渠道列表
    getChannelList() {
      var uInfo = getUserInfo()
      console.log('getChannelList', uInfo)
      getfilterdata({
        worksheetDesc: '开发者渠道',
        pageNo: 1,
        pageSize: 300
      })
        .then((res) => {
          console.log('[渠道列表111 ]', res)
          this.channelList = res.data.data.rows.map((item) => {
            if (item.couserid === uInfo.couserid) {
              this.sceneChannel.push(item.id)
            }
            return {
              id: item.id,
              dev_name: item.dev_name
            }
          })
          // if(this.sceneChannel.length < res.data.data.total){
          //   this
          // }
        })
        .catch((err) => {
          console.log('[渠道列表 err ]', err)
        })
    },

    // 跳转到详情编辑页
    gotoDetail(rowid) {
      this.$router.push({
        path: '/create',
        query: {
          rowid: rowid
        }
      })
    },
    // 显示配置弹框
    showSceneOption(item) {
      console.log('配置 场景', this.sceneChannel)
      this.currentScene = item
      this.showOption = true
      // this.saveSceneOption()
    },
    // 重置数据
    resetData() {
      // this.sceneChannel = []
      // this.scenePutChannel = false
      // this.currentScene = {}
    },
    // 保存
    async saveSceneOption() {
      this.saveLoading = true
      console.log('saveSceneOption', this.sceneChannel, this.otherID, this.radio)
      if (this.radio === '1') {
        console.log('radio1', this.radio)
        for (let index = 0; index < this.sceneChannel.length; index++) {
          const ele = this.sceneChannel[index]
          await this.relatedChannel({
            productid: this.currentScene.id,
            developerid: ele
          })
          console.log({
            productid: this.currentScene.id,
            developerid: ele
          })
        }
      } else {
        console.log(this.currentScene.id, this.otherID)
        await this.relatedChannel({ productid: this.currentScene.id, developerid: this.otherID })
      }

      this.$message({
        type: 'success',
        message: '关联成功!'
      })

      setTimeout(() => {
        //   this.saveLoading = false
        this.showOption = false
        this.resetData()
      }, 100)
    },
    // 关联渠道
    // 平台商品渠道关联
    relatedChannel({ productid, developerid }) {
      return new Promise((resolve, reject) => {
        console.log('relatedChannel', productid, developerid)
        addfilterdata({
          worksheetDesc: '平台商品渠道关联',
          productid,
          developerid
        })
          .then((res) => {
            console.log('[ 关联渠道 ]', res)
            resolve(res)
          })
          .catch((err) => {
            console.log('[ 关联渠道 err ]', err)
            reject(err)
            this.$message.warning('关联渠道失败')
          })
      })
    },

    // 从列表中移除场景
    removeScene(val) {
      console.log('移除场景', val)
      this.$confirm('此操作将删除场景模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleterowid({
            worksheetDesc: '平台商品',
            rowId: val.rowid
          })
            .then((res) => {
              if (res.code === 200) {
                this.initData()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              } else {
                this.$msg.warning(res.msg)
              }
            })
            .catch(() => {
              this.$msg.error('访问失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.scene-box {
  display: inline-block;
  margin: 40px 20px 0 20px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 1px 2px 5px rgba(204,204,204,0.3);
  border-radius: 8px;
  transition: all 0.1s;
  position: relative;
  &:hover {
    box-shadow: 0 0 5px #ccc;
    .scene-del,
    .scene-edit {
      display: inline-block;
    }
  }
}
.scene-edit {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
  padding: 5px;
  border-radius: 4px;
  display: none;
  background: rgba(255, 255, 255, 0.6);
  &:hover {
    color: #ffeb3b;
  }
}
.scene-del {
  position: absolute;
  left: 10px;
  top: 10px;
  font-size: 20px;
  padding: 5px;
  border-radius: 4px;
  display: none;
  background: rgba(255, 255, 255, 0.6);
  &:hover {
    color: #eceff1;
  }
}
.scene-img {
  width: 288px;
  height: 162px;
  background: #eee;
  img {
    width: 100%;
    height: 100%;
  }
}
.scene-name {
  font-size: 16px;
  padding: 20px 10px 20px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.scene-ud {
  font-size: 12px;
  color: #999;
  padding: 0 10px 10px;
}
.scene-title {
  position: relative;
  font-size: 18px;
  font-weight: bold;
}
.scene-add-box {
  padding: 10px 20px 0;
}
.scene-add {
  // position: absolute;
  // top:30px;
  // right: 20px;
}
</style>
<style>
</style>
