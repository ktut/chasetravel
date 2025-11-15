<script lang="ts">
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<template>
  <NavBar />
  <!-- Teleport target for modals -->
  <div id="modal-container"></div>
  <div class="app-wrapper">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  perspective: 1px;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

  /* WebKit overflow scrolling fix */
  -webkit-overflow-scrolling: touch;
  height:  calc(100dvh + 15rem);
  @media (max-width: $breakpoint-mobile) {
    height:  calc(100dvh + 10rem);
  }
}
</style>
