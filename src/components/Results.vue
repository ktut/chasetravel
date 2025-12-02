<script lang="ts">
import NoResults from './NoResults.vue'
import FlightCard from './FlightCard.vue'
import SortOptions from './SortOptions.vue'
import HotelCard from './HotelCard.vue'
import HotelMap from './HotelMap.vue'
import type { Flight, Hotel } from '@/types/search'
import { formatPrice } from '@/utils/formatters'

export default {
  name: 'Results',
  components: {
    NoResults,
    FlightCard,
    SortOptions,
    HotelCard,
    HotelMap
  },
  props: {
    results: {
      type: Array as () => Flight[] | Hotel[],
      required: true
    },
    searchType: {
      type: String as () => 'flights' | 'hotels',
      required: true
    },
    searchData: {
      type: Object as () => any,
      default: null
    }
  },
  data() {
    return {
      // Filters
      maxStops: 2,
      priceRange: [0, 10000] as [number, number],
      selectedAirlines: [] as string[],
      selectedAmenities: [] as string[],
      sortBy: 'price' as 'price' | 'duration' | 'departure',

      // Progressive loading
      displayedResults: [] as (Flight | Hotel)[],
      loadingBatchSize: 3,
      isLoading: false,

      // Filters visibility
      showFilters: false,

      // Map visibility
      showMap: false
    }
  },
  computed: {
    isFlights(): boolean {
      return this.searchType === 'flights'
    },
    isHotels(): boolean {
      return this.searchType === 'hotels'
    },
    allAirlines(): string[] {
      if (!this.isFlights) return []
      const isRoundTrip = this.searchData?.tripType === 'round-trip'

      if (isRoundTrip) {
        const pairs = this.results as any[]
        return [...new Set(pairs.map(p => p.outbound.airline))].sort()
      } else {
        const flights = this.results as Flight[]
        return [...new Set(flights.map(f => f.airline))].sort()
      }
    },
    allAmenities(): string[] {
      if (!this.isHotels) return []
      const hotels = this.results as Hotel[]
      return [...new Set(hotels.flatMap(h => h.amenities))].sort()
    },
    minPrice(): number {
      if (this.results.length === 0) return 0
      const isRoundTrip = this.isFlights && this.searchData?.tripType === 'round-trip'
      if (isRoundTrip) {
        return Math.min(...this.results.map((r: any) => r.totalPrice))
      }
      return Math.min(...this.results.map((r: any) => r.price || r.pricePerNight))
    },
    maxPrice(): number {
      if (this.results.length === 0) return 10000
      const isRoundTrip = this.isFlights && this.searchData?.tripType === 'round-trip'
      if (isRoundTrip) {
        return Math.max(...this.results.map((r: any) => r.totalPrice))
      }
      return Math.max(...this.results.map((r: any) => r.price || r.pricePerNight))
    },
    filteredResults(): (Flight | Hotel)[] {
      let filtered = [...this.results]

      if (this.isFlights) {
        const isRoundTrip = this.searchData?.tripType === 'round-trip'

        if (isRoundTrip) {
          // Handle FlightPair filtering
          const pairs = filtered as any[]

          // Filter by stops (check outbound flight)
          filtered = pairs.filter(p => p.outbound.stops <= this.maxStops)

          // Filter by airlines (check outbound flight)
          if (this.selectedAirlines.length > 0) {
            filtered = filtered.filter((p: any) =>
              this.selectedAirlines.includes(p.outbound.airline)
            )
          }

          // Filter by price (use totalPrice)
          filtered = filtered.filter((p: any) =>
            p.totalPrice >= this.priceRange[0] && p.totalPrice <= this.priceRange[1]
          )

          // Sort
          if (this.sortBy === 'price') {
            filtered.sort((a: any, b: any) => a.totalPrice - b.totalPrice)
          } else if (this.sortBy === 'duration') {
            filtered.sort((a: any, b: any) => {
              const aDur = this.parseDuration(a.outbound.duration)
              const bDur = this.parseDuration(b.outbound.duration)
              return aDur - bDur
            })
          } else if (this.sortBy === 'departure') {
            filtered.sort((a: any, b: any) => {
              return a.outbound.departure.time.localeCompare(b.outbound.departure.time)
            })
          }
        } else {
          // Handle Flight filtering (one-way)
          const flights = filtered as Flight[]

          // Filter by stops
          filtered = flights.filter(f => f.stops <= this.maxStops)

          // Filter by airlines
          if (this.selectedAirlines.length > 0) {
            filtered = filtered.filter((f: any) =>
              this.selectedAirlines.includes(f.airline)
            )
          }

          // Filter by price
          filtered = filtered.filter((f: any) =>
            f.price >= this.priceRange[0] && f.price <= this.priceRange[1]
          )

          // Sort
          if (this.sortBy === 'price') {
            filtered.sort((a: any, b: any) => a.price - b.price)
          } else if (this.sortBy === 'duration') {
            filtered.sort((a: any, b: any) => {
              const aDur = this.parseDuration(a.duration)
              const bDur = this.parseDuration(b.duration)
              return aDur - bDur
            })
          } else if (this.sortBy === 'departure') {
            filtered.sort((a: any, b: any) => {
              return a.departure.time.localeCompare(b.departure.time)
            })
          }
        }
      } else if (this.isHotels) {
        const hotels = filtered as Hotel[]

        // Filter by price per night
        filtered = hotels.filter((h: any) =>
          h.pricePerNight >= this.priceRange[0] && h.pricePerNight <= this.priceRange[1]
        )

        // Filter by amenities
        if (this.selectedAmenities.length > 0) {
          filtered = filtered.filter((h: any) =>
            this.selectedAmenities.every(amenity => h.amenities.includes(amenity))
          )
        }
      }

      return filtered
    },
    isFiltering(): boolean {
      if (this.isFlights) {
        // Check if any filters are applied
        const hasStopsFilter = this.maxStops < 2
        const hasAirlineFilter = this.selectedAirlines.length > 0
        const hasPriceFilter = this.priceRange[1] < this.maxPrice || this.priceRange[0] > this.minPrice
        return hasStopsFilter || hasAirlineFilter || hasPriceFilter
      } else if (this.isHotels) {
        // Check if price or amenity filters are applied
        const hasPriceFilter = this.priceRange[1] < this.maxPrice || this.priceRange[0] > this.minPrice
        const hasAmenityFilter = this.selectedAmenities.length > 0
        return hasPriceFilter || hasAmenityFilter
      }
      return false
    },
    activeFiltersCount(): number {
      let count = 0
      if (this.isFlights) {
        // Count each active filter
        if (this.maxStops < 2) count++
        if (this.selectedAirlines.length > 0) count++
        if (this.priceRange[1] < this.maxPrice || this.priceRange[0] > this.minPrice) count++
      } else if (this.isHotels) {
        // Count price and amenity filters if active
        if (this.priceRange[1] < this.maxPrice || this.priceRange[0] > this.minPrice) count++
        if (this.selectedAmenities.length > 0) count++
      }
      return count
    },
    resultsCountText(): string {
      const count = this.filteredResults.length
      const total = this.results.length
      const itemType = this.isFlights ? 'flight' : 'propert'
      const itemTypePlural = this.isFlights ? 'flights' : 'properties'

      if (this.isFiltering && count !== total) {
        return `${count} of ${total} ${count === 1 ? itemType + 'y' : itemTypePlural} (filtered)`
      }

      return `${count} ${count === 1 ? itemType + 'y' : itemTypePlural} found`
    }
  },
  watch: {
    results: {
      handler() {
        // Reset price range when results change
        if (this.results.length > 0) {
          this.priceRange = [this.minPrice, this.maxPrice]
        }
      },
      immediate: true
    },
    filteredResults: {
      handler(newResults) {
        this.loadResultsProgressively(newResults)
      },
      immediate: true
    }
  },
  beforeUnmount() {
    // Ensure body scroll is restored when component is destroyed
    document.body.style.overflow = ''
  },
  methods: {
    formatPrice,
    parseDuration(duration: string): number {
      const match = duration.match(/(\d+)h\s*(\d+)m/)
      if (!match) return 0
      return parseInt(match[1]) * 60 + parseInt(match[2])
    },
    toggleAirline(airline: string) {
      const index = this.selectedAirlines.indexOf(airline)
      if (index > -1) {
        this.selectedAirlines.splice(index, 1)
      } else {
        this.selectedAirlines.push(airline)
      }
    },
    toggleAmenity(amenity: string) {
      const index = this.selectedAmenities.indexOf(amenity)
      if (index > -1) {
        this.selectedAmenities.splice(index, 1)
      } else {
        this.selectedAmenities.push(amenity)
      }
    },
    toggleFilters() {
      this.showFilters = !this.showFilters

      // If opening filters on mobile, scroll to top and prevent body scroll
      if (this.showFilters) {
        this.$nextTick(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        })
        // Prevent body scroll on mobile
        if (window.innerWidth <= 968) {
          document.body.style.overflow = 'hidden'
        }
      } else {
        // Re-enable body scroll
        document.body.style.overflow = ''
      }
    },
    toggleMap() {
      this.showMap = !this.showMap
    },
    loadResultsProgressively(results: (Flight | Hotel)[]) {
      this.displayedResults = []
      this.isLoading = true

      const loadBatch = (startIndex: number) => {
        const endIndex = Math.min(startIndex + this.loadingBatchSize, results.length)

        for (let i = startIndex; i < endIndex; i++) {
          setTimeout(() => {
            this.displayedResults.push(results[i])
          }, (i - startIndex) * 150) // Stagger animation
        }

        if (endIndex < results.length) {
          setTimeout(() => loadBatch(endIndex), this.loadingBatchSize * 150 + 100)
        } else {
          setTimeout(() => {
            this.isLoading = false
          }, this.loadingBatchSize * 150)
        }
      }

      loadBatch(0)
    }
  }
}
</script>

