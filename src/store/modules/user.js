import axios from "@/utils/axios"
import {buildBreadcrumbMap, buildTree} from "@/utils/james";

export default {
  state: {
    nickname: undefined,
    menuList: [],
    permissionSet: []
  },
  mutations: {
    setUserInfo: (state, payload) => {
      state.nickname = payload.nickname
      state.menuList = payload.menuList
      state.permissionSet = payload.permissionSet
      console.log('setUserInfo', payload)
    },
    clearUserInfo: state => {
      state.nickname = undefined
      state.menuList = []
      state.permissionSet = []
      console.log('clearUserInfo')
    }
  },
  actions: {
    getUserInfo: (context) => {
      return axios.get('/system/user-info').then(value => {
        if (value.data.data) {
          context.commit('setUserInfo', value.data.data)
        } else {
          sessionStorage.removeItem('token')
          context.commit('clearUserInfo')
        }
      })
    }
  },
  getters: {
    nickname: state => state.nickname,
    treeMenuList: state => buildTree(state.menuList),
    breadcrumbTitle: state => path => {
      let m = buildBreadcrumbMap(state.menuList)
      return m.get(path) ? m.get(path) : []
    },
    menuName: state => path => {
      for (const menu of state.menuList) {
        if (menu.path == path) {
          return menu.name
        }
      }
      return undefined
    }
  },
}
