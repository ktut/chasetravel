<script lang="ts">
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
    getStarsArray(count: number): number[] {
      return Array.from({ length: count }, (_, i) => i)
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
    clearFilters() {
      this.maxStops = 2
      this.selectedAirlines = []
      this.priceRange = [this.minPrice, this.maxPrice]
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
        const resultsHeader = this.$refs.resultsHeader as HTMLElement
        if (resultsHeader) {
          resultsHeader.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
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
        <div class="filters-actions">
          <button class="clear-filters-btn" @click="clearFilters">Clear</button>
          <button class="close-filters-btn" @click="closeMobileFilters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
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
        <div v-if="isFlights" class="sort-options">
          <label>Sort by:</label>
          <select v-model="sortBy" class="sort-select">
            <option value="price">Best Price</option>
            <option value="duration">Shortest Duration</option>
            <option value="departure">Departure Time</option>
          </select>
        </div>
      </div>

      <!-- Flight Results -->
      <div v-if="isFlights" class="flight-results">
        <!-- No results message -->
        <div v-if="filteredResults.length === 0 && !isLoading" class="no-results">
          <svg class="no-results-icon" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Island base -->
            <ellipse cx="60" cy="95" rx="45" ry="8" fill="#d0d0d0" opacity="0.5"/>

            <!-- Palm tree trunk -->
            <path d="M58 85 L58 75 Q59 65, 58 55 L58 45" stroke="#888" stroke-width="3" stroke-linecap="round"/>

            <!-- Coconuts -->
            <circle cx="56" cy="47" r="2.5" fill="#999"/>
            <circle cx="60" cy="47" r="2.5" fill="#999"/>

            <!-- Palm fronds -->
            <path d="M58 45 Q45 35, 35 30" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q40 40, 30 42" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q48 38, 38 38" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>

            <path d="M58 45 Q71 35, 81 30" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q76 40, 86 42" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q68 38, 78 38" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>

            <path d="M58 45 Q58 28, 58 22" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q54 32, 52 26" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q62 32, 64 26" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <h3>No flights found.</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>

        <TransitionGroup name="flight-list">
          <div v-for="flight in displayedResults as Flight[]" :key="flight.id" class="flight-card">
            <div class="flight-main">
              <div class="flight-info">
                <div class="airline">{{ flight.airline }}</div>
                <div class="flight-number">{{ flight.flightNumber }}</div>
              </div>

              <div class="flight-route">
                <div class="route-point">
                  <div class="time">{{ flight.departure.time }}</div>
                  <div class="airport">{{ flight.departure.airport }}</div>
                </div>

                <div class="route-visual">
                  <div class="route-line">
                    <div class="line"></div>
                  </div>
                  <div class="duration">{{ flight.duration }}</div>
                  <div class="stops" v-if="flight.stops > 0">{{ flight.stops }} stop{{ flight.stops > 1 ? 's' : '' }}</div>
                  <div class="nonstop" v-else>Nonstop</div>
                </div>

                <div class="route-point">
                  <div class="time">{{ flight.arrival.time }}</div>
                  <div class="airport">{{ flight.arrival.airport }}</div>
                </div>
              </div>

              <div class="flight-price">
                <button class="btn-primary select-btn">
                  {{ formatPrice(flight.price) }}
                </button>
              </div>
            </div>
          </div>
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
        <div v-if="filteredResults.length === 0 && !isLoading" class="no-results">
          <svg class="no-results-icon" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Island base -->
            <ellipse cx="60" cy="95" rx="45" ry="8" fill="#d0d0d0" opacity="0.5"/>

            <!-- Palm tree trunk -->
            <path d="M58 85 L58 75 Q59 65, 58 55 L58 45" stroke="#888" stroke-width="3" stroke-linecap="round"/>

            <!-- Coconuts -->
            <circle cx="56" cy="47" r="2.5" fill="#999"/>
            <circle cx="60" cy="47" r="2.5" fill="#999"/>

            <!-- Palm fronds -->
            <path d="M58 45 Q45 35, 35 30" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q40 40, 30 42" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q48 38, 38 38" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>

            <path d="M58 45 Q71 35, 81 30" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q76 40, 86 42" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q68 38, 78 38" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>

            <path d="M58 45 Q58 28, 58 22" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q54 32, 52 26" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M58 45 Q62 32, 64 26" stroke="#999" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <h3>No hotels found</h3>
          <p>Try adjusting your filters to see more results</p>
        </div>

        <TransitionGroup name="flight-list">
          <div v-for="hotel in displayedResults as Hotel[]" :key="hotel.id" class="hotel-card">
            <div class="hotel-image">
              <img :src="hotel.image" :alt="hotel.name" />
            </div>

            <div class="hotel-details">
              <div class="hotel-header">
                <div class="hotel-name">{{ hotel.name }}</div>
                <div class="hotel-stars">
                  <span v-for="star in getStarsArray(hotel.stars)" :key="star" class="star">★</span>
                </div>
              </div>

              <div class="hotel-location">{{ hotel.location }}</div>

              <div class="hotel-rating">
                <span class="rating-score">{{ hotel.rating }}</span>
                <span class="rating-reviews">({{ hotel.reviewCount }} reviews)</span>
              </div>

              <div class="hotel-amenities">
                <span v-for="amenity in hotel.amenities" :key="amenity" class="amenity">{{ amenity }}</span>
              </div>
            </div>

            <div class="hotel-price">
              <div class="price-label">Per night</div>
              <div class="price">{{ formatPrice(hotel.pricePerNight) }}</div>
              <button class="btn-primary select-btn">Select</button>
            </div>
          </div>
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
    padding: 0.5rem;
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
    top: 60px;
    z-index: 1;

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

    .filters-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .clear-filters-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      color: $color-accent;
      font-size: 0.95rem;
      font-weight: 600;
      font-family: $font-body;

      &:hover {
        color: $color-primary;
        text-decoration: underline;
      }
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

  .sort-options {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    label {
      font-size: 0.9rem;
      color: $color-text-light;
    }

    .sort-select {
      padding: 0.5rem 1rem;
      border: 1px solid $color-light-grey;
      border-radius: 4px;
      font-size: 0.9rem;
      background: white;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: $color-accent;
      }
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

.flight-card {
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 8px;
  padding: 0.75rem 1rem 0.65rem;
  transition: all 0.2s;
  cursor: pointer;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: $color-accent;
  }
}

.flight-main {
  display: grid;
  grid-template-columns: 140px 1fr 180px;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    position: relative;
  }
}

.flight-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  @media (max-width: 768px) {
    order: 1;
  }

  .airline {
    font-weight: 600;
    font-size: 1rem;
    color: $color-text;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  .flight-number {
    color: $color-text-light;
    font-size: 0.85rem;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }
}

.flight-route {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    order: 3;
    gap: 0.75rem;
  }
}

.route-point {
  text-align: center;

  .time {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: $color-text;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }

  .airport {
    color: $color-text-light;
    font-size: 0.85rem;
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }
}

.route-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-width: 140px;

  .route-line {
    width: 100%;
    position: relative;

    .line {
      height: 1px;
      background: $color-light-grey;
      position: relative;

      &::before, &::after {
        content: '';
        position: absolute;
        width: 5px;
        height: 5px;
        background: $color-text-light;
        border-radius: 50%;
        top: 50%;
        transform: translateY(-50%);
      }

      &::before {
        left: 0;
      }

      &::after {
        right: 0;
      }
    }
  }

  .duration {
    color: $color-text-light;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .stops {
    font-size: 0.75rem;
    color: $color-text-light;
    white-space: nowrap;
  }

  .nonstop {
    font-size: 0.75rem;
    color: #16a34a;
    font-weight: 600;
    white-space: nowrap;
  }
}

.flight-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: 0;
    order: 2;
  }

  .select-btn {
    padding: 0.75rem 1.5rem;
    white-space: nowrap;
    font-size: 1.5rem;
    font-weight: 700;

    @media (max-width: 768px) {
      padding: 0.5rem 0.75rem;
      font-size: 1.1rem;
    }
  }
}

