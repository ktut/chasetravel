<script lang="ts">
export default {
  name: 'NavBar',
  props: {
    points: {
      type: Number,
      default: 86060
    }
  },
  data() {
    return {
      isSignedIn: false,
      isLoading: false
    }
  },
  computed: {
    formattedPoints(): string {
      return this.points.toLocaleString('en-US')
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
    }
  }
}
</script>

<template>
  <nav class="navbar">
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
        <div v-else class="navbar__points">
          <img src="@/assets/chase-logo.png" alt="Chase" class="navbar__points-icon" />
          <span class="navbar__points-text">{{ formattedPoints }} pts</span>
        </div>

        <!-- Bookmark Icon -->
        <button class="navbar__icon-btn" aria-label="Bookmarks">
          <svg class="navbar__icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19 21L12 16L5 21V5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21Z"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

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
  background: white;
  border-bottom: 1px solid #e5e5e5;
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
    background: #4169E1;
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
      background: #3557C1;
    }

    &:active:not(:disabled) {
      background: #2A45A1;
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
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    animation: fadeIn 0.3s ease-in;
  }

  &__points-icon {
    width: 24px;
    height: 24px;
  }

  &__points-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #000;
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
