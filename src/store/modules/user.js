const state = {
  token: '',
  name: '',
  rowid: '',
  avatar: 'https://mrstage-oss.oss-cn-shanghai.aliyuncs.com/nocode/20220301/shf482eb233.jpg',
  userInfo: {
    // account_type: 0,
    // creation: '2021-09-30 13:48:08.181411',
    // docstatus: 0,
    // doctype: 'business',
    // idx: 0,
    // is_deleted: 0,
    // modified: '2021-11-03 17:04:35.144623',
    // modified_by: 'adminplatform@mrstage.com',
    // name: '73bcaa220b',
    // owner: 'adminplatform@mrstage.com',
    // password: 'CSPtOsXm90LEIbtM+P1jvg==',
    // role_id: 0,
    // rowid: '73bcaa220b',
    // sex: 0,
    // status: 0,
    // token:
    //   'MTMwMjIxOTA3MzA6MC42NjgwMTMzMjI2ODYxMzkyOjE2MzYxODk0NzUuMTIwNzg5Mw==',
    // type_id: 20,
    // username: '13022190730'
  }
}

const mutations = {
  SET_userInfo: (state, value) => {
    state.name = value.username
    state.userInfo = value
  },

  SET_TOKEN: (state, token) => {
    // console.log('SET_TOKEN', token)
    state.token = token
  },
  SET_NAME: (state, name) => {
    // console.log('SET_TOKEN', token)
    state.name = name
  },

  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    // commit('SET_TOKEN', data.token)
    commit('CHANGE_SETTING', data)
  },
  set_userInfo_act({ commit }, data) {
    commit('SET_userInfo', data)
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
