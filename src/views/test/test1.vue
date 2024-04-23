<template>
  <div style="padding: 20px">
    测试用 页面
    <div class="pad-ud-10">
      <i>用户ID：</i>
      <div class="img-box">
        <el-input v-model="localUser" />
      </div>
      <el-button
        icon="el-icon-refresh"
        circle
        type="warning"
        @click="getUUID"
      />
      <el-button type="primary" @click="userWsLogin">云信令登录</el-button>
      <el-button type="danger" @click="userWsLogout">退出</el-button>
    </div>
    <div class="pad-ud-10">
      <i>对方ID：</i>
      <div class="img-box">
        <el-input v-model="peerUser" />
      </div>
      <i> 消息内容：</i>
      <div class="img-box">
        <el-input v-model="peerMsg" />
      </div>
      &nbsp;&nbsp;
      <el-button type="primary" @click="userSendMsg">发送消息</el-button>
    </div>
    <el-divider><i class="el-icon-mobile-phone" /></el-divider>
  </div>
</template>

<script>
import { InitClinet, uuId } from '@/sh-webrtm-sdk'
export default {
  data() {
    this.wsclient = null
    return {
      peerUser: '',
      peerMsg: '',
      localUser: 'ceshiuser123'
    }
  },
  methods: {
    getUUID() {
      this.localUser = uuId()
    },
    // 用户登录
    async userWsLogin() {
      console.log('云信令登录')
      if (this.localUser) {
        this.wsclient = await InitClinet({
          uid: this.localUser,
          MessageFromPeer: (message, peerId) => {
            console.log('ws 收到消息', peerId, message)
            // message.text = JSON.parse(message.text)
            // self.localSortMessage(message, peerId)
          },
          LoginSuccess: () => {
            console.log('ws 登录成功')
          },
          Logout: () => {
            console.log('ws 退出登录')
          },
          Interrupted: () => {
            console.log('ws 连接中断')
          },
          RemoteLogin: async() => {
            console.log('ws 被人挤出了')
            if (this.wsclient) {
              await this.wsclient.logout()
            }
          }
        })
      } else {
        console.log('没用用户名')
      }
    },
    userWsLogout() {
      if (this.wsclient) {
        this.wsclient.logout()
      }
    },
    // 用户发送消息
    userSendMsg() {
      const sendid = this.peerUser
      const mesg = this.peerMsg
      this.wsclient
        .sendMessageToPeer({ text: mesg }, sendid)
        .then((sendResult) => {
          console.log('[sendResult]', sendResult)
          if (sendResult.hasPeerReceived) {
            console.log('消息已发送: ' + sendid + ' Message: ', mesg)
          } else {
            console.log('对方没有收到: ' + sendid + ' Message: ', mesg)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.pad-ud-10 {
  padding: 10px 0;
}
.img-box {
  width: 200px;
  margin: 10px 0;
  display: inline-block;
}
</style>
