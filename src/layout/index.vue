<template>
  <el-container style="height: 100%;">
    <el-aside :width="sideMenuCollapsed ? '64px' : '200px'" class="sidebar">

      <h4 class="logo">
        <img src="../assets/logo.png" height="32" width="32" style="margin: 0px 8px">
        <transition name="sidebarLogoFade">
          <span v-if="!sideMenuCollapsed">后台管理系统</span>
        </transition>
      </h4>
      <el-scrollbar class="side-menu" wrap-style="overflow-x:hidden;">
        <el-menu background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 style="text-align: left; border: 0px;"
                 :collapse="sideMenuCollapsed"
                 @select="menuSelect"
                 :collapse-transition="false"
                 :unique-opened="true"
                 ref="sideMenu">
          <!--<template v-for="item1 in menus">
            <el-submenu :index="item1.index" :key="item1.index" v-if="item1.children && item1.children.length > 0">
              <template slot="title">
                <i :class="item1.icon"></i>
                <span slot="title">{{item1.title}}</span>
              </template>
              <el-menu-item v-for="item2 in item1.children" :index="item2.index" :key="item2.index">
                <i :class="item2.icon"></i>
                <span slot="title">{{item2.title}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item1.index" :key="item1.index" v-else>
              <i :class="item1.icon"></i>
              <span slot="title">{{item1.title}}</span>
            </el-menu-item>
          </template>-->

          <!--<template v-for="item1 in treeMenuList">
            <el-submenu :index="item1.path" :key="item1.id" v-if="item1.children && item1.children.length > 0">
              <template slot="title">
                <i :class="item1.icon"></i>
                <span slot="title">{{item1.name}}</span>
              </template>
              <el-menu-item v-for="item2 in item1.children" :index="item2.path" :key="item2.id">
                <i :class="item2.icon"></i>
                <span slot="title">{{item2.name}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item1.path" :key="item1.id" v-else>
              <i :class="item1.icon"></i>
              <span slot="title">{{item1.name}}</span>
            </el-menu-item>
          </template>-->
          <side-menu-item v-for="item in treeMenuList" :item="item" :key="item.id"></side-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header style="height: 50px; text-align: left; padding-left: 0px;" class="header">

        <!--<el-button :icon="sideMenuCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                   @click="sideMenuCollapsed = !sideMenuCollapsed"
                   style="border: none; height: 50px; font-size: 20px;"></el-button>-->
        <a class="fold-button" @click="sideMenuCollapsed = !sideMenuCollapsed">
          <i :class="sideMenuCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </a>

        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="item in breadcrumbTitle($route.path)" :key="item">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="right-menu">
          <a class="right-menu-item hover-effect" @click="toggleScreen" style="padding: 0px 8px;">
            <i :class="screenIconClass"></i>
          </a>

          <el-dropdown class="right-menu-item" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item command="user-center">个人中心</el-dropdown-item>-->
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </el-header>


      <el-main style="">
        <transition name="fade-transform" mode="out-in">
          <router-view/>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {mapGetters} from 'vuex'
  import SideMenuItem from "./components/SideMenuItem"
  import logoImg from '@/assets/logo.png'
  import screenfull from 'screenfull'

  export default {
    name: "index",
    components: {SideMenuItem},
    data: function () {
      return {
        sideMenuCollapsed: false,
        logoImg: logoImg,
        screenIconClass: screenfull.isFullscreen ? 'ei-collapse-full' : 'ei-expand-full'
      }
    },
    computed: {
      ...mapGetters(['nickname', 'treeMenuList', 'breadcrumbTitle'])
    },
    methods: {
      menuSelect(index, indexPath, item) {
        // console.log(index, indexPath, item)
        if (index !== this.$route.fullPath) {
          this.$router.push(index)
        }
      },
      handleCommand(command) {
        if (command == 'logout') {
          this.$confirm('确定注销并退出系统吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }).then(() => {
            sessionStorage.removeItem('token')
            this.$store.commit('clearUserInfo')
            location.href = '/'
            // this.$router.push('/')
          })
        }
      },
      toggleScreen() {
        if (!screenfull.isEnabled) {
          this.$message.warning('你的浏览器不支持全屏')
          return false
        }
        screenfull.toggle()
        this.screenIconClass = screenfull.isFullscreen ? 'ei-expand-full' : 'ei-collapse-full'
      }
    },
    mounted() {
      /*console.log(this.$route.path, this.treeMenuList)
      this.$refs['sideMenu'].updateActiveIndex(this.$route.path)
      this.$nextTick(() => {
        console.log(this.$route.path, this.treeMenuList)
        this.$refs['sideMenu'].updateActiveIndex(this.$route.path)
      })*/
      window.setTimeout(() => {
        // console.log(this.$route.path, this.treeMenuList)
        this.$refs['sideMenu'].updateActiveIndex(this.$route.path)
      }, 300)
    }
  }
</script>

<style lang="scss" scoped>

  .sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
  }

  .sidebarLogoFade-enter,
  .sidebarLogoFade-leave-to {
    opacity: 0;
  }

  .sidebar {
    height: 100%;
    background-color: #545c64;
    transition: width .28s;

    .logo {
      height: 50px;
      line-height: 50px;
      color: #fff;
      margin: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .side-menu {
      height: calc(100% - 50px);
    }
  }

  .header {
    .el-dropdown-link {
      cursor: pointer;
    }

    /*background-color: rgb(240, 242, 245);*/
    background-color: #fff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    .fold-button {
      display: inline-block;
      vertical-align: middle;
      width: 50px;
      height: 50px;
      text-align: center;
      cursor: pointer;


      &:hover {
        background: rgba(0, 0, 0, .025)
      }

      i {
        font-size: 20px;
        line-height: 50px;
        /*margin-top: 15px;*/
      }
    }

    .el-breadcrumb {
      display: inline-block;
      vertical-align: middle;
      line-height: 50px;
    }

    .right-menu {
      float: right;

      .right-menu-item {
        display: inline-block;
        line-height: 50px;

        &.hover-effect {
          cursor: pointer;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }
    }
  }

  .el-main {
    text-align: left;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  /* fade-transform */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all .1s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
