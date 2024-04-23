import Vue from 'vue'
import Router from 'vue-router'
import commonRouter from '@/router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/myScene',
    children: [
      {
        path: 'myScene',
        name: 'MyScene',
        component: () => import('../views/myScene/mysceneList'),
        meta: { title: '新建场景', icon: 'user' }
      }
    ]
  },
  {
    path: '/scenelist',
    // redirect: '/scenelist',
    component: Layout,
    children: [
      {
        path: 'scenelist',
        name: 'Scenelist',
        component: () => import('../views/scenelist/index'),
        meta: { title: '我的场景', icon: 'nested' }
      }
    ]
  },
  {
    path: '/home',
    component: Layout,
    // redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/home/index'),
        meta: { title: '使用介绍', icon: 'user' }
      }
    ]
  },
  {
    path: '/create',
    component: () => import('../views/create/index'),
    hidden: true
  },
  ...commonRouter
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
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
