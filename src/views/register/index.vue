<template>
  <div>
    <div class="container">
      <div class="screen">
        <div class="screen__content">
          <div class="login">
            <div class="login__first">
              <div class="logo_box">
                <img src="@/assets/logo.png" alt="logo" srcset="">
              </div>
              <div class="login__title">用户注册</div>
            </div>
            <div class="login__field">
              <i class="login__icon fas el-icon-coordinate" /><input
                v-model="form.name"
                maxlength="11"
                type="text"
                class="login__input"
                placeholder="输入手机号"
                auto-complete="new-password"
              >
            </div>
            <div class="login__field">
              <i class="login__icon fas el-icon-mobile-phone" />
              <input
                v-model="form.code"
                maxlength="6"
                type="text"
                class="login__input"
                placeholder="输入验证码"
                auto-complete="new-password"
              >
              <div
                v-if="codeNumber < 1"
                class="button login__submit register"
                @click="getPhoneCode"
              >
                获取验证码
              </div>
              <div v-else class="button login__submit register huise">
                {{ codeNumber }}秒后重试
              </div>
            </div>
            <div class="login__field">
              <i class="login__icon fas el-icon-watch-1" />
              <div style="position: fixed;width: 0;height: 0;overflow: hidden;">
                <input type="text">
                <input type="password">
              </div>

              <input
                v-model="form.pwd"
                type="password"
                class="login__input"
                placeholder="输入密码"
                auto-complete="new-password"
                @keyup.enter="userLogin"
              >
            </div>
            <div class="login__field">
              <i class="login__icon fas el-icon-watch" />
              <input
                v-model="form.pwd2"
                type="password"
                class="login__input"
                placeholder="确认密码"
                auto-complete="new-password"
                @keyup.enter="userLogin"
              >
            </div>
            <button class="button login__submit" @click="userLogin">
              <span class="button__text">立即登录</span><i class="button__icon fas el-icon-arrow-right" />
            </button>
          </div>
          <div class="login-option">
            <i @click="$router.push({ path: '/login' })">登录账号</i>
          </div>
          <div class="social-login">
            <h3>产品技术支持</h3>
            <div class="social-icons">随幻科技</div>
          </div>
        </div>
        <div class="screen__background">
          <span
            class="screen__background__shape screen__background__shape4"
          /><span
            class="screen__background__shape screen__background__shape3"
          /><span
            class="screen__background__shape screen__background__shape2"
          /><span
            class="screen__background__shape screen__background__shape1"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Login_old } from '@/api/user'
import { mapState, mapMutations } from 'vuex'
import { getToken, setToken, getUInfo } from '@/utils/auth'
import { get_phone_code, phone_code_login, set_pass_word } from '@/api/user'
export default {
  data() {
    return {
      codeNumber: 0,
      form: {
        name: '',
        code: '',
        pwd: '',
        pwd2: ''
      },
      typeCode: 40,
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    var uInfo = getToken()
    if (uInfo?.rowid) {
      this.get_UserInfo(uInfo.rowid)
    }
  },
  methods: {
    ...mapMutations('user', ['SET_userInfo', 'SET_TOKEN']),
    // 获取手机验证码
    getPhoneCode() {
      console.log(this.form.name.length)
      if (!this.form.name) {
        this.$message.warning('请输入手机号')
        return false
      } else if (this.form.name.length !== 11) {
        this.$message.warning('请输入正确手机号')
        return false
      }

      this.startCount(60)

      get_phone_code({
        Mobile: this.form.name
      })
        .then((res) => {
          console.log('获取手验证码', res)
        })
        .catch((res) => {
          console.log('获取手验证码[err]', res)
        })
    },
    startCount(num) {
      if (num) {
        this.codeNumber = num
      }
      if (this.codeNumber > 0) {
        setTimeout(() => {
          this.codeNumber -= 1
          this.startCount()
        }, 1000)
      }
    },
    // 用户登录
    userLogin() {
      if (!this.checkUserData()) {
        return
      }
      phone_code_login({
        TypeId: '普通设计师',
        UserName: this.form.name,
        Code: this.form.code
      })
        .then((res) => {
          console.log('验证码登录', res)
          setToken(res.token, res.user_id, res)
          setTimeout(() => {
            this.bandingPwd()
          }, 10)
        })
        .catch((res) => {
          console.log('验证码登录[err]', res)
        })
    },
    // 绑定密码
    bandingPwd() {
      set_pass_word({
        PassWord: this.form.pwd,
        Confirm_PassWord: this.form.pwd
      })
        .then((res) => {
          console.log('绑定密码', res)
          this.$router.push({ path: this.redirect || '/' })
        })
        .catch((res) => {
          console.log('绑定密码[err]', res)
        })
    },
    // 验证输入信息
    checkUserData() {
      if (this.form.name === '') {
        this.$message.warning('请输入手机号')
        return false
      } else if (this.form.name.length !== 11) {
        this.$message.warning('请输入正确手机号')
        return false
      } else if (this.form.code === '') {
        this.$message.warning('请输入验证码')
        return false
      } else if (this.form.pwd === '') {
        this.$message.warning('请输入密码')
        return false
      } else if (this.form.pwd2 === '') {
        this.$message.warning('请确认密码')
        return false
      } else if (this.form.pwd !== this.form.pwd2) {
        this.$message.warning('两次输入密码不一致')
        return false
      }
      return true
    },
    // 查询用户信息
    async get_UserInfo(rowId) {
      await getUInfo(rowId)
      this.$router.push({ path: this.redirect || '/' })
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/login.less";

.login__field {
  padding: 5px 0 10px;
}
.register {
  // width: 120px;
  width: auto;
  position: absolute;
  bottom: 39%;
  right: 0;
  padding: 5px 10px;
  user-select: none;
}
.login__icon {
  top: 16px;
}

.huise {
  background: #eee;
}
</style>
<style>
</style>