<template>
  <div class="results-wrapper" :class="{ 'map-open': showMap && isHotels }">
    <!-- Filter Toggle Button (Sticky on both mobile and desktop when map is open) -->
    <div class="mobile-filter-toggle-container">
      <button class="mobile-filter-toggle" @click="toggleFilters" ref="filterToggle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="6" x2="20" y2="6"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="18" x2="20" y2="18"></line>
        </svg>
        <span>{{ showFilters ? 'Hide Filters' : 'Show Filters' }}</span>
        <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
      </button>
    </div>

    <!-- Filters Sidebar -->
    <aside class="filters-sidebar" :class="{ 'filters-visible': showFilters }">
      <div class="filters-header">
        <h3>Filters</h3>
      </div>

      <!-- Flight-specific filters -->
      <div v-if="isFlights" class="filter-sections">
        <!-- Stops Filter -->
        <div class="filter-section">
          <h4>Stops</h4>
          <div class="filter-options">
            <label class="filter-option">
              <input type="radio" v-model="maxStops" :value="0" name="stops" />
              <span>Nonstop only</span>
            </label>
            <label class="filter-option">
              <input type="radio" v-model="maxStops" :value="1" name="stops" />
              <span>1 stop or fewer</span>
            </label>
            <label class="filter-option">
              <input type="radio" v-model="maxStops" :value="2" name="stops" />
              <span>2 stops or fewer</span>
            </label>
          </div>
        </div>

        <!-- Airlines Filter -->
        <div class="filter-section">
          <h4>Airlines</h4>
          <div class="filter-options">
            <label v-for="airline in allAirlines" :key="airline" class="filter-option">
              <input
                type="checkbox"
                :checked="selectedAirlines.includes(airline)"
                @change="toggleAirline(airline)"
              />
              <span>{{ airline }}</span>
            </label>
          </div>
        </div>

        <!-- Price Filter -->
        <div class="filter-section">
          <h4>Price Range</h4>
          <div class="price-range-display">
            <span>{{ formatPrice(priceRange[0]) }}</span>
            <span>-</span>
            <span>{{ formatPrice(priceRange[1]) }}</span>
          </div>
          <input
            type="range"
            v-model="priceRange[1]"
            :min="minPrice"
            :max="maxPrice"
            class="price-slider"
          />
        </div>
      </div>

      <!-- Hotel-specific filters -->
      <div v-if="isHotels" class="filter-sections">
        <!-- Price Filter -->
        <div class="filter-section">
          <h4>Price per night</h4>
          <div class="price-range-display">
            <span>{{ formatPrice(priceRange[0]) }}</span>
            <span>-</span>
            <span>{{ formatPrice(priceRange[1]) }}</span>
          </div>
          <input
            type="range"
            v-model="priceRange[1]"
            :min="minPrice"
            :max="maxPrice"
            class="price-slider"
          />
        </div>

        <!-- Amenities Filter -->
        <div class="filter-section">
          <h4>Amenities</h4>
          <div class="filter-options">
            <label v-for="amenity in allAmenities" :key="amenity" class="filter-option">
              <input
                type="checkbox"
                :checked="selectedAmenities.includes(amenity)"
                @change="toggleAmenity(amenity)"
              />
              <span>{{ amenity }}</span>
            </label>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Results Area -->
    <main class="results-main">
      <div ref="resultsHeader" class="results-header">
        <div class="results-info">
          <h2>{{ isFlights ? 'Choose a departing flight' : 'Available Hotels' }}</h2>
          <p class="results-count">{{ resultsCountText }}</p>
        </div>

        <!-- Sort Options (for flights) -->
        <SortOptions v-if="isFlights" v-model="sortBy" />
      </div>

      <!-- Flight Results -->
      <div v-if="isFlights" class="flight-results">
        <!-- No results message -->
        <NoResults v-if="filteredResults.length === 0 && !isLoading" :searchType="searchType" />

        <TransitionGroup name="flight-list">
          <FlightCard
            v-for="result in displayedResults"
            :key="result.id"
            :flight="searchData?.tripType !== 'round-trip' ? result as any : null"
            :flightPair="searchData?.tripType === 'round-trip' ? result as any : null"
            :searchData="searchData"
          />
        </TransitionGroup>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
          <p>Loading more results...</p>
        </div>
      </div>

      <!-- Hotel Results -->
      <div v-if="isHotels" class="hotel-results">
        <!-- No results message -->
        <NoResults v-if="filteredResults.length === 0 && !isLoading" :searchType="searchType" />

        <TransitionGroup name="flight-list">
          <HotelCard
            v-for="hotel in displayedResults as Hotel[]"
            :key="hotel.id"
            :hotel="hotel"
            :search-data="searchData"
            :class="{ 'compact-view': showMap }"
          />
        </TransitionGroup>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
          <p>Loading more results...</p>
        </div>
      </div>
    </main>

    <!-- Map Section (Hotels only, Desktop only) -->
    <aside v-if="isHotels && showMap" class="map-section">
      <HotelMap :hotels="filteredResults as Hotel[]" :search-data="searchData" />
    </aside>

    <!-- Map Toggle Button (Fixed position, for hotels) -->
    <button v-if="isHotels" @click="toggleMap" class="map-toggle-btn">
      <svg v-if="!showMap" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
        <line x1="8" y1="2" x2="8" y2="18"></line>
        <line x1="16" y1="6" x2="16" y2="22"></line>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <span>{{ showMap ? 'Hide Map' : 'Show Map' }}</span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/global.scss' as *;

