import Vue from 'vue'
import Vuex from 'vuex'
import {buildTree} from '@/utils/james'
import user from './modules/user'
import tagView from './modules/tagView'

Vue.use(Vuex)


export default new Vuex.Store({
  /*state: {
    userInfo: {
      nickname: undefined,
      menuList: [],
      permissionSet: []
    }
  },
  mutations: {
    setUserInfo: (state, payload) => {
      state.userInfo = payload
    },
    clearUserInfo: state => {
      state.userInfo = {
        nickname: undefined,
        menuList: [],
        permissionSet: []
      }
    }
  },
  actions: {},
  getters: {
    nickname: state => state.userInfo.nickname,
    treeMenuList: state => buildTree(state.userInfo.menuList)
  },*/
  modules: {
    user,
    tagView
  }
})
