import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

// 登录
export const Login_in = (data) => request.post('api/ordinary/login', data)
// 登录 type；0
export function Login_old(data) {
  return request({
    url: 'api/login',
    method: 'post',
    data
  })
}
// 注册
export const Register = (data) => request.post('/register', data)

// 查询用户信息
export const user_info = (data) => request.post('api/get/rows/by/id', data)

// 获取验证码
export function get_phone_code(data) {
  return request({
    url: '/api/send/code',
    method: 'post',
    data
  })
}
// 验证码登录
export function phone_code_login(data) {
  return request({
    url: '/api/auth',
    method: 'post',
    data
  })
}

// 设置密码接口
export function set_pass_word(data) {
  return request({
    url: '/api/v2/user/set/password',
    method: 'post',
    data
  })
}

