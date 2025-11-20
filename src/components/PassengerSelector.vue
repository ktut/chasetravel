<script lang="ts">
export default {
  name: 'PassengerSelector',
  props: {
    adults: {
      type: Number,
      required: true,
      default: 1
    },
    children: {
      type: Number,
      required: true,
      default: 0
    },
    searchType: {
      type: String,
      required: true,
      default: 'flights'
    }
  },
  data() {
    return {
      showPassengerDropdown: false
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  computed: {
    totalPassengers(): number {
      return this.adults + this.children
    },
    passengerLabel(): string {
      return `${this.totalPassengers}`
    },
    passengerFieldLabel(): string {
      return this.searchType === 'flights' ? 'Passengers' : 'Guests'
    },
    passengerDropdownLabel(): string {
      const parts = []
      if (this.adults > 0) {
        parts.push(`${this.adults} Adult${this.adults > 1 ? 's' : ''}`)
      }
      if (this.children > 0) {
        parts.push(`${this.children} Child${this.children > 1 ? 'ren' : ''}`)
      }
      return parts.join(', ')
    }
  },
  methods: {
    handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('.passenger-selector')) {
        this.showPassengerDropdown = false
      }
    },
    togglePassengerDropdown() {
      this.showPassengerDropdown = !this.showPassengerDropdown
    },
    incrementAdults() {
      if (this.adults < 9) {
        this.$emit('update:adults', this.adults + 1)
      }
    },
    decrementAdults() {
      if (this.adults > 1) {
        this.$emit('update:adults', this.adults - 1)
      }
    },
    incrementChildren() {
      if (this.children < 9) {
        this.$emit('update:children', this.children + 1)
      }
    },
    decrementChildren() {
      if (this.children > 0) {
        this.$emit('update:children', this.children - 1)
      }
    }
  }
}
</script>

<template>
  <div class="passenger-selector">
    <button
      class="passenger-button btn-outline"
      @click="togglePassengerDropdown"
      :aria-label="passengerFieldLabel"
    >
      <svg class="person-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span class="passenger-count-display">{{ passengerLabel }}</span>
    </button>
    <div v-if="showPassengerDropdown" class="passenger-dropdown">
      <div class="passenger-dropdown-header">{{ passengerDropdownLabel }}</div>
      <div class="passenger-row">
        <span class="passenger-type">Adults</span>
        <div class="passenger-controls">
          <button class="control-btn" @click="decrementAdults" :disabled="adults <= 1">-</button>
          <span class="passenger-count">{{ adults }}</span>
          <button class="control-btn" @click="incrementAdults" :disabled="adults >= 9">+</button>
        </div>
      </div>
      <div class="passenger-row">
        <span class="passenger-type">Children</span>
        <div class="passenger-controls">
          <button class="control-btn" @click="decrementChildren" :disabled="children <= 0">-</button>
          <span class="passenger-count">{{ children }}</span>
          <button class="control-btn" @click="incrementChildren" :disabled="children >= 9">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.passenger-selector {
  position: relative;
  flex: 0 0 auto;

  .passenger-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    white-space: nowrap;
    padding-left: 0.5rem;
    padding-right: 0.5rem;

    &:hover:not(:disabled) {
      .person-icon {
        stroke: white;
      }
    }
  }

  .person-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    transition: stroke 0.2s;
  }

  .passenger-count-display {
    font-weight: 600;
    font-size: 16px;
  }

  .passenger-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    left: auto;
    margin-top: 8px;
    background: white;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    padding: 12px;
    min-width: 250px;

    @media (max-width: 768px) {
      left: 0;
      right: 0;
    }
  }

  .passenger-dropdown-header {
    font-size: 14px;
    font-weight: 500;
    color: #000;
    padding: 8px 0 12px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
  }

  .passenger-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;

    &:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }

    .passenger-type {
      font-size: 14px;
      color: #000;
      font-weight: 500;
    }

    .passenger-controls {
      display: flex;
      align-items: center;
      gap: 12px;

      .control-btn {
        width: 32px;
        height: 32px;
        border: 1px solid #d0d0d0;
        border-radius: 4px;
        background: white;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover:not(:disabled) {
          background: #f5f5f5;
          border-color: $color-accent;
        }

        &:disabled {
          color: #d0d0d0;
          cursor: not-allowed;
          opacity: 0.5;
        }
      }

      .passenger-count {
        font-size: 16px;
        font-weight: 500;
        min-width: 24px;
        text-align: center;
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;

    .passenger-button {
      width: 100%;
      padding: 12px 16px;
    }
  }
}
</style>

