<script lang="ts">
export default {
  name: 'App',
}
</script>

<template>
  <div class="app-wrapper">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  min-height: 100vh;
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