.results-wrapper {
  display: grid;
  grid-template-columns: minmax(190px, 280px) 1fr;
  grid-template-areas:
    "filters results";
  gap: 2rem;
  max-width: 1400px;
  padding: 3rem 2rem 2rem;
  margin: 0 auto;
  position: relative;
  transition: grid-template-columns 0.3s ease, max-width 0.3s ease;

  // 3-column layout when map is open
  &.map-open {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "results map";
    max-width: 1800px;
    gap: 0 2rem;
    padding-top: 6rem;
  }

  @media (max-width: 968px) {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: unset;
  }
}

.mobile-filter-toggle-container {
  display: none;

  // Show on mobile always
  @media (max-width: 968px) {
    display: block;
    padding: 0.5rem 1rem 0;
    background: white;
    position: sticky;
    top: 153px;
    z-index: 10;

    // White pseudo-element to cover gap above while scrolling
    &::before {
      content: '';
      position: absolute;
      top: -60px;
      left: 0;
      right: 0;
      height: 60px;
      background: white;
      z-index: -1;
    }
  }

  // Show on desktop when map is open - positioned fixed at top
  .map-open & {
    display: flex;
    justify-content: center;
    padding: 0.5rem 2rem 0.75rem;
    background: white;
    position: fixed;
    top: 9rem;
    left: 0;
    right: 0;
    z-index: 25;
    border-bottom: 1px solid $color-light-grey;

    @media (max-width: 968px) {
      position: sticky;
      padding: 0.5rem 1rem 0;
      top: 210px;
      z-index: 10;
      border-bottom: none;
    }
  }
}

