<script lang="ts">
import Calendar from './Calendar.vue'
import PassengerSelector from './PassengerSelector.vue'
import { useSearchStore } from '@/stores/searchStore'
import { LOCATIONS, type Location } from '@/constants'

interface PassengerCounts {
  adults: number
  children: number
}

export default {
  name: 'SearchWidget',
  components: {
    Calendar,
    PassengerSelector
  },
  setup() {
    const searchStore = useSearchStore()
    return { searchStore }
  },
  data() {
    return {
      searchType: 'flights' as 'flights' | 'hotels' | 'cars' | 'activities' | 'cruises' | 'tours',
      location: '',
      destination: '',
      showLocationDropdown: false,
      showDestinationDropdown: false,
      selectedLocationIndex: -1,
      selectedDestinationIndex: -1,
      selectedLocation: null as Location | null,
      selectedDestination: null as Location | null,
      passengerCounts: {
        adults: 1,
        children: 0
      } as PassengerCounts,
      checkInDate: null as Date | null,
      checkOutDate: null as Date | null,
      checkInFlexibility: 'exact' as string,
      checkOutFlexibility: 'exact' as string,
      isMinimized: false,
      // Sample locations for typeahead
      allLocations: LOCATIONS
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
    window.addEventListener('scroll', this.handleScroll)
    // Initialize from query params if on search page
    this.initializeFromQueryParams()
    // Minimize on search page by default
    if (this.isOnSearchPage) {
      this.isMinimized = true
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('scroll', this.handleScroll)
  },
  watch: {
    '$route.query': {
      handler() {
        // Update form when query params change
        this.initializeFromQueryParams()
      },
      deep: true
    },
    $route(to) {
      if (to.fullPath === '/') {
        this.isMinimized = false
      }
    }
  },
  computed: {
    isOnSearchPage(): boolean {
      return this.$route.path === '/search'
    },
    submitButtonText(): string {
      if (this.isOnSearchPage) {
        return 'Update Search'
      }
      return `Search ${this.searchType === 'flights' ? 'Flights' : 'Hotels'}`
    },
    filteredLocations(): Location[] {
      const search = this.location ? this.location.toLowerCase() : ''
      return this.allLocations.filter(loc => {
        // Exclude if this location is already selected as destination
        if (this.selectedDestination && loc.code === this.selectedDestination.code) {
          return false
        }
        // If no search text, show all (except excluded)
        if (!search) return true
        // Otherwise filter by search text
        return loc.name.toLowerCase().includes(search) || loc.code.toLowerCase().includes(search)
      })
    },
    filteredDestinations(): Location[] {
      const search = this.destination ? this.destination.toLowerCase() : ''
      return this.allLocations.filter(loc => {
        // Exclude if this location is already selected as origin
        if (this.selectedLocation && loc.code === this.selectedLocation.code) {
          return false
        }
        // If no search text, show all (except excluded)
        if (!search) return true
        // Otherwise filter by search text
        return loc.name.toLowerCase().includes(search) || loc.code.toLowerCase().includes(search)
      })
    },
    totalPassengers(): number {
      return this.passengerCounts.adults + this.passengerCounts.children
    },
    locationLabel(): string {
      return this.searchType === 'flights' ? 'From' : 'Location'
    },
    showDestinationField(): boolean {
      return this.searchType === 'flights'
    },
    minimizedSearchSummary(): string {
      // Extract location codes from full names
      const getCode = (fullName: string) => {
        const location = this.allLocations.find(loc => loc.name === fullName)
        return location ? location.code : fullName
      }

      const fromCode = this.location ? getCode(this.location) : '—'
      const toCode = this.destination ? getCode(this.destination) : '—'

      // Format dates
      const formatDate = (date: Date | null) => {
        if (!date) return '—'
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }

      const checkInFormatted = formatDate(this.checkInDate)
      const checkOutFormatted = formatDate(this.checkOutDate)

      // Build summary based on search type
      if (this.searchType === 'flights') {
        return `${fromCode} - ${toCode} • ${checkInFormatted} - ${checkOutFormatted}`
      } else {
        return `${fromCode} • ${checkInFormatted} - ${checkOutFormatted}`
      }
    },
    isSubmitDisabled(): boolean {
      // Check if a valid location is selected (not just typed text)
      if (!this.location || !this.selectedLocation) return true

      // Check if a valid destination is selected (only for flights)
      if (this.searchType === 'flights' && (!this.destination || !this.selectedDestination)) return true

      // Check if dates are selected
      if (!this.checkInDate || !this.checkOutDate) return true

      // Check if there are passengers (total should be at least 1)
      if (this.totalPassengers < 1) return true

      return false
    }
  },
  methods: {
    initializeFromQueryParams() {
      const query = this.$route.query

      // Only initialize if we have query params
      if (Object.keys(query).length === 0) return

      // Set search type
      if (query.type) {
        this.searchType = query.type as 'flights' | 'hotels'
      }

      // Set locations and find matching location objects
      if (query.from) {
        this.location = query.from as string
        this.selectedLocation = this.allLocations.find(loc => loc.name === query.from) || null
      }
      if (query.to) {
        this.destination = query.to as string
        this.selectedDestination = this.allLocations.find(loc => loc.name === query.to) || null
      }

      // Set dates
      if (query.checkIn) {
        this.checkInDate = new Date(query.checkIn as string)
      }
      if (query.checkOut) {
        this.checkOutDate = new Date(query.checkOut as string)
      }

      // Set flexibility
      if (query.checkInFlex) {
        this.checkInFlexibility = query.checkInFlex as string
      }
      if (query.checkOutFlex) {
        this.checkOutFlexibility = query.checkOutFlex as string
      }

      // Set passengers
      if (query.adults) {
        this.passengerCounts.adults = parseInt(query.adults as string)
      }
      if (query.children) {
        this.passengerCounts.children = parseInt(query.children as string)
      }
    },
    handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('.location-input-wrapper')) {
        this.showLocationDropdown = false
        this.showDestinationDropdown = false
      }
    },
    selectLocation(location: Location) {
      this.location = location.name
      this.selectedLocation = location
      this.showLocationDropdown = false
      this.selectedLocationIndex = -1
    },
    selectDestination(location: Location) {
      this.destination = location.name
      this.selectedDestination = location
      this.showDestinationDropdown = false
      this.selectedDestinationIndex = -1
    },
    onLocationInput() {
      this.showLocationDropdown = true
      this.showDestinationDropdown = false
      this.selectedLocationIndex = -1
      // Clear selected location when user starts typing
      this.selectedLocation = null
    },
    onDestinationInput() {
      this.showDestinationDropdown = true
      this.showLocationDropdown = false
      this.selectedDestinationIndex = -1
      // Clear selected destination when user starts typing
      this.selectedDestination = null
    },
    handleLocationKeydown(event: KeyboardEvent) {
      if (!this.showLocationDropdown || this.filteredLocations.length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.selectedLocationIndex = Math.min(
            this.selectedLocationIndex + 1,
            this.filteredLocations.length - 1
          )
          this.scrollDropdownIntoView('location')
          break
        case 'ArrowUp':
          event.preventDefault()
          this.selectedLocationIndex = Math.max(this.selectedLocationIndex - 1, 0)
          this.scrollDropdownIntoView('location')
          break
        case 'Enter':
          event.preventDefault()
          if (this.selectedLocationIndex >= 0 && this.selectedLocationIndex < this.filteredLocations.length) {
            this.selectLocation(this.filteredLocations[this.selectedLocationIndex])
          }
          break
        case 'Escape':
          event.preventDefault()
          this.showLocationDropdown = false
          this.selectedLocationIndex = -1
          break
      }
    },
    handleDestinationKeydown(event: KeyboardEvent) {
      if (!this.showDestinationDropdown || this.filteredDestinations.length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          this.selectedDestinationIndex = Math.min(
            this.selectedDestinationIndex + 1,
            this.filteredDestinations.length - 1
          )
          this.scrollDropdownIntoView('destination')
          break
        case 'ArrowUp':
          event.preventDefault()
          this.selectedDestinationIndex = Math.max(this.selectedDestinationIndex - 1, 0)
          this.scrollDropdownIntoView('destination')
          break
        case 'Enter':
          event.preventDefault()
          if (this.selectedDestinationIndex >= 0 && this.selectedDestinationIndex < this.filteredDestinations.length) {
            this.selectDestination(this.filteredDestinations[this.selectedDestinationIndex])
          }
          break
        case 'Escape':
          event.preventDefault()
          this.showDestinationDropdown = false
          this.selectedDestinationIndex = -1
          break
      }
    },
    scrollDropdownIntoView(type: 'location' | 'destination') {
      // Wait for next tick to ensure DOM is updated
      this.$nextTick(() => {
        const dropdown = this.$el.querySelector(
          type === 'location' ? '.location-dropdown' : '.destination-dropdown'
        )
        if (!dropdown) return

        const selectedOption = dropdown.querySelector('.location-option.keyboard-selected')
        if (selectedOption) {
          selectedOption.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
      })
    },
    handleDateRangeSelected(dateRange: {
      checkIn: Date | null,
      checkOut: Date | null,
      checkInFlexibility?: string,
      checkOutFlexibility?: string
    }) {
      this.checkInDate = dateRange.checkIn
      this.checkOutDate = dateRange.checkOut
      if (dateRange.checkInFlexibility) {
        this.checkInFlexibility = dateRange.checkInFlexibility
      }
      if (dateRange.checkOutFlexibility) {
        this.checkOutFlexibility = dateRange.checkOutFlexibility
      }
    },
    handleScroll() {
      // Only handle scroll on search page
      if (!this.isOnSearchPage) {
        if (this.isMinimized) {
          this.isMinimized = false
        }
        return
      }

      // Minimize when scrolled down from top
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > 0 && !this.isMinimized) {
        this.isMinimized = true
      }
    },
    handleEdit() {
      // Scroll to top with smooth behavior
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // Unminimize the component
      this.isMinimized = false
    },
    handleSubmit() {
      // Guard clause - should not be able to submit if button is disabled
      if (this.isSubmitDisabled) {
        return
      }

      const searchData = {
        searchType: this.searchType,
        location: this.location,
        destination: this.searchType === 'flights' ? this.destination : undefined,
        checkIn: this.checkInDate!,
        checkOut: this.checkOutDate!,
        checkInFlexibility: this.checkInFlexibility,
        checkOutFlexibility: this.checkOutFlexibility,
        passengers: {
          adults: this.passengerCounts.adults,
          children: this.passengerCounts.children,
          total: this.totalPassengers
        }
      }

      // Build query parameters from search data
      const query: any = {
        type: searchData.searchType,
        from: searchData.location,
        adults: searchData.passengers.adults.toString()
      }

      // Only add children if > 0
      if (searchData.passengers.children > 0) {
        query.children = searchData.passengers.children.toString()
      }

      if (searchData.destination) {
        query.to = searchData.destination
      }

      if (searchData.checkIn) {
        query.checkIn = searchData.checkIn.toISOString()
      }

      if (searchData.checkOut) {
        query.checkOut = searchData.checkOut.toISOString()
      }

      if (searchData.checkInFlexibility) {
        query.checkInFlex = searchData.checkInFlexibility
      }

      if (searchData.checkOutFlexibility) {
        query.checkOutFlex = searchData.checkOutFlexibility
      }

      // First emit the event for compatibility with pages that listen for it
      this.$emit('search-submitted', searchData)

      // If already on search page, just update the query params
      if (this.$route.path === '/search') {
        // Update the URL query params
        this.$router.push({ path: '/search', query })
        // Minimize after updating search
        this.isMinimized = true
      } else {
        // Navigate to the search route
        // Scroll to top first so user can see the transition
        window.scrollTo({ top: 0, behavior: 'smooth' })

        // Wait for half a second, then navigate to the search route
        setTimeout(() => {
          this.$router.push({ path: '/search', query })
        }, 500)
      }
    }
  }
}
</script>

