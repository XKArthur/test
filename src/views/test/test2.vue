<template>
  <div class="mob-ass-container">
    <div>{{ wsstatus }}  {{ mesgTip }}</div>
    <div class="ma-tit">
      手机助理(three版)
      <el-button style="float:right;position:relative;bottom:10px" icon="el-icon-refresh" type="info" circle @click="getconfig" />
    </div>

    <div>
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            <b>背景屏</b>
          </template>
          <div class="pad10">
            <span class="pad-r-10">显示背景屏</span>
            <!-- <el-switch v-model="posterVal" @change="showPoster" /> -->
            <el-button v-if="posterVal" type="danger" icon="el-icon-check" circle @click="showPoster(false),posterVal=false" />
            <el-button v-else type="primary" icon="el-icon-thumb" circle @click="showPoster(true),posterVal=true" />
          </div>
          <div>
            <draggable v-model="imagearr" v-bind="dragOptions" handle=".drag-c">
              <div
                v-for="(item, index) in imagearr"
                :key="item.id"
                class="imgbox"
                :class="itemstyle === item.url ? 'itemactive' : ''"
              >
                <img
                  v-if="item.type == 'img'"
                  class="cont"
                  :src="item.url"
                  :alt="item.id"
                >
                <video
                  v-else-if="item.type == 'video'"
                  class="cont"
                  :src="item.url"
                />
                <div v-if="item.type == 'video'" class="type-tip">
                  视频
                </div>

                <div class="drag-c">
                  123{{ index }}
                </div>
                <div class="img-opt">
                  <el-tag
                    class="cur-m"
                    size="mini"
                    type="success"
                    @click="itemclick(item)"
                  >
                    显示
                  </el-tag>
                  <!-- <el-tag
                    class="cur-m"
                    size="mini"
                    @click="itemRemove(item.url)"
                  >
                    移除
                  </el-tag> -->
                </div>
              </div>
            </draggable>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template slot="title">
            <b>机位设置</b>
          </template>
          <div class="pad10">
            <span class="pad-r-10">机位摇动</span>
            <el-button v-if="jiweiVal" type="danger" icon="el-icon-check" circle @click="showJiwei(false),jiweiVal=false" />
            <el-button v-else type="primary" icon="el-icon-thumb" circle @click="showJiwei(true),jiweiVal=true" />
          </div>
          <div class="jiwei-box">
            <div
              v-for="(item, index) in jiweioptions"
              :key="index"
              :class="[
                'carmeritem',
                { itemactive: jiweiitemstyle == item.value },
              ]"
              @click="setJiwei(item)"
            >
              <div class="itemicon">
                <p>{{ item.label }}</p>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <!-- <el-collapse-item name="3">
          <template slot="title">
            <b>直播操作</b>
          </template>
          <div style="padding: 10px 0">
            <el-button round type="primary" @click="startLive">
              {{ isLive ? "直播中" : "开始直播" }}
            </el-button>
            <el-button round @click="endLive">
              下播
            </el-button>
          </div>
        </el-collapse-item> -->
        <el-collapse-item name="4">
          <template slot="title">
            <b>切换相机</b>
          </template>
          <el-radio-group v-model="videoinput">
            <el-radio
              v-for="vi in videoList"
              :key="vi.deviceId"
              :label="vi.deviceId"
            >
              {{ vi.label }}
            </el-radio>
          </el-radio-group>
        </el-collapse-item>

        <el-collapse-item name="5">
          <template slot="title">
            <b>AR 道具</b>
          </template>
          <div class="propbox">
            <span class="name">[图  表]</span>
            <el-button
              type="primary"
              round
              style="margin-left: 20px"
              @click="arPropLoad"
            >
              加载道具
            </el-button>
            <div style="display: inline-block; margin-left: 20px">
              <span class="pad-r-10">显示图标</span>
              <!-- <el-switch v-model="chartVal" @change="archartshow" /> -->
              <el-button v-if="chartVal" type="danger" icon="el-icon-check" circle @click="archartshow(false),chartVal=false" />
              <el-button v-else type="primary" icon="el-icon-thumb" circle @click="archartshow(true),chartVal=true" />
            </div>
          </div>

          <div class="propbox">
            <span class="name">[无人机]</span>
            <el-button
              type="primary"
              round
              style="margin-left: 20px"
              @click="arPropLoad2"
            >
              加载道具
            </el-button>
            <div style="display: inline-block; margin-left: 20px">
              <span class="pad-r-10">显示图标</span>
              <!-- <el-switch v-model="chartVal2" @change="archartshow2" /> -->
              <el-button v-if="chartVal2" type="danger" icon="el-icon-check" circle @click="archartshow2(false),chartVal2=false" />
              <el-button v-else type="primary" icon="el-icon-thumb" circle @click="archartshow2(true),chartVal2=true" />
            </div>
          </div>

          <div class="propbox">
            <span class="name">[会议桌]</span>
            <el-button
              type="primary"
              round
              style="margin-left: 20px"
              @click="arPropLoad3"
            >
              加载道具
            </el-button>
            <div style="display: inline-block; margin-left: 20px">
              <span class="pad-r-10">显示图标</span>
              <!-- <el-switch v-model="chartVal3" @change="archartshow3" /> -->
              <el-button v-if="chartVal3" type="danger" icon="el-icon-check" circle @click="archartshow3(false),chartVal3=false" />
              <el-button v-else type="primary" icon="el-icon-thumb" circle @click="archartshow3(true),chartVal3=true" />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },

  data() {
    this.wsclient = null
    return {
      chartVal: false,
      chartVal2: false,
      chartVal3: false,
      uid: 'rtmplaycanvas3',
      sendid: 'rtmplaycanvas1',
      isLive: false,
      wsstatus: '连接中',
      mesgTip: '发送消息。。',
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      },
      imagearr: [
        // { id: '6oav71wop4k0', url: '/resouces/1.png' },
        // { id: '5e2x8nn57640', url: '/resouces/test.png' },
        // {
        //   id: '1bfly6cwnpb40',
        //   url: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/e518f48f-c703-42bd-892c-02f468de6be6/1632295490.jpg'
        // },
        // {
        //   id: '1f5hmvs99vfk',
        //   url: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/d0e63f87-fe55-494a-9ff5-4b43cee1ace9/1632295471.jpg'
        // },
        // { id: '5dn2jjuq60s0', url: '/resouces/3.png' },
        // { id: '7hn38jlndfo0', url: '/resouces/0.png' },
        // { id: '2f6nkgacrisk', url: '/resouces/2.png' }
      ],
      posterVal: false,
      jiweiVal: false,

      jiweioptions: [
        {
          value: 'camera_near',
          label: '近景'
        },
        {
          value: 'camera_far',
          label: '远景'
        }
      ],
      jiweiitemstyle: 'camera_far',
      videoinput: '', // 选择的相机
      videoList: [], // 相机列表
      activeNames: [],
      itemstyle: ''
    }
  },
  watch: {
    activeNames(curVal) {
      // console.log('== imagearr ==>', curVal)
      localStorage.setItem(`activeNames`, JSON.stringify(curVal))
    },
    // 切换
    videoinput(command) {
      console.log('== videoinput ==>', command)
      this.userSendMsg({
        sendid: this.sendid,
        active: 'ChangeCamera',
        data: {
          val: command
        }
      })
    }
  },
  beforeDestroy() {
    if (this.wsclient) {
      this.wsclient.logout()
    }
  },
  mounted() {
    const localdata = localStorage.getItem(`activeNames`)
    try {
      if (localdata) {
        this.activeNames = JSON.parse(localdata)
      }
    } catch (error) {
      console.log(error)
    }

    setTimeout(() => {
      // this.userlogin()
      this.getconfig()
    }, 500)
    // 连接socket
  },
  methods: {
    // 用户连接 ws
    async userlogin() {
      console.log('用户连接 ws')
    },
    // 连接成功
    localOpend() {
      console.log('连接成功')

      this.getconfig()
    },
    // 发送消息
    userSendMsg(msg) {
      console.log('发送消息', msg)
    },
    // ---------------------------------
    getconfig() {
      this.imagearr = [
        {
          'id': '1vgx66u8dkqo0',
          'type': 'img',
          'url': 'https://suihuan.pek3b.qingstor.com/8e76e90d-faae-4b47-b77c-d02e9e5da52c'
        },
        {
          'id': 'txhf20icf8w0',
          'type': 'img',
          'url': 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/3c2a0202-d964-4869-b714-85812a380f15/1631171802.jpg'
        },
        {
          'id': '18con5llpp7k0',
          'type': 'img',
          'url': 'https://api.mz-moe.cn/img/img910.jpg'
        },
        {
          'id': '1vgx66u8dkqo01234',
          'type': 'video',
          'url': 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211012/shvideo_batch.mp4'
        },
        {
          'id': '1vgx66u8dkqo0234',
          'type': 'video',
          'url': 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20211012/3fbceb80-179c0a6bbd6.mp4'
        }
      ]
      this.videoList = [
        {
          'deviceId': '378ea81acb0be2581c31a0d7f7ca5156258cdda7d69d3acea0049911781a348b',
          'kind': 'videoinput',
          'label': 'OBS Virtual Camera',
          'groupId': '0d3340ffa863d093469d975eca2dc5e780d5e7ec692b1329481b287f586cb94b'
        }
      ]
    },

    // ===================================================
    // 本地设置
    // 显示背景屏
    showPoster(val) {
      console.log('显示背景屏', val)
      this.userSendMsg({
        sendid: this.sendid,
        active: 'HSMsetVisible',
        data: {
          val: val
        }
      })
    },
    // 切换图片
    itemclick(item) {
      this.itemstyle = item.url
      console.log('切换图片', item.url)
      // this.$getBase64(url, (dataURL) => {
      // })
      this.userSendMsg({
        sendid: this.sendid,
        active: 'HSMuseContent',
        data: {
          val: item
        }
      })
    },
    // 移除图片
    itemRemove(url) {
      this.imagearr = this.imagearr.filter((item) => {
        return item.url !== url
      })
    },
    // 设置机位
    setJiwei(jw) {
      // console.log('设置机位', jw)
      this.jiweiitemstyle = jw.value
      this.userSendMsg({
        sendid: this.sendid,
        active: 'CCMsetCameraMoving',
        data: {
          val: jw.value
        }
      })
    },
    // 机位摇动
    showJiwei(val) {
      console.log('机位摇动', val)
      this.userSendMsg({
        sendid: this.sendid,
        active: 'CCMidle',
        data: {
          val: val
        }
      })
    },
    // 开播
    startLive() {
      if (this.isLive) return
      this.isLive = true
    },
    // 下播
    endLive() {
      if (!this.isLive) return
      this.isLive = false
    },
    // ==================================================
    // 加载ar
    arPropLoad() {
      console.log('加载ar')
      this.userSendMsg({
        sendid: this.sendid,
        active: 'ArPropLoad',
        data: {
          val: 123
        }
      })
    },
    // 显示ar
    archartshow(val) {
      console.log('显示ar', val)
      this.userSendMsg({
        sendid: this.sendid,
        active: 'ArPropShow',
        data: {
          val: val
        }
      })
    },
    // ----------
    // 加载ar
    arPropLoad2() {
      console.log('加载ar')
      this.userSendMsg({
        sendid: this.sendid,
        active: 'ArPropLoad2',
        data: {
          val: 123
        }
      })
    },
    // 显示ar
    archartshow2(val) {
      console.log('显示ar2', val)
      this.userSendMsg({
        sendid: this.sendid,
        active: 'ArPropShow2',
        data: {
          val: val
        }
      })
    },
    // ----------
    // 加载ar
    arPropLoad3() {
      console.log('加载ar')
      this.userSendMsg({
        sendid: this.sendid,
        active: 'ArPropLoad3',
        data: {
          val: 123
        }
      })
    },
    // 显示ar
    archartshow3(val) {
      console.log('显示ar2', val)
      this.userSendMsg({
        sendid: this.sendid,
        active: 'ArPropShow3',
        data: {
          val: val
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pad10{
  padding: 15px;
}
.pad-r-10{
  padding-right: 15px;
}
.mob-ass-container {
  padding: 10px;
}
.ma-tit {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 0 20px;
}
.itemactive {
  border: 2px solid #e6251f;
}
.imgbox {
  width: 100px;
  height: 100px;
  display: inline-block;
  text-align: center;
  background: #333;
  margin-left: 10px;
  margin-top: 10px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  .cont {
    margin-top: 10%;
    margin-left: 3%;
    width: 94%;
    height: 80%;
    float: left;
  }
  .type-tip {
    position: absolute;
    left: 5px;
    top: 2px;
    color: #fff;
  }
  .drag-c {
    position: absolute;
    bottom: 40%;
    left: 0;
    top: 0;
    right: 0;
    background: #333;
    opacity: 0;
    cursor: move;
    z-index: 1;
  }

  .img-opt {
    // display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 3;
    display: flex;
    justify-content: space-between;
  }
  // &:hover .img-opt {
  //   display: flex;
  //   justify-content: space-between;
  // }

  .cur-m {
    background: rgba(0, 0, 0, 0.7);
    border: 0;
    cursor: pointer;
    font-size: 12px;
    // padding: 0;
    height: auto;
    padding: 10px 10px;
    width: 100%;
  }
}
.jiwei-box {
  display: flex;
  justify-content: space-around;
  padding: 20px 0 0;
}
.carmeritem {
  display: inline-block;
  text-align: center;
  background: #333;
  color: #fff;
  width: 130px;
  border-radius: 10px;
  img {
    width: 100%;
  }
}

.propbox {
  padding: 15px 0;
  .name {
    width: 50px;
    display: inline-block;
  }
}
::v-deep .el-switch__core {
  position: relative;
  left: 10px;
  top: -2px;
}
::v-deep .el-radio {
  padding: 20px 10px;
  border-radius: 10px;
  margin-top: 10px;
  background: #eee;
  width: 100%;
}
::v-deep .el-collapse-item__header{
  background: #ddd;
  padding-left: 10px;
  border-radius: 10px;
}
</style>
