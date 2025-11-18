<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SearchWidget from '@/components/SearchWidget.vue'

const route = useRoute()

// Show search widget in sticky header only on search page
const isSearchPage = computed(() => route.path === '/search')

// Track route depth for transition direction
const prevDepth = ref<number>(0)
const transitionName = ref<string>('slide')

watch(
  () => route.meta.depth,
  (newDepth) => {
    const depth = typeof newDepth === 'number' ? newDepth : 0

    if (depth > prevDepth.value) {
      // Going deeper - slide from right to left
      transitionName.value = 'slide'
    } else {
      // Going back - slide from left to right
      transitionName.value = 'slide-reverse'
    }

    prevDepth.value = depth
  },
  { immediate: true }
)
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
  <router-view v-slot="{ Component, route: currentRoute }">
    <Transition :name="transitionName" mode="out-in">
      <div :key="currentRoute.path" class="view-wrapper">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </div>
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
    top: 60px;
  }
}

.search-header {
  padding: 1rem 0 0;
}

.search-widget-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 968px) {
  .search-widget-container {
    padding: 0 1rem;
  }
}

.view-wrapper {
  width: 100%;
}
</style>
