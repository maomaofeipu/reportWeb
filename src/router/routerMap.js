/**
 * 基础路由
 * @type { *[] }
 */

const constantRouterMap = [
  {
    path: '/',
    redirect: '/excel'
  },
  {
    path: '/excel',
    name: 'Excel',
    component: () => import('@/views/Excel.vue')
  },
  {
    path: '/chart',
    name: 'Chart',
    component: () => import('@/views/Chart.vue')
  }
]

export default constantRouterMap