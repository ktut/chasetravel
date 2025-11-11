<script lang="ts">
export default {
  name: 'TabNavigation',
  data() {
    return {
      activeTab: 'overview',
      tabs: [
        { id: 'overview', label: 'Overview' },
        { id: 'curated-collections', label: 'Curated collections' },
        { id: 'featured-properties', label: 'Featured properties' }
      ]
    }
  },
  methods: {
    setActiveTab(tabId: string) {
      this.activeTab = tabId
      this.$emit('tab-change', tabId)
    }
  }
}
</script>

<template>
  <nav class="tab-navigation">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      :class="['tab-button', { active: activeTab === tab.id }]"
      @click="setActiveTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<style lang="scss" scoped>
.tab-navigation {
  display: flex;
  gap: $spacing-xl;
  margin-bottom: $spacing-xl;
}

.tab-button {
  background: none;
  border: none;
  padding: 0 0 $spacing-sm 0;
  font-size: 1rem;
  color: #707070;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;
  font-family: inherit;
  font-weight: 400;
  white-space: nowrap;

  &:hover {
    color: #333;
  }

  &.active {
    color: #000;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background-color: #0066cc;
    }
  }

  &:focus-visible {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
  }
}
</style>