/* Mobile Filter Toggle Button */
.mobile-filter-toggle {
  display: none;

  // Show on mobile always
  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid $color-light-grey;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    color: $color-text;
    width: 100%;
    margin-bottom: 0.5rem;

    svg {
      width: 20px;
      height: 20px;
      color: $color-text-light;
    }

    &:hover {
      background: $color-bg-light;
      border-color: $color-accent;
    }

    .filter-badge {
      margin-left: auto;
      background: $color-accent;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }
  }

  // Show on desktop when map is open
  .map-open & {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: white;
    border: 1px solid $color-light-grey;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 600;
    color: $color-text;
    width: 100%;
    max-width: 1334px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    svg {
      width: 20px;
      height: 20px;
      color: $color-text-light;
    }

    &:hover {
      background: $color-bg-light;
      border-color: $color-accent;
    }

    .filter-badge {
      margin-left: auto;
      background: $color-accent;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    @media (max-width: 968px) {
      padding: 0.75rem 1rem;
      border: 1px solid $color-light-grey;
      border-radius: 8px;
    }
  }
}

/* Filters Sidebar */
.filters-sidebar {
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 9rem;
  grid-area: filters;

  // When map is open, filters are collapsible below fixed toggle button
  .map-open & {
    position: fixed;
    top: calc(9rem + 3.5rem);
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 4rem);
    max-width: 1334px;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    padding: 0;
    border: none;
    transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
    margin: 0;
    z-index: 35;

    &.filters-visible {
      max-height: calc(100vh - 13rem);
      overflow-y: auto;
      opacity: 1;
      padding: 1.5rem;
      border: 1px solid $color-light-grey;
      border-radius: 8px;
    }
  }

  @media (max-width: 968px) {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    padding: 0;
    border: none;
    transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
    position: sticky;
    top: 210px;
    z-index: 9;

    &.filters-visible {
      max-height: 60vh;
      overflow-y: auto;
      box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.5);
      opacity: 1;
      padding: 0 1.5rem 1.5rem;
      margin-bottom: 1rem;
      border: 1px solid $color-light-grey;
      border-radius: 8px;
    }
  }

  .filters-header {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      color: $color-text;
    }
  }

  .filter-sections {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .filter-section {
    border-bottom: 1px solid $color-light-grey;
    padding-bottom: 1.5rem;

    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: $color-text;
    }
  }

  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: $color-text;

    input[type="radio"],
    input[type="checkbox"] {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: $color-accent;
    }
  }

  .price-range-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    color: $color-text-light;
  }

  .price-slider {
    width: 100%;
    cursor: pointer;
  }
}

