// 公用的路由配置
const commonRouter = [
  {
    path: '/imgurl',
    component: () => import('@/views/imgurl/index'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/test1',
    component: () => import('@/views/test/test1.vue'),
    hidden: true
  },
  {
    path: '/test2',
    component: () => import('@/views/test/test2.vue'),
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
export default commonRouter
