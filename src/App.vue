<template>
  <div id="app">
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }
  html, body, #app {
    height: 100%;
    margin: 0px;
  }
  * {
    box-sizing: border-box;
  }

  .el-form-item__label {
    font-weight: bold;
  }


  /* Icon-Font (et-xxx) */
  [class*=" et-"], [class^=et-] {
    display: inline-block;
  }

  .el-submenu [class^=et-] {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
  }

</style>