/* Main Results Area */
.results-main {
  grid-area: results;
  min-height: 500px;
  padding: 0 2rem 2rem;

  .map-open & {
    padding: 0 1rem 2rem 0;
  }

  @media (max-width: 968px) {
    padding: 1rem;
  }
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .results-info {
    h2 {
      @include heading-font;
      margin: 0 0 0.25rem 0;
      color: $color-text;
    }

    .results-count {
      color: $color-text-light;
      font-size: 0.9rem;
      margin: 0;
    }
  }
}

.map-open {
  .map-toggle-btn {
    top: 7rem;
    right: 3rem;
  }
}
.map-toggle-btn {
  position: absolute;
  top: 3rem;
  right: 4rem;
  z-index: 26;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: $color-text;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  svg {
    width: 20px;
    height: 20px;
    color: $color-accent;
  }

  &:hover {
    background: $color-bg-light;
    border-color: $color-accent;
    color: $color-accent;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 968px) {
    display: none;
  }
}

/* Transition Animations */
.flight-list-move,
.flight-list-enter-active,
.flight-list-leave-active {
  transition: all 0.3s ease;
}

.flight-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.flight-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.flight-list-leave-active {
  position: absolute;
  width: 100%;
}

/* Flight Results Styles */
.flight-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
}

/* Loading Indicator */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid $color-light-grey;
    border-top-color: $color-accent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  p {
    color: $color-text-light;
    font-size: 0.9rem;
    margin: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Hotel Results Styles */
.hotel-results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;

  // Compact view for hotel cards when map is shown - keep normal desktop layout
  :deep(.compact-view) {
    // No layout changes needed - cards will naturally be narrower due to column width
  }
}

/* Map Section */
.map-section {
  grid-area: map;
  animation: slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 968px) {
    display: none;
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
