<script lang="ts">
import Calendar from './Calendar.vue'
import PassengerSelector from './PassengerSelector.vue'
import SearchTypeToggle from './SearchTypeToggle.vue'
import TripTypeToggle from './TripTypeToggle.vue'
import SearchSubmitButton from './SearchSubmitButton.vue'
import LocationInput from './LocationInput.vue'
import { useSearchStore } from '@/stores/searchStore'
import { LOCATIONS, type Location } from '@/constants'
import { formatShortDate } from '@/utils/formatters'

interface PassengerCounts {
  adults: number
  children: number
}

export default {
  name: 'SearchWidget',
  components: {
    Calendar,
    PassengerSelector,
    SearchTypeToggle,
    TripTypeToggle,
    SearchSubmitButton,
    LocationInput
  },
  setup() {
    const searchStore = useSearchStore()
    return { searchStore }
  },
  data() {
    return {
      searchType: 'flights' as 'flights' | 'hotels' | 'cars' | 'activities' | 'cruises' | 'tours',
      tripType: 'round-trip' as 'one-way' | 'round-trip',
      location: '',
      destination: '',
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
      justExpanded: false,
      // Sample locations for typeahead
      allLocations: LOCATIONS
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    document.addEventListener('click', this.handleClickOutside)
    // Initialize from query params if on search page
    this.initializeFromQueryParams()
    // Minimize on search page by default
    if (this.isOnSearchPage) {
      this.isMinimized = true
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('click', this.handleClickOutside)
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
        return 'Update'
      }
      return 'Search'
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
        return formatShortDate(date)
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

      // Check if check-in date is selected
      if (!this.checkInDate) return true

      // Check-out date is only required for round-trip flights or hotels
      const requiresCheckOut = this.searchType === 'hotels' || (this.searchType === 'flights' && this.tripType === 'round-trip')
      if (requiresCheckOut && !this.checkOutDate) return true

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

      // Set trip type
      if (query.tripType) {
        this.tripType = query.tripType as 'one-way' | 'round-trip'
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
    onLocationSelect(location: Location) {
      this.selectedLocation = location
    },
    onDestinationSelect(location: Location) {
      this.selectedDestination = location
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
    handleClickOutside(event: MouseEvent) {
      // Only handle clicks when on search page and widget is expanded
      if (!this.isOnSearchPage || this.isMinimized) {
        return
      }

      // Prevent immediate re-minimization after expanding
      if (this.justExpanded) {
        return
      }

      // Check if the click is outside the search widget
      const target = event.target as HTMLElement
      const searchWidget = this.$el as HTMLElement

      // Check if click is inside modal container (for teleported elements like calendar, dropdowns)
      const modalContainer = document.getElementById('modal-container')
      if (modalContainer && modalContainer.contains(target)) {
        return
      }

      if (searchWidget && !searchWidget.contains(target)) {
        // Minimize the widget
        this.isMinimized = true
      }
    },
    handleEdit() {
      // Scroll to top with smooth behavior
      window.scrollTo({ top: 0, behavior: 'smooth' })

      // Unminimize the component
      this.isMinimized = false

      // Set flag to prevent immediate re-minimization
      this.justExpanded = true

      // Clear the flag after a short delay
      setTimeout(() => {
        this.justExpanded = false
      }, 100)
    },
    handleSubmit() {
      // Guard clause - should not be able to submit if button is disabled
      if (this.isSubmitDisabled) {
        return
      }

      const searchData = {
        searchType: this.searchType,
        tripType: this.searchType === 'flights' ? this.tripType : undefined,
        location: this.location,
        destination: this.searchType === 'flights' ? this.destination : undefined,
        checkIn: this.checkInDate!,
        checkOut: this.checkOutDate || this.checkInDate!,
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

      if (searchData.tripType) {
        query.tripType = searchData.tripType
      }

      if (searchData.checkIn) {
        query.checkIn = searchData.checkIn.toISOString()
      }

      if (searchData.checkOut && !(this.searchType === 'flights' && this.tripType === 'one-way')) {
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
      <!-- Four-column desktop layout -->
      <div class="search-grid">
        <!-- Column 1: Controls -->
        <div class="column-controls">
          <div class="controls-top-row">
            <SearchTypeToggle v-model="searchType" />
          </div>

          <div v-if="searchType === 'flights'" class="trip-type-wrapper">
            <PassengerSelector
              :adults="passengerCounts.adults"
              :children="passengerCounts.children"
              :search-type="searchType"
              @update:adults="passengerCounts.adults = $event"
              @update:children="passengerCounts.children = $event"
            />
            <TripTypeToggle v-model="tripType" />
          </div>
        </div>

        <!-- Column 2: Location Inputs -->
        <div class="column-locations">
          <!-- From/Location field -->
          <LocationInput
            v-model="location"
            :placeholder="locationLabel"
            :aria-label="locationLabel"
            :exclude-location="selectedDestination"
            @select="onLocationSelect"
          />

          <!-- To field (only for flights) -->
          <LocationInput
            v-if="showDestinationField"
            v-model="destination"
            placeholder="To"
            aria-label="To"
            :exclude-location="selectedLocation"
            @select="onDestinationSelect"
          />
        </div>

        <!-- Column 3: Date Inputs -->
        <div class="column-dates">
          <Calendar
            :initial-check-in="checkInDate"
            :initial-check-out="checkOutDate"
            :initial-check-in-flexibility="checkInFlexibility"
            :initial-check-out-flexibility="checkOutFlexibility"
            :is-one-way="searchType === 'flights' && tripType === 'one-way'"
            @date-range-selected="handleDateRangeSelected"
          />
        </div>

        <!-- Column 4: Submit Button -->
        <div class="column-submit">
          <SearchSubmitButton
            :disabled="isSubmitDisabled"
            :is-on-search-page="isOnSearchPage"
            @click="handleSubmit"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-widget {
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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

.search-grid {
  display: grid;
  grid-template-columns: auto minmax(100px, 1fr) minmax(280px, 1fr) auto;
  gap: 24px;
  align-items: start;

  @media (min-width: 769px) {
    align-items: center;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.column-controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: stretch;

  @media (min-width: 769px) {
    justify-content: flex-start;
    gap: 12px;
  }
}

.controls-top-row {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: flex-start;
  height: 40px;

  @media (max-width: $breakpoint-mobile) {
    gap: 8px;
    align-items: center;
    margin-top: -3.5rem;
    justify-content: center;
    height: auto;
  }
}

.trip-type-wrapper {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  justify-content: flex-start;

  @media (max-width: $breakpoint-mobile) {
    justify-content: center;
  }
}

.column-locations {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.column-dates {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.column-submit {
  display: flex;
  align-items: stretch;

  @media (max-width: 768px) {
    align-items: stretch;
  }
}

</style>
