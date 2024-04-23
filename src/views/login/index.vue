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
              <div class="login__title">随幻科技</div>
            </div>
            <div style="position: fixed;width: 0;height: 0;overflow: hidden;">
              <input type="text">
              <input type="password">
            </div>
            <div class="login__field">
              <i class="login__icon fas el-icon-s-custom" /><input
                v-model="form.name"
                type="text"
                class="login__input"
                placeholder="用户名 / Email"
                @keyup.enter="userLogin"
              >
            </div>
            <div class="login__field">
              <i class="login__icon fas el-icon-menu" />
              <input
                v-model="form.pwd"
                type="password"
                class="login__input"
                placeholder="密码"
                @keyup.enter="userLogin"
              >
              <!-- <el-input v-model="form.pwd" class="login__input" placeholder="密码" autocomplete="off" show-password /> -->
            </div>
            <button class="button login__submit" @click="userLogin">
              <span class="button__text">立即登录</span><i class="button__icon fas el-icon-arrow-right" />
            </button>
          </div>
          <div class="login-option">
            <i @click="$router.push({ path: '/register' })">注册用户</i>
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
import { Login_in } from '@/api/user'
import { mapState, mapMutations } from 'vuex'
import { getToken, setToken } from '@/utils/auth'
// getUInfo
export default {
  data() {
    return {
      form: {
        name: '',
        pwd: ''
      },
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
    // 用户登录
    userLogin() {
      if (!this.checkUserData()) {
        return
      }
      const data = {
        // TypeId: 40,
        TypeId: '普通设计师',
        UserName: this.form.name,
        PassWord: this.form.pwd
      }
      Login_in(data)
        .then((res) => {
          console.log('[用户登录 res]', res)
          setToken(res.token, res.user_id, res)
          this.get_UserInfo(res.user_id)
        })
        .catch((res) => {
          console.log('[用户登录 err]', res)
        })
    },
    // 验证输入信息
    checkUserData() {
      if (this.form.name === '') {
        this.$message.warning('请输入手机号')
        return false
      } else if (this.form.pwd === '') {
        this.$message.warning('请输入密码')
        return false
      }
      return true
    },
    // 查询用户信息
    async get_UserInfo(rowId) {
      // await getUInfo(rowId)
      this.$router.push({ path: this.redirect || '/' })
    }
  }
}
</script>

<style lang="less" scoped>
@import "@/styles/login.less";
</style>
<style>
</style>
