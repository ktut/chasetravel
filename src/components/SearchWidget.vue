<script lang="ts">
import Calendar from './Calendar.vue'
import { useSearchStore } from '@/stores/searchStore'

interface Location {
  name: string
  code: string
}

interface PassengerCounts {
  adults: number
  children: number
}

export default {
  name: 'SearchWidget',
  components: {
    Calendar
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
      passengerCounts: {
        adults: 1,
        children: 0
      } as PassengerCounts,
      showPassengerDropdown: false,
      checkInDate: null as Date | null,
      checkOutDate: null as Date | null,
      checkInFlexibility: 'exact' as string,
      checkOutFlexibility: 'exact' as string,
      isMinimized: false,
      // Sample locations for typeahead
      allLocations: [
        { name: 'New York, NY', code: 'NYC' },
        { name: 'Los Angeles, CA', code: 'LAX' },
        { name: 'Chicago, IL', code: 'ORD' },
        { name: 'San Francisco, CA', code: 'SFO' },
        { name: 'Miami, FL', code: 'MIA' },
        { name: 'Boston, MA', code: 'BOS' },
        { name: 'Seattle, WA', code: 'SEA' },
        { name: 'Las Vegas, NV', code: 'LAS' },
        { name: 'Orlando, FL', code: 'MCO' },
        { name: 'Denver, CO', code: 'DEN' },
        { name: 'Paris, France', code: 'CDG' },
        { name: 'London, UK', code: 'LHR' },
        { name: 'Tokyo, Japan', code: 'NRT' },
        { name: 'Dubai, UAE', code: 'DXB' },
        { name: 'Rome, Italy', code: 'FCO' }
      ] as Location[]
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
      if (!this.location) return this.allLocations
      const search = this.location.toLowerCase()
      return this.allLocations.filter(loc =>
        loc.name.toLowerCase().includes(search) ||
        loc.code.toLowerCase().includes(search)
      )
    },
    filteredDestinations(): Location[] {
      if (!this.destination) return this.allLocations
      const search = this.destination.toLowerCase()
      return this.allLocations.filter(loc =>
        loc.name.toLowerCase().includes(search) ||
        loc.code.toLowerCase().includes(search)
      )
    },
    totalPassengers(): number {
      return this.passengerCounts.adults + this.passengerCounts.children
    },
    passengerLabel(): string {
      return `${this.totalPassengers}`
    },
    passengerFieldLabel(): string {
      return this.searchType === 'flights' ? 'Passengers' : 'Guests'
    },
    passengerDropdownLabel(): string {
      const parts = []
      if (this.passengerCounts.adults > 0) {
        parts.push(`${this.passengerCounts.adults} Adult${this.passengerCounts.adults > 1 ? 's' : ''}`)
      }
      if (this.passengerCounts.children > 0) {
        parts.push(`${this.passengerCounts.children} Child${this.passengerCounts.children > 1 ? 'ren' : ''}`)
      }
      return parts.join(', ')
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
      // Check if departure airport is selected
      if (!this.location) return true

      // Check if arrival airport is selected (only for flights)
      if (this.searchType === 'flights' && !this.destination) return true

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

      // Set locations
      if (query.from) {
        this.location = query.from as string
      }
      if (query.to) {
        this.destination = query.to as string
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
      if (!target.closest('.passenger-selector')) {
        this.showPassengerDropdown = false
      }
    },
    selectLocation(location: Location) {
      this.location = location.name
      this.showLocationDropdown = false
    },
    selectDestination(location: Location) {
      this.destination = location.name
      this.showDestinationDropdown = false
    },
    onLocationInput() {
      this.showLocationDropdown = true
      this.showDestinationDropdown = false
      this.showPassengerDropdown = false
    },
    onDestinationInput() {
      this.showDestinationDropdown = true
      this.showLocationDropdown = false
      this.showPassengerDropdown = false
    },
    togglePassengerDropdown() {
      this.showPassengerDropdown = !this.showPassengerDropdown
      this.showLocationDropdown = false
      this.showDestinationDropdown = false
    },
    incrementAdults() {
      if (this.passengerCounts.adults < 9) {
        this.passengerCounts.adults++
      }
    },
    decrementAdults() {
      if (this.passengerCounts.adults > 1) {
        this.passengerCounts.adults--
      }
    },
    incrementChildren() {
      if (this.passengerCounts.children < 9) {
        this.passengerCounts.children++
      }
    },
    decrementChildren() {
      if (this.passengerCounts.children > 0) {
        this.passengerCounts.children--
      }
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
          />
          <button
            v-if="location"
            class="clear-btn"
            @click="location = ''"
            type="button"
          >×</button>
        </div>
        <div v-if="showLocationDropdown && filteredLocations.length > 0" class="location-dropdown">
          <div
            v-for="loc in filteredLocations"
            :key="loc.code"
            class="location-option"
            @click="selectLocation(loc)"
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
          />
          <button
            v-if="destination"
            class="clear-btn"
            @click="destination = ''"
            type="button"
          >×</button>
        </div>
        <div v-if="showDestinationDropdown && filteredDestinations.length > 0" class="location-dropdown">
          <div
            v-for="loc in filteredDestinations"
            :key="loc.code"
            class="location-option"
            @click="selectDestination(loc)"
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
      <!-- Passenger selector -->
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
              <button class="control-btn" @click="decrementAdults" :disabled="passengerCounts.adults <= 1">-</button>
              <span class="passenger-count">{{ passengerCounts.adults }}</span>
              <button class="control-btn" @click="incrementAdults" :disabled="passengerCounts.adults >= 9">+</button>
            </div>
          </div>
          <div class="passenger-row">
            <span class="passenger-type">Children</span>
            <div class="passenger-controls">
              <button class="control-btn" @click="decrementChildren" :disabled="passengerCounts.children <= 0">-</button>
              <span class="passenger-count">{{ passengerCounts.children }}</span>
              <button class="control-btn" @click="incrementChildren" :disabled="passengerCounts.children >= 9">+</button>
            </div>
          </div>
        </div>
      </div>

      <button class="submit-btn btn-primary" @click="handleSubmit" :disabled="isSubmitDisabled">
        {{ submitButtonText }}
      </button>
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
  margin-bottom: 24px;
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

      &:hover {
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
}

.calendar-section {
  margin-bottom: 24px;
}

.submit-section {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;

  .submit-btn {
    padding: 14px 16px;
    font-size: 16px;
  }
}
</style>
