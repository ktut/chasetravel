<template>
  <svg
    class="loading-spinner"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ width: size, height: size }"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      :stroke="color"
      stroke-width="3"
      fill="none"
      opacity="0.25"
    />
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12"
      :stroke="color"
      stroke-width="3"
      fill="none"
      stroke-linecap="round"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: '20px'
    },
    color: {
      type: String,
      default: 'white'
    }
  }
}
</script>

<style scoped lang="scss">
.loading-spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
