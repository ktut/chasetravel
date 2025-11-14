<script lang="ts">
export default {
  name: 'PointsPopover',
  props: {
    points: {
      type: Number,
      required: true
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedPoints(): string {
      return this.points.toLocaleString('en-US')
    },
    // Show last 4 digits of a card number (simulated from points)
    cardLastFour(): string {
      return String(this.points).slice(-4)
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <Transition name="popover">
    <div v-if="isVisible" class="popover">
      <!-- Arrow pointer -->
      <div class="popover__arrow"></div>

      <!-- Content section -->
      <div class="popover__content">
        <button
          class="popover__close-btn"
          @click="handleClose"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <h3 class="popover__title">Redeem your points for more value</h3>
        <p class="popover__text">
          You have points that can be redeemed for 1.5x-2x value if redeemed on Chase Travel with Points Boost.
        </p>
        <a href="#" class="popover__link" @click.prevent>Learn more</a>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.popover {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 400px;
  background: $color-primary;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;

  &__arrow {
    position: absolute;
    top: -8px;
    right: 48px;
    width: 16px;
    height: 16px;
    background: $color-primary;
    transform: rotate(45deg);
  }

  &__content {
    position: relative;
    background: $color-primary;
    padding: 24px 20px;
    color: white;
  }

  &__close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  &__title {
    font-family: "Queens", serif;
    font-size: 1.3rem;
    text-wrap: balance;
    line-height: 1.12;
    margin: 0 0 12px 0;
    padding-right: 24px;
  }

  &__text {
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 12px 0;
    color: rgba(255, 255, 255, 0.95);
  }

  &__link {
    display: inline-block;
    font-size: 13px;
    font-weight: 600;
    color: white;
    text-decoration: underline;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
}

// Transition animations
.popover-enter-active,
.popover-leave-active {
  transition: all 0.2s ease;
}

.popover-enter-from,
.popover-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 768px) {
  .popover {
    width: 270px;
    right: 0px;

    &__arrow {
      right: 36px;
    }
  }
}
</style>