/* No Results Message */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;

  .no-results-icon {
    width: 64px;
    height: 64px;
    color: $color-text-light;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: $color-text;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: $color-text-light;
    font-size: 1rem;
    margin: 0;
  }
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

.hotel-card {
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 8px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 260px 1fr 200px;
  transition: all 0.2s;
  cursor: pointer;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: $color-accent;
  }
}

.hotel-image {
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 200px;
    transition: transform 0.3s;
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.hotel-details {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (max-width: 968px) {
    padding: 1rem;
  }
}

.hotel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  .hotel-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: $color-text;
    line-height: 1.3;
  }

  .hotel-stars {
    color: #ffa500;
    flex-shrink: 0;

    .star {
      font-size: 0.9rem;
    }
  }
}

.hotel-location {
  color: $color-text-light;
  font-size: 0.9rem;
}

.hotel-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .rating-score {
    background: $color-accent;
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .rating-reviews {
    color: $color-text-light;
    font-size: 0.85rem;
  }
}

.hotel-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;

  .amenity {
    background: $color-bg-light;
    padding: 0.25rem 0.65rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: $color-text-light;
    border: 1px solid $color-light-grey;
  }
}

.hotel-price {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.5rem;
  background: $color-bg-light;
  border-left: 1px solid $color-light-grey;

  @media (max-width: 968px) {
    align-items: stretch;
    border-left: none;
    border-top: 1px solid $color-light-grey;
    padding: 1rem;
  }

  .price-label {
    color: $color-text-light;
    font-size: 0.85rem;
  }

  .price {
    font-size: 1.75rem;
    font-weight: 700;
    color: $color-text;
  }

  .select-btn {
    padding: 0.75rem 1.5rem;
    margin-top: 0.5rem;
    white-space: nowrap;
    font-size: 0.95rem;
  }
}
</style>
