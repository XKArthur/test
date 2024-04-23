const appID = 'eb0928973c944949946b449244f74ad2'
const maxTemporary = 30
const maxAccount = 50
// 获取随机的登录账号 ---------------------------------
export function uuId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0
    var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
// 获取设备id的登录账号 ---------------------------------
export function deviceId() {
  const rtmdeviceid = window.localStorage.getItem('rtmdeviceid')
  if (rtmdeviceid) {
    return rtmdeviceid
  } else {
    const newid = uuId()
    window.localStorage.setItem('rtmdeviceid', newid)
    return newid
  }
}

// 获取默认（资源池）登录账号 ---------------------------------
export const get_default_login_account = async(params) => {
  return new Promise((resolve) => {
    const random_account = new Get_random_account()
    // console.log(random_account);

    // console.log(random_account.client);
    random_account.client = window.AgoraRTM.createInstance(appID)
    window.wsclient = random_account.client
    random_account.client.updateConfig({
      logFilter: window.AgoraRTM.LOG_FILTER_ERROR
    })
    // updateConfig
    // 显示连接状态变化
    random_account.client.on(
      'ConnectionStateChanged',
      async(state, reason) => {
        // console.log("状态更改为: " + state + " 原因: " + reason);
        if (state === 'CONNECTED' && reason === 'LOGIN_SUCCESS') {
          const res = await random_account.check_online_account(0)
          // console.log("==========>check_online_account", res);
          await random_account.client.logout()
          resolve(res)
        }
      }
    )

    random_account.client.login(random_account.options)
  })
}
function Get_random_account() {
  const arrTemporary = []

  for (var i = 1; i <= maxTemporary; i++) {
    // console.log(i)
    const name = `${123000 + i}temporary`
    arrTemporary.push(name)
  }
  // console.log("arrTemporary", arrTemporary);
  const randomIndex = Math.floor(Math.random() * maxTemporary)
  // console.log("randomIndex", randomIndex);

  const randomTemporary = arrTemporary[randomIndex]
  // console.log("randomTemporary", randomIndex, randomTemporary);
  this.options.token = null
  this.options.uid = randomTemporary
}

const random_account_proto = Get_random_account.prototype
// 初始化客户端
random_account_proto.options = {
  uid: '',
  token: ''
}
// 查询在线账号
random_account_proto.check_online_account = async function(timer) {
  // console.log("查询在线账号");
  const arrAccount = []
  const minAcc = timer * maxAccount + 1
  const maxAcc = timer * maxAccount + maxAccount

  for (var i = minAcc; i <= maxAcc; i++) {
    // console.log(i)
    const name = `${123000 + i}permanent`
    arrAccount.push(name)
  }

  // console.log("arrAccount", arrAccount);
  const res = await this.client.queryPeersOnlineStatus(arrAccount)
  return new Promise((resolve) => {
    // console.log(123, res);

    for (let index = 0; index < arrAccount.length; index++) {
      const ele = res[arrAccount[index]]
      // console.log("arrAccount", arrAccount[index], ele);
      if (!ele) {
        // console.log("=== 结束 ===");
        resolve(arrAccount[index])
        return
      }
    }

    // 一批用完账号使用
    console.log('一批账户', timer)
    resolve(this.check_online_account(++timer))
  })
}

//

// 正常用户登录 ------------------------------------------
export async function InitClinet(params) {
  if (!(this instanceof InitClinet)) {
    return new InitClinet(params)
  }
  if (!params.uid) return console.log('InitClinet:uid ', params.uid)
  this.options.token = null
  this.options.uid = params.uid
  this.client = window.AgoraRTM.createInstance(appID)
  this.addListener(params)
  return new Promise((resolve) => {
    this.client.login(this.options).then(
      resolve(this.client)
    )
  })
}
const init_clinet_proto = InitClinet.prototype

init_clinet_proto.options = {
  uid: '',
  token: ''
}

init_clinet_proto.addListener = function(params) {
  this.client.on('MessageFromPeer', function(message, peerId) {
    params.MessageFromPeer && params.MessageFromPeer(message, peerId)
  })

  this.client.on('ConnectionStateChanged', async(state, reason) => {
    // console.log("状态更改为: " + state + " 原因: " + reason);
    switch (reason) {
      case 'LOGIN_SUCCESS':
        params.LoginSuccess && params.LoginSuccess()
        this.channel = this.client.createChannel(params.uid)
        await this.channel.join().then(() => {
          console.log('成功加入频道 ' + this.channel.channelId)
        })
        this.channel.on('ChannelMessage', function(message, memberId) {
          params.ChannelMessage && params.ChannelMessage(message, memberId)
        })
        break
      case 'LOGOUT':
        params.Logout && params.Logout()
        break
      case 'INTERRUPTED':
        params.Interrupted && params.Interrupted()
        break
      case 'REMOTE_LOGIN':
        params.RemoteLogin && params.RemoteLogin()
        break
      default:
        break
    }
  })
}
