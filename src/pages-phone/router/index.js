import Vue from 'vue'
import Router from 'vue-router'
import commonRouter from '@/router'
Vue.use(Router)
export const constantRoutes = [
  {
    path: '/',
    redirect: '/test2'
    // children: [{
    //   path: 'test2',
    //   name: 'Test2',
    //   component: () => import('@/views/test/test2.vue'),
    //   meta: { title: '手机助手', icon: 'dashboard' }
    // }]
  },
  // {
  //   path: '/zhushou',
  //   component: () => import('../views/zhushou'),
  //   hidden: true
  // },
  ...commonRouter
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
