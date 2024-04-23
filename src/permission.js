// import router from './pages-index/router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/test1'] // no redirect whitelist
// '/login','/register'
export function setPermission(router) {
  router.beforeEach(async(to, from, next) => {
  // start progress bar
    NProgress.start()

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()
    console.log('hasToken', hasToken)

    if (hasToken) {
      if (to.path === '/login') {
      // if is logged in, redirect to the home page
        next({ path: '/' })
        NProgress.done()
      } else {
        const hasGetUserInfo = store.getters.name
        if (hasGetUserInfo) {
          next()
        } else {
          try {
            // console.log('[获取了当前的用户]', hasToken)
            // await getUInfo(hasToken.rowid).catch(res => {
            //   next(`/login?redirect=${to.path}`)
            // })
            next()
          } catch (error) {
          // remove token and go to login page to re-login
          // await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            // next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    } else {
      /* has no token*/
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        // next(`/login?redirect=${to.path}`)
        NProgress.done()
        const redirectUri = encodeURIComponent(window.location.href)
        window.location.href = `https://account.mrstage.com/?redirectUri=${redirectUri}`
      }
    /* has no token*/
      // if (whiteList.indexOf(to.path) !== -1) {
      // // in the free login whitelist, go directly
      //   next()
      // } else {
      // // other pages that do not have permission to access are redirected to the login page.
      //   next(`/login?redirect=${to.path}`)
      //   NProgress.done()
      // }
    }
  })

  router.afterEach(() => {
  // finish progress bar
    NProgress.done()
  })
}
