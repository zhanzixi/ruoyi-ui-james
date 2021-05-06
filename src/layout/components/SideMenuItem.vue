<template>
  <el-submenu v-if="item.children && item.children.length > 0" :index="item.path">
    <template slot="title">
      <i :class="item.icon"></i>
      <span slot="title">{{item.name}}</span>
    </template>
    <side-menu-item v-for="e in item.children" :item="e"></side-menu-item>
  </el-submenu>
  <el-menu-item v-else :index="item.path">
    <i :class="item.icon"></i>
    <span slot="title">{{item.name}}</span>
  </el-menu-item>
</template>

<script>
  export default {
    name: "SideMenuItem",
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>
