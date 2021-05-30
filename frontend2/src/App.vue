<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    setup() {
      return {}
    }
  }
</script>

<style>
html{
  height:100%;
}
body{
  height:100%;
  margin:0px;
}
#app{
  height:100%;
}
</style>