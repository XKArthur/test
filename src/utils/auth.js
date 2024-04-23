// import Cookies from 'js-cookie'
import { user_info } from '@/api/user'
import store from '@/store'
import Cookies from 'js-cookie'
const TokenKey = 'InterfaceCertificate'

export function getToken() {
  // const interfaceCertificate = localStorage.getItem(TokenKey)
  // const rowid = localStorage.getItem('Rowid')
  // const info = JSON.parse(localStorage.getItem('userinfo'))
  // if (interfaceCertificate && rowid) {
  //   store.commit('user/SET_TOKEN', interfaceCertificate)
  //   store.commit('user/CHANGE_SETTING', { key: 'rowid', value: rowid })
  //   return {
  //     rowid: rowid,
  //     token: interfaceCertificate,
  //     info: info
  //   }
  // }

  const interfaceCertificate = Cookies.get(TokenKey)
  console.log('Cookies', Cookies.get('Rowid'))
  if (interfaceCertificate) {
    store.commit('user/SET_TOKEN', interfaceCertificate)
    return {
      token: interfaceCertificate
    }
  }
  return false
  // return Cookies.get(TokenKey)
}
export function setUInfo(data) {
  localStorage.setItem('userinfo', JSON.stringify(data))
  store.commit('user/SET_userInfo', data)
}
export function getUserInfo() {
  const info = JSON.parse(localStorage.getItem('userinfo'))
  return info
}

export function setToken(token, rowid, userInfo) {
  localStorage.setItem(TokenKey, token)
  localStorage.setItem('Rowid', rowid)
  localStorage.setItem('userinfo', JSON.stringify(userInfo))
  store.commit('user/SET_TOKEN', token)
  store.commit('user/CHANGE_SETTING', { key: 'rowid', value: rowid })
  store.commit('user/SET_userInfo', userInfo)
  return Cookies.set(TokenKey, token, { domain: '.mrstage.com' })
  // return Cookies.set(TokenKey, token)
}

export function removeToken() {
  localStorage.removeItem('InterfaceCertificate')
  localStorage.removeItem('Rowid')
  localStorage.removeItem('CustomerInformation')
  store.dispatch('user/set_userInfo_act', {})
  store.commit('user/SET_TOKEN', null)
  store.commit('user/CHANGE_SETTING', { key: 'rowid', value: '' })
  Cookies.remove(TokenKey, { domain: '.mrstage.com' })
  return Cookies.remove(TokenKey)
  // console.log('mapMutations', )
  // return Cookies.remove(TokenKey)
}

export function getUInfo(rowId) {
  return new Promise((resolve, reject) => {
    const data = {
      worksheetDesc: '普通设计师',
      rowId: rowId
    }
    console.log('getUInfo', rowId)
    user_info(data)
      .then((res) => {
        console.log('[查询用户信息 res]', res)
        if (res) {
          localStorage.setItem('CustomerInformation', JSON.stringify(res.data))
          store.dispatch('user/set_userInfo_act', res.data)
        } else {
          console.log(123)
        }

        // this.SET_userInfo(res.data)
        // this.$router.push({ path: this.redirect || '/' })
        resolve()
      })
      .catch((res) => {
        console.log('[查询用户信息 err]', res)
        removeToken()
        reject(res)
      })
  })
}
