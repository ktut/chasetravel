<script lang="ts">
import PointsPopover from './PointsPopover.vue'

export default {
  name: 'NavBar',
  components: {
    PointsPopover
  },
  props: {
    points: {
      type: Number,
      default: 86060
    }
  },
  data() {
    return {
      isSignedIn: false,
      isLoading: false,
      isPopoverVisible: false
    }
  },
  computed: {
    formattedPoints(): string {
      return this.points.toLocaleString('en-US')
    },
    cardLastFour(): string {
      return String(this.points).slice(-4)
    }
  },
  methods: {
    handleSignIn() {
      if (this.isSignedIn || this.isLoading) return

      this.isLoading = true

      setTimeout(() => {
        this.isLoading = false
        this.isSignedIn = true
      }, 2000)
    },
    showPopover() {
      this.isPopoverVisible = true
    },
    hidePopover() {
      this.isPopoverVisible = false
    },
    closePopover() {
      this.isPopoverVisible = false
    }
  }
}
</script>

<template>
  <nav class="navbar glass-effect">
    <div class="navbar__container">
      <!-- Logo Section -->
      <div class="navbar__logo">
        <img src="@/assets/chase-logo.png" alt="Chase" class="navbar__logo-icon" />
        <span class="navbar__logo-text">Travel</span>
      </div>

      <!-- Right Section -->
      <div class="navbar__right">
        <!-- Sign In Button / Points Display -->
        <button
          v-if="!isSignedIn"
          @click="handleSignIn"
          :disabled="isLoading"
          class="navbar__signin-btn"
        >
          <svg
            v-if="isLoading"
            class="navbar__spinner"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="white"
              stroke-width="3"
              fill="none"
              opacity="0.25"
            />
            <path
              d="M12 2C6.47715 2 2 6.47715 2 12"
              stroke="white"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <span v-else>Sign in</span>
        </button>

        <!-- Points Display (shown after sign in) -->
        <div
          v-else
          class="navbar__points"
          @mouseenter="showPopover"
          @mouseleave="hidePopover"
        >
          <div class="navbar__points-card">
            <img src="@/assets/SR_card_shadow.png" alt="Card" class="navbar__points-icon" />
            <span class="navbar__card-number">...{{ cardLastFour }}</span>
          </div>
          <span class="navbar__points-text">{{ formattedPoints }} pts</span>

          <!-- Popover -->
          <PointsPopover
            :points="points"
            :is-visible="isPopoverVisible"
            @close="closePopover"
          />
        </div>

        <!-- User Profile Icon -->
        <button class="navbar__icon-btn" aria-label="User profile">
          <svg class="navbar__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <circle
              cx="12"
              cy="10"
              r="3"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M6.5 18.5C7.5 16.5 9.5 15 12 15C14.5 15 16.5 16.5 17.5 18.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  border-bottom: 1px solid rgba(229, 229, 229, 0.6);
  position: sticky;
  top: 0;
  z-index: 1000;

  &__container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__logo-icon {
    width: 32px;
    height: 32px;
  }

  &__logo-text {
    font-size: 1.5rem;
    font-weight: 400;
    color: #000;
    letter-spacing: -0.02em;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__signin-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1.5rem;
    background: $color-accent;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    min-width: 100px;
    height: 36px;

    &:hover:not(:disabled) {
      background: darken($color-accent, 10%);
    }

    &:active:not(:disabled) {
      background: $color-grey;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.9;
    }
  }

  &__spinner {
    width: 20px;
    height: 20px;
    animation: spin 0.8s linear infinite;
  }

  &__points {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    animation: fadeIn 0.3s ease-in;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;

    &:hover {
      background-color: rgba(0, 45, 92, 0.05);
      border-color: #002d5c;
    }
  }

  &__points-card {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  &__points-icon {
    width: 28px;
    height: 18px;
    object-fit: cover;
    border-radius: 2px;
  }

  &__card-number {
    font-size: 0.875rem;
    font-weight: 500;
    color: #000;
  }

  &__points-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0a8a4e;
  }

  &__icon-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    transition: background-color 0.2s ease;
    border-radius: 4px;

    &:hover {
      background-color: #f5f5f5;
    }

    &:active {
      background-color: #e5e5e5;
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .navbar {
    &__container {
      padding: 0.5rem 1rem;
    }

    &__logo-text {
      font-size: 1.25rem;
    }

    &__signin-btn {
      padding: 0.375rem 1.25rem;
      font-size: 0.8125rem;
      min-width: 90px;
    }

    &__points {
      padding: 0.375rem 0.75rem;
    }

    &__points-text {
      font-size: 0.8125rem;
    }

    &__right {
      gap: 0.5rem;
    }
  }
}
</style>
