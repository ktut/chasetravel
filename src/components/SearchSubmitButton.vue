<script lang="ts">
export default {
  name: 'SearchSubmitButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isOnSearchPage: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>

<template>
  <button
    class="submit-btn btn-primary"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <!-- Magnifying glass icon for home page -->
    <svg
      v-if="!isOnSearchPage"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
    <!-- Rotating arrow icon for search page -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="rotating-arrow"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
      <path d="M21 3v5h-5"></path>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
      <path d="M3 21v-5h5"></path>
    </svg>
  </button>
</template>

<style lang="scss" scoped>
.submit-btn {
  padding: 8px 24px;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  height: 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    min-height: 48px;
    padding: 12px 24px;
  }

  svg {
    display: block;
  }
}
</style>
