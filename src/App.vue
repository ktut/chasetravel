<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SearchWidget from '@/components/SearchWidget.vue'

const route = useRoute()

// Show search widget in sticky header only on search page
const isSearchPage = computed(() => route.path === '/search')
</script>

<template>
  <NavBar />
  <!-- Teleport target for modals -->
  <div id="modal-container"></div>
  <!-- Sticky search header - only visible on search page -->
  <div v-if="isSearchPage" id="search-header-container">
    <div class="search-header">
      <div class="search-widget-container">
        <SearchWidget />
      </div>
    </div>
  </div>
  <router-view v-slot="{ Component }">
    <Transition name="slide" mode="out-in">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </Transition>
  </router-view>
</template>

<style>
#search-header-container {
  position: sticky;
  top: 60px;
  z-index: 100;
  background: white;
}

@media (max-width: 768px) {
  #search-header-container {
    top: 90px;
  }
}

.search-header {
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
}

@media (max-width: 768px) {
  .search-header {
    padding: 0.5rem 0;
  }
}

.search-widget-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 968px) {
  .search-widget-container {
    padding: 0 0.5rem;
  }
}
</style>
