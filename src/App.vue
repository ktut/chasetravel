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
  <router-view />
</template>
