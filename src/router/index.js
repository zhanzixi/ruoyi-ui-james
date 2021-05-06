import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import NProgress from 'nprogress'
import store from '@/store'
import axios from '@/utils/axios'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login', name: 'Login', component: () => import('@/views/login.vue'),
    props: route => ({redirect: route.query.redirect})
  },
  {
    path: '',
    component: () => import('@/layout'),
    children: [
      {path: '/', name: 'Home', component: Home},
      {path: '/about', name: 'About', component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')},
      {path: '/test', name: 'Test', component: () => import('../views/Test.vue')},
      {path: '/system/dept', name: 'Dept', component: () => import('../views/system/Dept')},
      {path: '/system/post', name: 'Post', component: () => import('../views/system/Post')},
      {path: '/system/user', name: 'User', component: () => import('../views/system/User')},
      {path: '/system/menu', name: 'Menu', component: () => import('../views/system/Menu')},
      {path: '/system/role', name: 'Menu', component: () => import('../views/system/Role')}
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (sessionStorage.getItem('token')) { // 已登录
    if (!store.getters.nickname) {
      store.dispatch('getUserInfo').then(() => to.path == '/login' ? next('/') : next())
      /*axios.get('/system/user-info').then(value => {
        if (value.data.data) {
          console.log('setUserInfo', value.data.data)
          store.commit('setUserInfo', value.data.data)
        } else {
          sessionStorage.removeItem('token')
          store.commit('clearUserInfo')
        }
      }).then(() => to.path == '/login' ? next('/') : next())*/
    } else {
      to.path == '/login' ? next('/') : next()
    }
  } else { // 未登录
    if (whiteList.includes(to.path)) { // 白名单，允许不登录
      next()
    } else { // 跳到登录页
      next(`/login?redirect=${to.fullPath}`)
    }
  }
  // console.log(to)
  next()
})

router.afterEach((to, from) => {
  // console.log(to, from)
  NProgress.done()
})

export default router
