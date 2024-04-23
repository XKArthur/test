<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- 被干掉的面包屑 -->
    <breadcrumb v-if="!1" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { removeToken, setUInfo } from '@/utils/auth'
import { getfilterdata } from '@/api/tablelist'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      redirect: undefined
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
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
    this.getUserInfo()
  },
  methods: {
    ...mapMutations('user', ['SET_userInfo']),
    getUserInfo() {
      getfilterdata({
        worksheetDesc: '小幻演播厅exe用户'
      }).then((res) => {
        console.log('[小幻演播厅 用户list]', res)
        if (res?.data?.data?.rows) {
          const defaultUser = res.data.data.rows[0]
          console.log('[小幻演播厅 用户list]', defaultUser)
          setUInfo(defaultUser)
          // this.updateUserInfo(defaultUser.rowid)
        }
      })
        .catch((err) => {
          console.log('[小幻演播厅用户list err ]', err)
          // this.$message.warning('没有获取到用户信息')
        })
      this.$router.push({ path: this.redirect || '/' })
      // if (uInfo?.rowid) {
      //   this.theid = uInfo.rowid
      // this.get_UserInfo(uInfo.rowid)
      // }
      // console.log('== 获取用户信息 ==')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // await this.$store.dispatch('user/logout')
      removeToken()
      this.SET_userInfo({})

      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    opacity: 0.1;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 10px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
