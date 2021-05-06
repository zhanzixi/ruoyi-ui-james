<template>
  <div class="test">
    <div id="div1"></div>
    <div id="div2"></div>
    <hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr>
    <hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr><hr>
  </div>
</template>

<script>
  export default {
    name: "Test"
  }
</script>

<style scoped>
  #div1 {
    width: 100px;
    height: 100px;
    border-style: solid;
    border-color: black;
    border-width: 5px 10px 15px 20px;
  }
  #div2 {
    width: 50px;
    height: 50px;
    border: 25px solid red;
    border-top-color: #42b983;
    border-right-color: black;
    border-bottom-color: lightgrey;
    border-top-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  }
</style>
