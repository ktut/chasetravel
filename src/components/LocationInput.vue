<script lang="ts">
import { LOCATIONS, type Location } from '@/constants'

export default {
  name: 'LocationInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Location'
    },
    ariaLabel: {
      type: String,
      default: 'Location'
    },
    excludeLocation: {
      type: Object as () => Location | null,
      default: null
    },
    allLocations: {
      type: Array as () => Location[],
      default: () => LOCATIONS
    }
  },
  emits: ['update:modelValue', 'select'],
  data() {
    return {
      showDropdown: false,
      selectedIndex: -1,
      selectedLocation: null as Location | null
    }
  },
  computed: {
    filteredLocations(): Location[] {
      const search = this.modelValue ? this.modelValue.toLowerCase() : ''
      return this.allLocations.filter(loc => {
        // Exclude if this location matches the excluded location
        if (this.excludeLocation && loc.code === this.excludeLocation.code) {
          return false
        }
        // If no search text, show all (except excluded)
        if (!search) return true
        // Otherwise filter by search text
        return loc.name.toLowerCase().includes(search) || loc.code.toLowerCase().includes(search)
      })
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
    // Initialize selectedLocation if modelValue matches a location
    if (this.modelValue) {
      const matchingLocation = this.allLocations.find(loc => loc.name === this.modelValue)
      if (matchingLocation) {
        this.selectedLocation = matchingLocation
      }
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  watch: {
    modelValue(newValue) {
      // Clear selected location if input value doesn't match
      if (this.selectedLocation && newValue !== this.selectedLocation.name) {
        this.selectedLocation = null
      }
    }
  },
  methods: {
    handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('.location-input-wrapper')) {
        this.showDropdown = false
      }
    },
    selectLocation(location: Location) {
      this.selectedLocation = location
      this.$emit('update:modelValue', location.name)
      this.$emit('select', location)
      this.showDropdown = false
      this.selectedIndex = -1
    },
    onFocus() {
      this.showDropdown = true
      this.selectedIndex = -1
    },
    onInput(event: Event) {
      const target = event.target as HTMLInputElement
      this.$emit('update:modelValue', target.value)
      this.showDropdown = true
      this.selectedIndex = -1
      // Clear selected location if input value doesn't match
      if (this.selectedLocation && target.value !== this.selectedLocation.name) {
        this.selectedLocation = null
      }
    },
    handleKeydown(event: KeyboardEvent) {
      if (!this.showDropdown || this.filteredLocations.length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.selectedIndex = Math.min(
            this.selectedIndex + 1,
            this.filteredLocations.length - 1
          )
          this.scrollDropdownIntoView()
          break
        case 'ArrowUp':
          event.preventDefault()
          this.selectedIndex = Math.max(this.selectedIndex - 1, 0)
          this.scrollDropdownIntoView()
          break
        case 'Enter':
          event.preventDefault()
          if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredLocations.length) {
            this.selectLocation(this.filteredLocations[this.selectedIndex])
          }
          break
        case 'Escape':
          event.preventDefault()
          this.showDropdown = false
          this.selectedIndex = -1
          break
      }
    },
    scrollDropdownIntoView() {
      // Wait for next tick to ensure DOM is updated
      this.$nextTick(() => {
        const dropdown = this.$el.querySelector('.location-dropdown')
        if (!dropdown) return

        const selectedOption = dropdown.querySelector('.location-option.keyboard-selected')
        if (selectedOption) {
          selectedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
      })
    },
    clear() {
      this.$emit('update:modelValue', '')
      this.selectedLocation = null
      this.showDropdown = false
    }
  }
}
</script>

<template>
  <div class="location-input-wrapper">
    <div class="input-with-clear">
      <input
        :value="modelValue"
        type="text"
        class="location-input"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        @input="onInput"
        @focus="onFocus"
        @keydown="handleKeydown"
        autocomplete="off"
      />
      <button
        v-if="modelValue"
        class="clear-btn"
        @click="clear"
        type="button"
      >×</button>
    </div>
    <div v-if="showDropdown && filteredLocations.length > 0" class="location-dropdown">
      <div
        v-for="(loc, index) in filteredLocations"
        :key="loc.code"
        class="location-option"
        :class="{ 'keyboard-selected': index === selectedIndex }"
        @click="selectLocation(loc)"
        @mouseenter="selectedIndex = index"
      >
        <span class="location-name">{{ loc.name }}</span>
        <span class="location-code">{{ loc.code }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.location-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 0;

  .input-with-clear {
    position: relative;
    display: flex;
    align-items: center;
  }

  .location-input {
    width: 100%;
    padding: 8px 12px;
    padding-right: 36px;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    transition: border-color 0.2s;
    height: 40px;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: $color-accent;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  .clear-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border: none;
    background: #d0d0d0;
    color: white;
    border-radius: 50%;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: all 0.2s;

    &:hover {
      background: #999;
    }

    &:active {
      transform: translateY(-50%) scale(0.95);
    }
  }

  .location-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;

    .location-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover,
      &.keyboard-selected {
        background: #f5f5f5;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }

      .location-name {
        font-size: 14px;
        color: #000;
      }

      .location-code {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
    }
  }
}
</style>

