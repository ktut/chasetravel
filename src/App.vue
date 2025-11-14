<script lang="ts">
export default {
  name: 'App',
}
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
#app {
  width: 100%;
  min-height: 100vh;
  max-width: 2048px;
  margin-left: auto;
  margin-right: auto;

  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

  /* WebKit overflow scrolling fix */
  -webkit-overflow-scrolling: touch;
}
</style>
