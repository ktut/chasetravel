<script lang="ts">
export default {
  name: 'SearchTypeToggle',
  props: {
    modelValue: {
      type: String,
      required: true,
      default: 'flights'
    }
  },
  emits: ['update:modelValue'],
  methods: {
    selectType(type: string) {
      this.$emit('update:modelValue', type)
    }
  }
}
</script>

<template>
  <div class="search-type-toggle">
    <div class="toggle-buttons">
      <button
        :class="['toggle-btn', 'btn-outline', { active: modelValue === 'flights' }]"
        @click="selectType('flights')"
      >
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path>
        </svg>
        Flights
      </button>
      <button
        :class="['toggle-btn', 'btn-outline', { active: modelValue === 'hotels' }]"
        @click="selectType('hotels')"
      >
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Stays
      </button>
      <button
        :class="['toggle-btn', 'btn-outline', { active: modelValue === 'cars' }]"
        @click="selectType('cars')"
        disabled
      >
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 16H9m10 0h3l-3-8h-4l-3 8Zm0 0h-3M7 16H4l3-8h4l-3 8Zm0 0h3m-3 0v4m3-4v4m0 0H7m3 0h4m-4 0v-4m4 4v-4m0 4h3m-3-4H10"></path>
          <circle cx="7" cy="20" r="2"></circle>
          <circle cx="17" cy="20" r="2"></circle>
        </svg>
        Cars
      </button>
      <button
        :class="['toggle-btn', 'btn-outline', { active: modelValue === 'activities' }]"
        @click="selectType('activities')"
        disabled
      >
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
        Activities
      </button>
      <button
        :class="['toggle-btn', 'btn-outline', { active: modelValue === 'cruises' }]"
        @click="selectType('cruises')"
        disabled
      >
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1"></path>
          <path d="M4 18 2 12h10l-1.106 3.93"></path>
          <path d="M14 18h6l2-6h-8.5"></path>
          <path d="M6 12V6"></path>
          <path d="M9 12V8"></path>
          <path d="M12 12V9"></path>
        </svg>
        Cruises
      </button>
      <button
        :class="['toggle-btn', 'btn-outline', { active: modelValue === 'tours' }]"
        @click="selectType('tours')"
        disabled
      >
        <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="10" r="3"></circle>
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"></path>
        </svg>
        Tours
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-type-toggle {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
  position: relative;

  .toggle-buttons {
    display: flex;
    gap: 8px;
    flex: 1;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    padding-bottom: 12px;
    @media (max-width: $breakpoint-mobile) {
      padding-bottom: 0;
    }

    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Edge */
    }
  }

  .toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 2rem;
    white-space: nowrap;
    flex-shrink: 0;
    background: white;
    color: $color-text;
    font-weight: 400;
    border-color: $color-light-grey;

    .toggle-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      transition: stroke 0.2s;
    }

    &.active,
    &:hover:not(:disabled) {
      border-color: $color-accent;
      background: white;
      color: $color-text;
      .toggle-icon {
        stroke: $color-accent;
      }
    }

    &:disabled {
      filter: grayscale(100%);
      cursor: not-allowed;
      color: #a8a8a8;
      border-color: $color-light-grey;
    }
  }
}
</style>

