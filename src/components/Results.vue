<script lang="ts">
import NoResults from './NoResults.vue'
import FlightCard from './FlightCard.vue'
import SortOptions from './SortOptions.vue'
import HotelCard from './HotelCard.vue'

interface Flight {
  id: number
  airline: string
  flightNumber: string
  departure: {
    airport: string
    time: string
  }
  arrival: {
    airport: string
    time: string
  }
  duration: string
  price: number
  stops: number
}

interface Hotel {
  id: number
  name: string
  location: string
  stars: number
  rating: number
  reviewCount: number
  pricePerNight: number
  image: string
  amenities: string[]
}

export default {
  name: 'Results',
  components: {
    NoResults,
    FlightCard,
    SortOptions,
    HotelCard
  },
  props: {
    results: {
      type: Array as () => Flight[] | Hotel[],
      required: true
    },
    searchType: {
      type: String as () => 'flights' | 'hotels',
      required: true
    }
  },
  data() {
    return {
      // Filters
      maxStops: 2,
      priceRange: [0, 10000] as [number, number],
      selectedAirlines: [] as string[],
      sortBy: 'price' as 'price' | 'duration' | 'departure',

      // Progressive loading
      displayedResults: [] as (Flight | Hotel)[],
      loadingBatchSize: 3,
      isLoading: false,

      // Mobile filters
      showMobileFilters: false
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
      const flights = this.results as Flight[]
      return [...new Set(flights.map(f => f.airline))].sort()
    },
    minPrice(): number {
      if (this.results.length === 0) return 0
      return Math.min(...this.results.map((r: any) => r.price || r.pricePerNight))
    },
    maxPrice(): number {
      if (this.results.length === 0) return 10000
      return Math.max(...this.results.map((r: any) => r.price || r.pricePerNight))
    },
    filteredResults(): (Flight | Hotel)[] {
      let filtered = [...this.results]

      if (this.isFlights) {
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
      } else if (this.isHotels) {
        const hotels = filtered as Hotel[]

        // Filter by price per night
        filtered = hotels.filter((h: any) =>
          h.pricePerNight >= this.priceRange[0] && h.pricePerNight <= this.priceRange[1]
        )
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
        // Check if price filter is applied
        return this.priceRange[1] < this.maxPrice || this.priceRange[0] > this.minPrice
      }
      return false
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
  methods: {
    formatPrice(price: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(price)
    },
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
    openMobileFilters() {
      this.showMobileFilters = true
      // Scroll the filter toggle button to the top
      this.$nextTick(() => {
        const filterToggle = this.$refs.filterToggle as HTMLElement
        if (filterToggle) {
          filterToggle.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    },
    closeMobileFilters() {
      this.showMobileFilters = false
      // Scroll to the top of results
      this.$nextTick(() => {
        window.scroll({ top: -1, left: 0, behavior: "smooth" });
      })
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
  <div class="results-wrapper">
    <!-- Mobile Backdrop -->
    <div
      v-if="showMobileFilters"
      class="mobile-backdrop"
      @click="closeMobileFilters"
    ></div>

    <!-- Mobile Filter Toggle Button -->
    <button class="mobile-filter-toggle" @click="openMobileFilters">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="6" x2="20" y2="6"></line>
        <line x1="4" y1="12" x2="20" y2="12"></line>
        <line x1="4" y1="18" x2="20" y2="18"></line>
      </svg>
      <span>{{ showMobileFilters ? 'Hide Filters' : 'Show Filters' }}</span>
      <span v-if="isFiltering" class="filter-badge">{{ filteredResults.length }}</span>
    </button>

    <!-- Filters Sidebar -->
    <aside class="filters-sidebar" :class="{ 'mobile-visible': showMobileFilters }" ref="filterToggle">
      <div class="filters-header">
        <h3>Filters</h3>
        <button class="close-filters-btn" @click="closeMobileFilters">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
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

      <!-- Hotel-specific filters can be added here -->
      <div v-if="isHotels" class="filter-sections">
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
          <FlightCard v-for="flight in displayedResults as Flight[]" :key="flight.id" :flight="flight" />
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
          <HotelCard v-for="hotel in displayedResults as Hotel[]" :key="hotel.id" :hotel="hotel" />
        </TransitionGroup>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="loading-indicator">
          <div class="spinner"></div>
          <p>Loading more results...</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.results-wrapper {
  display: grid;
  grid-template-columns: minmax(190px, 280px) 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    padding: 0.5rem 1rem;
    gap: 0;
  }
}

/* Mobile Backdrop */
.mobile-backdrop {
  display: none;

  @media (max-width: 968px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
}

/* Mobile Filter Toggle Button */
.mobile-filter-toggle {
  display: none;

  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: white;
    border: 1px solid $color-light-grey;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: $color-text;
    position: sticky;
    top: 134px;
    z-index: 100;

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
}

/* Filters Sidebar */
.filters-sidebar {
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 8px;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;

  @media (max-width: 968px) {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    max-width: 400px;
    z-index: 1001;
    border: none;
    border-radius: 0;
    overflow-y: auto;
    transform: translateX(-150%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    scroll-margin-top: 70px;

    &.mobile-visible {
      transform: translateX(0);
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

    .close-filters-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      color: $color-text-light;

      @media (max-width: 968px) {
        display: block;
      }

      svg {
        width: 24px;
        height: 24px;
      }

      &:hover {
        color: $color-text;
      }
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
  min-height: 500px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .results-info {
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
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
}
</style>
