<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
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

// Function to apply the correct overflow based on current route
const applyOverflow = () => {
  document.body.style.overflowY = route.path === '/' ? 'hidden' : ''
}

// Handle body overflow based on route
watch(() => route.path, applyOverflow, { immediate: true })

// Use MutationObserver to re-apply overflow when other components modify body.style
let observer: MutationObserver | null = null

onMounted(() => {
  observer = new MutationObserver(() => {
    // Re-apply overflow if it's been changed by another component
    const currentOverflow = document.body.style.overflowY
    const expectedOverflow = route.path === '/' ? 'hidden' : ''
    if (currentOverflow !== expectedOverflow) {
      applyOverflow()
    }
  })

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['style']
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
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
    <Transition :name="transitionName">
      <div :key="currentRoute.path" class="view-wrapper">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </div>
    </Transition>
  </router-view>
  
  <!-- Disclaimer Footer -->
  <footer class="disclaimer-footer">
    <div class="disclaimer-content">
      <strong>Disclaimer:</strong> Per JPMC confidentiality policies, no internal information was used in any way on this project. Everything was based solely on observations of the public-facing product.
    </div>
  </footer>
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
  padding: 2rem 0 0;
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

/* Ensure router-view container allows absolute positioning during transitions */
.router-view-container {
  position: relative;
}

/* Disclaimer Footer */
.disclaimer-footer {
  margin: 2rem auto;
  padding: 0 2rem 2rem;
  max-width: 1400px;
}

.disclaimer-content {
  position: relative;
  background: #faf8f3;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  padding-left: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.disclaimer-content::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #ff6b35;
  border-radius: 8px 0 0 8px;
}

.disclaimer-content strong {
  font-weight: 700;
}

@media (max-width: 768px) {
  .disclaimer-footer {
    padding: 0 1rem 1rem;
  }
  
  .disclaimer-content {
    font-size: 13px;
    padding: 0.875rem 1.25rem;
    padding-left: 1.75rem;
  }
}
</style>