<template>
  <div class="search-widget" :class="{ 'minimized': isMinimized }">
    <!-- Minimized view -->
    <div v-if="isMinimized" class="minimized-view" @click="handleEdit">
      <span class="minimized-summary">{{ minimizedSearchSummary }}</span>
    </div>

    <!-- Full view -->
    <div v-if="!isMinimized" class="full-view">
    <!-- <h1 class="image-top-group-title">Your most rewarding trips start here.</h1> -->
    <!-- Search type toggle -->
    <div class="search-type-toggle">
      <div class="toggle-buttons">
        <button
          :class="['toggle-btn', 'btn-outline', { active: searchType === 'flights' }]"
          @click="searchType = 'flights'"
        >
          <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path>
          </svg>
          Flights
        </button>
        <button
          :class="['toggle-btn', 'btn-outline', { active: searchType === 'hotels' }]"
          @click="searchType = 'hotels'"
        >
          <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Stays
        </button>
        <button
          :class="['toggle-btn', 'btn-outline', { active: searchType === 'cars' }]"
          @click="searchType = 'cars'"
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
          :class="['toggle-btn', 'btn-outline', { active: searchType === 'activities' }]"
          @click="searchType = 'activities'"
          disabled
        >
          <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          Activities
        </button>
        <button
          :class="['toggle-btn', 'btn-outline', { active: searchType === 'cruises' }]"
          @click="searchType = 'cruises'"
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
          :class="['toggle-btn', 'btn-outline', { active: searchType === 'tours' }]"
          @click="searchType = 'tours'"
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

    <!-- Location inputs -->
    <div class="search-inputs">
      <!-- From/Location field -->
      <div class="location-input-wrapper location-primary">
        <div class="input-with-clear">
          <input
            v-model="location"
            type="text"
            class="location-input"
            :placeholder="searchType === 'flights' ? 'From' : 'Location'"
            :aria-label="locationLabel"
            @input="onLocationInput"
            @focus="onLocationInput"
            @keydown="handleLocationKeydown"
            autocomplete="off"
          />
          <button
            v-if="location"
            class="clear-btn"
            @click="location = ''; selectedLocation = null"
            type="button"
          >×</button>
        </div>
        <div v-if="showLocationDropdown && filteredLocations.length > 0" class="location-dropdown">
          <div
            v-for="(loc, index) in filteredLocations"
            :key="loc.code"
            class="location-option"
            :class="{ 'keyboard-selected': index === selectedLocationIndex }"
            @click="selectLocation(loc)"
            @mouseenter="selectedLocationIndex = index"
          >
            <span class="location-name">{{ loc.name }}</span>
            <span class="location-code">{{ loc.code }}</span>
          </div>
        </div>
      </div>

      <!-- To field (only for flights) -->
      <div v-if="showDestinationField" class="location-input-wrapper location-primary">
        <div class="input-with-clear">
          <input
            v-model="destination"
            type="text"
            class="location-input"
            placeholder="To"
            aria-label="To"
            @input="onDestinationInput"
            @focus="onDestinationInput"
            @keydown="handleDestinationKeydown"
            autocomplete="off"
          />
          <button
            v-if="destination"
            class="clear-btn"
            @click="destination = ''; selectedDestination = null"
            type="button"
          >×</button>
        </div>
        <div v-if="showDestinationDropdown && filteredDestinations.length > 0" class="location-dropdown destination-dropdown">
          <div
            v-for="(loc, index) in filteredDestinations"
            :key="loc.code"
            class="location-option"
            :class="{ 'keyboard-selected': index === selectedDestinationIndex }"
            @click="selectDestination(loc)"
            @mouseenter="selectedDestinationIndex = index"
          >
            <span class="location-name">{{ loc.name }}</span>
            <span class="location-code">{{ loc.code }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar component -->
    <div class="calendar-section">
      <Calendar
        :initial-check-in="checkInDate"
        :initial-check-out="checkOutDate"
        :initial-check-in-flexibility="checkInFlexibility"
        :initial-check-out-flexibility="checkOutFlexibility"
        @date-range-selected="handleDateRangeSelected"
      />
    </div>

    <!-- Submit button and passenger selector -->
    <div class="submit-section">
      <div class="main-actions">
        <!-- Passenger selector -->
        <PassengerSelector
          :adults="passengerCounts.adults"
          :children="passengerCounts.children"
          :search-type="searchType"
          @update:adults="passengerCounts.adults = $event"
          @update:children="passengerCounts.children = $event"
        />

        <button class="submit-btn btn-primary" @click="handleSubmit" :disabled="isSubmitDisabled">
          {{ submitButtonText }}
        </button>
      </div>

      <router-link v-if="searchStore.isSignedIn" to="/mybookings" class="bookings-btn btn-outline">
        My Bookings
      </router-link>
    </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-widget {
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  background: white;
  transition: all 0.3s ease-in-out;

  &.minimized {
    padding: 0;
    box-shadow: none;
    border-radius: 8px;
    border: 1px solid $color-light-grey;
    overflow: hidden;
    transition: border-color 0.2s;

    &:hover {
      border-color: $color-accent;
    }
  }
}

.minimized-view {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: $color-bg-light;
  }

  .minimized-summary {
    font-size: 0.95rem;
    font-weight: 600;
    color: $color-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
}

.full-view {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.image-top-group-title {
  font-size: 2.3rem;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
  @media (max-width: $breakpoint-mobile) {
    display: none;
  }
}

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

.search-inputs {
  display: flex;
  gap: 12px;
  margin-bottom: 0.5rem;
  align-items: stretch;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
}

.location-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 0;

  &.location-primary {
    flex: 2;

    @media (max-width: 768px) {
      flex: 1 1 100%;
    }
  }

  .input-with-clear {
    position: relative;
    display: flex;
    align-items: center;
  }

  .location-input {
    width: 100%;
    padding: 10px 12px;
    padding-right: 36px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s;

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
    border-radius: 4px;
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

.calendar-section {
  margin-bottom: 24px;
}

.submit-section {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .main-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  .bookings-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    font-size: 16px;
    white-space: nowrap;
    text-decoration: none;
    background: white;
    color: $color-text;
    border-color: $color-light-grey;
    align-self: flex-end;

    &:hover {
      border-color: $color-accent;
      background: white;
      color: $color-text;
    }

    @media (max-width: 768px) {
      align-self: stretch;
      width: 100%;
    }
  }

  .submit-btn {
    padding: 12px 16px;
    font-size: 16px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }
}
</style>
