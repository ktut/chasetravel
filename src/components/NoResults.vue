<script lang="ts">
export default {
  name: 'NoResults',
  props: {
    searchType: {
      type: String as () => 'flights' | 'hotels',
      required: true
    }
  },
  computed: {
    isFlights(): boolean {
      return this.searchType === 'flights'
    }
  }
}
</script>

<template>
  <div class="no-results">
    <svg class="no-results-icon" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Island base -->
      <ellipse cx="60" cy="95" rx="45" ry="8" fill="#d0d0d0" opacity="0.5"/>

      <!-- Palm tree trunk -->
      <path d="M58 85 L58 75 Q59 65, 58 55 L58 45" stroke="#888" stroke-width="3" stroke-linecap="round"/>

      <!-- Coconuts -->
      <circle cx="56" cy="47" r="2.5" fill="#999"/>
      <circle cx="60" cy="47" r="2.5" fill="#999"/>

      <!-- Palm fronds -->
      <path d="M58 45 Q45 35, 35 30" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M58 45 Q40 40, 30 42" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M58 45 Q48 38, 38 38" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>

      <path d="M58 45 Q71 35, 81 30" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M58 45 Q76 40, 86 42" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M58 45 Q68 38, 78 38" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>

      <path d="M58 45 Q58 28, 58 22" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M58 45 Q54 32, 52 26" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M58 45 Q62 32, 64 26" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
    <h3>No {{ isFlights ? 'flights' : 'hotels' }} found{{ isFlights ? '.' : '' }}</h3>
    <p>Try adjusting your filters to see more results{{ isFlights ? '.' : '' }}</p>
  </div>
</template>

<style lang="scss" scoped>
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  .no-results-icon {
    width: 64px;
    height: 64px;
    color: $color-text-light;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: $color-text;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: $color-text-light;
    font-size: 1rem;
    margin: 0;
  }
}
</style>
