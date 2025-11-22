<script lang="ts">
export default {
  name: 'TripTypeToggle',
  props: {
    modelValue: {
      type: String,
      required: true,
      default: 'round-trip'
    }
  },
  emits: ['update:modelValue'],
  computed: {
    isRoundTrip(): boolean {
      return this.modelValue === 'round-trip'
    }
  },
  methods: {
    toggle() {
      const newValue = this.modelValue === 'round-trip' ? 'one-way' : 'round-trip'
      this.$emit('update:modelValue', newValue)
    }
  }
}
</script>

<template>
  <div class="trip-type-toggle">
    <label class="switch-label">
      <span class="label-text">Round-trip</span>
      <button
        class="switch"
        :class="{ 'one-way': !isRoundTrip }"
        @click="toggle"
        :aria-label="isRoundTrip ? 'Switch to one-way' : 'Switch to round-trip'"
        role="switch"
        :aria-checked="isRoundTrip"
      >
        <span class="slider"></span>
      </button>
      <span class="label-text">One-way</span>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.trip-type-toggle {
  .switch-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
  }

  .label-text {
    font-size: 14px;
    font-weight: 500;
    color: $color-text;
    transition: color 0.2s;
  }

  .switch {
    position: relative;
    width: 44px;
    height: 24px;
    background: $color-accent;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    padding: 0;

    &.one-way {
      background: #9ca3af;
    }

    &:hover {
      opacity: 0.9;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .slider {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    &.one-way .slider {
      transform: translateX(20px);
    }
  }
}
</style>
