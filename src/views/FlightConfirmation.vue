<script lang="ts">
import { useSearchStore } from '@/stores/searchStore'

export default {
  name: 'FlightConfirmation',
  data() {
    return {
      usePoints: false,
      pointsToRedeem: 0,
      pointsValue: 0.0125, // Each point is worth $0.0125
      localSearchData: null as any,
      localFlight: null as any,
      selectedFareType: 'basic', // 'basic', 'economy', or 'business'
      expandedFare: 'basic' // which fare is currently expanded
    }
  },
  computed: {
    searchStore() {
      return useSearchStore()
    },
    flight() {
      return this.localFlight
    },
    searchData() {
      return this.localSearchData
    },
    pointsBalance() {
      return this.searchStore.pointsBalance
    },
    formattedPointsBalance(): string {
      return this.pointsBalance.toLocaleString('en-US')
    },
    maxPointsRedeemable(): number {
      if (!this.flight) return 0
      const maxFromPrice = Math.floor(this.currentFarePrice / this.pointsValue)
      return Math.min(maxFromPrice, this.pointsBalance)
    },
    dollarsFromPoints(): number {
      return this.pointsToRedeem * this.pointsValue
    },
    balanceDue(): number {
      if (!this.flight) return 0
      if (!this.usePoints) return this.currentFarePrice
      return Math.max(0, this.currentFarePrice - this.dollarsFromPoints)
    },
    remainingPoints(): number {
      if (!this.usePoints) return this.pointsBalance
      return this.pointsBalance - this.pointsToRedeem
    },
    outboundDate(): string {
      if (!this.searchData?.checkIn) return ''
      const date = new Date(this.searchData.checkIn)
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    },
    returnDate(): string {
      if (!this.searchData?.checkOut) return ''
      const date = new Date(this.searchData.checkOut)
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    },
    travelersText(): string {
      if (!this.searchData?.passengers) return '1 Traveler'
      const total = this.searchData.passengers.total
      return `${total} Traveler${total > 1 ? 's' : ''}`
    },
    routeText(): string {
      if (!this.searchData?.location || !this.searchData?.destination) return ''
      return `${this.searchData.location} to ${this.searchData.destination}`
    },
    tripType(): string {
      return 'Round-trip'
    },
    currentFarePrice(): number {
      if (!this.flight) return 0
      switch (this.selectedFareType) {
        case 'basic':
          return this.flight.price
        case 'economy':
          return this.flight.price + 75
        case 'business':
          return this.flight.price + 450
        default:
          return this.flight.price
      }
    }
  },
  watch: {
    usePoints(newValue) {
      if (!newValue) {
        this.pointsToRedeem = 0
      }
    }
  },
  mounted() {
    console.log('=== FlightConfirmation.mounted CALLED ===')
    console.log('Current route:', this.$route.path)

    // Get flight and search data from sessionStorage
    const flightData = sessionStorage.getItem('selectedFlight')
    const searchData = sessionStorage.getItem('confirmationSearchData')

    console.log('FlightData in sessionStorage:', flightData ? 'EXISTS' : 'NULL')
    console.log('SearchData in sessionStorage:', searchData ? 'EXISTS' : 'NULL')

    if (flightData) {
      try {
        this.localFlight = JSON.parse(flightData)
        console.log('Flight loaded from sessionStorage:', this.localFlight)
      } catch (e) {
        console.error('Error parsing flight data:', e)
      }
    } else {
      console.error('❌ NO FLIGHT DATA IN SESSIONSTORAGE')
    }

    if (searchData) {
      try {
        this.localSearchData = JSON.parse(searchData)
        console.log('Search data loaded from sessionStorage:', this.localSearchData)
      } catch (e) {
        console.error('Error parsing search data:', e)
      }
    } else {
      console.warn('No search data in sessionStorage')
    }

    // Redirect if no flight data
    if (!this.localFlight) {
      console.error('❌ NO FLIGHT DATA - REDIRECTING BACK')
      this.$router.back()
    } else {
      console.log('✓ Flight data loaded successfully')
      // Clear sessionStorage after successfully loading the data
      // This prevents it from being used again if user navigates away and comes back
      setTimeout(() => {
        sessionStorage.removeItem('selectedFlight')
        sessionStorage.removeItem('confirmationSearchData')
        console.log('SessionStorage cleared')
      }, 100)
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
    goBack() {
      this.$router.back()
    },
    proceedToBook() {
      // This would normally proceed to actual booking
      alert('Booking functionality would be implemented here')
    },
    selectFare(fareType: string) {
      if (this.expandedFare === fareType) {
        // If clicking the already expanded fare, just select it
        this.selectedFareType = fareType
      } else {
        // Expand the clicked fare and collapse others
        this.expandedFare = fareType
        this.selectedFareType = fareType
      }
    }
  }
}
</script>

<template>
  <div class="confirmation-page" v-if="flight">
    <div class="confirmation-container">
      <!-- Back Button -->
      <button @click="goBack" class="back-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to results
      </button>

      <!-- Header Section -->
      <div class="confirmation-header">
        <div class="route-info">
          <h1>{{ routeText }}</h1>
          <p class="trip-details">{{ tripType }}, {{ travelersText }}</p>
        </div>
        <div class="price-display">
          <span class="price">{{ formatPrice(currentFarePrice) }}</span>
        </div>
      </div>

      <!-- Step 1: Choose a fare -->
      <section class="step-section">
        <h2>Step 1: Choose a fare</h2>
        <p class="step-disclaimer">
          <a href="#" class="disclaimer-link">See baggage size and weight limit.</a>
          Total prices may include estimated baggage fees and flexibility. Some options may require added baggage or flexibility when checking out. Check terms and conditions on the booking site.
        </p>

        <div class="fare-options">
          <!-- Basic Economy -->
          <div
            class="fare-card"
            :class="{
              selected: selectedFareType === 'basic',
              expanded: expandedFare === 'basic',
              collapsed: expandedFare !== 'basic'
            }"
            @click="selectFare('basic')"
          >
            <div class="fare-header">
              <h3>Basic Economy</h3>
              <div class="fare-price">{{ formatPrice(flight.price) }}</div>
            </div>
            <ul class="fare-features" v-if="expandedFare === 'basic'">
              <li class="feature-negative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
                No carry-on bags
              </li>
              <li class="feature-negative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4m0 4h.01"/>
                </svg>
                Checked bag for a fee
              </li>
              <li class="feature-negative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4m0 4h.01"/>
                </svg>
                Seat selection for a fee
              </li>
            </ul>
          </div>

          <!-- Regular Economy -->
          <div
            class="fare-card"
            :class="{
              selected: selectedFareType === 'economy',
              expanded: expandedFare === 'economy',
              collapsed: expandedFare !== 'economy'
            }"
            @click="selectFare('economy')"
          >
            <div class="fare-header">
              <h3>Economy</h3>
              <div class="fare-price">{{ formatPrice(flight.price + 75) }}</div>
            </div>
            <ul class="fare-features" v-if="expandedFare === 'economy'">
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                1 carry-on bag included
              </li>
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                1 checked bag included
              </li>
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                Free seat selection
              </li>
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                Changes allowed for a fee
              </li>
            </ul>
          </div>

          <!-- Business Class -->
          <div
            class="fare-card"
            :class="{
              selected: selectedFareType === 'business',
              expanded: expandedFare === 'business',
              collapsed: expandedFare !== 'business'
            }"
            @click="selectFare('business')"
          >
            <div class="fare-header">
              <h3>Business</h3>
              <div class="fare-price">{{ formatPrice(flight.price + 450) }}</div>
            </div>
            <ul class="fare-features" v-if="expandedFare === 'business'">
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                2 carry-on bags included
              </li>
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                2 checked bags included
              </li>
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                Priority seat selection
              </li>
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                Free changes & cancellation
              </li>
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                Priority boarding
              </li>
              <li class="feature-positive">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                Lounge access
              </li>
            </ul>
          </div>
        </div>

        <p class="fare-note">Fare and baggage fees apply to the entire trip</p>
      </section>

      <!-- Step 2: Use your rewards -->
      <section class="step-section">
        <h2>Step 2: Use your rewards</h2>
        <p class="step-description">
          Apply your Chase Ultimate Rewards points to reduce the cost of your flight.
        </p>

        <div class="rewards-options">
          <!-- Option 1: Don't use points -->
          <label class="rewards-option" :class="{ selected: !usePoints }">
            <input type="radio" :value="false" v-model="usePoints" name="rewards" />
            <div class="option-content">
              <div class="option-header">
                <span class="option-title">Pay full amount</span>
                <span class="option-price">{{ formatPrice(currentFarePrice) }}</span>
              </div>
              <p class="option-description">Keep your {{ formattedPointsBalance }} points for later</p>
            </div>
          </label>

          <!-- Option 2: Use points -->
          <label class="rewards-option" :class="{ selected: usePoints }">
            <input type="radio" :value="true" v-model="usePoints" name="rewards" />
            <div class="option-content">
              <div class="option-header">
                <span class="option-title">Redeem points</span>
                <span class="option-price">Use your rewards</span>
              </div>
              <p class="option-description">You have {{ formattedPointsBalance }} points available</p>
            </div>
          </label>

          <!-- Points redemption details (shown when usePoints is true) -->
          <div v-if="usePoints" class="points-redemption">
            <div class="redemption-input">
              <label for="pointsInput">Points to redeem</label>
              <input
                id="pointsInput"
                type="number"
                v-model.number="pointsToRedeem"
                :max="maxPointsRedeemable"
                :min="0"
                step="100"
                class="points-input"
              />
              <p class="input-helper">
                Maximum: {{ maxPointsRedeemable.toLocaleString() }} points
                ({{ formatPrice(maxPointsRedeemable * pointsValue) }})
              </p>
            </div>

            <div class="redemption-summary">
              <div class="summary-row">
                <span>Points redeemed:</span>
                <strong>{{ pointsToRedeem.toLocaleString() }} pts</strong>
              </div>
              <div class="summary-row">
                <span>Point value:</span>
                <strong>-{{ formatPrice(dollarsFromPoints) }}</strong>
              </div>
              <div class="summary-row highlight">
                <span>Balance due:</span>
                <strong>{{ formatPrice(balanceDue) }}</strong>
              </div>
              <div class="summary-row">
                <span>Remaining points:</span>
                <strong class="points-remaining">{{ remainingPoints.toLocaleString() }} pts</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Flight Details -->
      <section class="flight-details-section">
        <h2>Flight Details</h2>

        <div class="flight-detail-card">
          <div class="flight-header">
            <div class="airline-info">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%230066CC'/%3E%3Ctext x='50' y='60' font-size='40' fill='white' text-anchor='middle' font-family='Arial'%3E✈%3C/text%3E%3C/svg%3E"
                alt="Airline"
                class="airline-logo"
              />
              <div>
                <div class="airline-name">{{ flight.airline }}</div>
                <div class="airline-label">Airline</div>
              </div>
            </div>
            <div class="booking-notice">
              <span class="notice-text">Free 24h cancellation</span>
            </div>
          </div>

          <!-- Outbound Flight -->
          <div class="flight-leg">
            <div class="leg-header">
              <strong>{{ flight.departure.airport }} → {{ flight.arrival.airport }}</strong>
              <span class="leg-date">{{ outboundDate }}</span>
            </div>
            <div class="leg-details">
              <div class="time-point">
                <div class="time">{{ flight.departure.time }}</div>
                <div class="airport">{{ flight.departure.airport }}</div>
              </div>
              <div class="journey-info">
                <div class="journey-line"></div>
                <div class="journey-duration">{{ flight.duration }}</div>
                <div v-if="flight.stops === 0" class="journey-stops nonstop">Nonstop</div>
                <div v-else class="journey-stops">{{ flight.stops }} stop{{ flight.stops > 1 ? 's' : '' }}</div>
              </div>
              <div class="time-point">
                <div class="time">{{ flight.arrival.time }}</div>
                <div class="airport">{{ flight.arrival.airport }}</div>
              </div>
            </div>
            <div class="flight-meta">
              <span>{{ flight.airline }} {{ flight.flightNumber }}</span>
              <span class="separator">•</span>
              <span>Narrow-body jet</span>
              <span class="separator">•</span>
              <span>Airbus A320-100/200</span>
            </div>
            <div class="amenities">
              <span class="amenity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                </svg>
                Wi-Fi
              </span>
              <span class="amenity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 3v4M8 3v4"/>
                </svg>
                In-seat power
              </span>
              <span class="amenity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18V5l12-2v13M6 15v6M9 9l12-2"/>
                </svg>
                Live TV
              </span>
              <span class="amenity">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M2 12h20"/>
                </svg>
                On-demand video
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Book Button -->
      <div class="book-section">
        <button @click="proceedToBook" class="btn-primary book-button">
          Book for {{ formatPrice(balanceDue) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.confirmation-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 16rem 1.5rem;

  @media (max-width: 768px) {
    padding: 11rem 1rem 1rem;
  }
}

.confirmation-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  color: #005eb8;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.75rem 1rem;
  margin-left: -1rem;
  margin-right: -1rem;
  margin-top: -0.5rem;
  transition: all 0.2s;
  position: sticky;
  top: 58px;
  z-index: 100;
  backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: #004a94;
    transform: translateX(-2px);
  }

  // Add border on scroll for better visibility
  @supports (backdrop-filter: blur(8px)) {
    background: rgba(255, 255, 255, 0.9);
  }

  // Shadow when scrolled
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e5e5;
    opacity: 0;
    transition: opacity 0.2s;
  }
}

.confirmation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }

  .route-info {
    h1 {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      color: #1a1a1a;

      @media (max-width: 768px) {
        font-size: 1.5rem;
      }
    }

    .trip-details {
      color: #666;
      font-size: 0.95rem;
      margin: 0;
    }
  }

  .price-display {
    .price {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;

      @media (max-width: 768px) {
        font-size: 1.75rem;
      }
    }
  }
}

.step-section {
  padding: 1.5rem 0;
  border-bottom: 1px solid #e5e5e5;

  &:last-of-type {
    border-bottom: none;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #1a1a1a;
  }

  .step-disclaimer {
    color: #666;
    font-size: 0.875rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;

    .disclaimer-link {
      color: #005eb8;
      text-decoration: underline;

      &:hover {
        color: #004a94;
      }
    }
  }

  .step-description {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
}

.fare-options {
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
}

.fare-card {
  background: white;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #005eb8;
  }

  &.selected {
    border-color: #005eb8;
    box-shadow: 0 0 0 1px #005eb8;
  }

  &.collapsed {
    padding: 0.75rem 1.5rem;

    .fare-header {
      margin-bottom: 0;

      h3 {
        font-size: 1rem;
      }

      .fare-price {
        font-size: 1.125rem;
      }
    }
  }

  &.expanded {
    .fare-header {
      margin-bottom: 1rem;
    }
  }

  .fare-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: margin 0.3s ease;

    h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      transition: font-size 0.3s ease;
    }

    .fare-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      transition: font-size 0.3s ease;
    }
  }

  .fare-features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    animation: fadeIn 0.3s ease;

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #666;

      svg {
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }

      &.feature-negative svg {
        color: #999;
      }

      &.feature-positive svg {
        color: #0a8a4e;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fare-note {
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
  margin: 0;
}

.rewards-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rewards-option {
  background: white;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  gap: 1rem;
  align-items: flex-start;

  &:hover {
    border-color: #005eb8;
  }

  &.selected {
    border-color: #005eb8;
    background: #f0f7ff;
    box-shadow: 0 0 0 1px #005eb8;
  }

  input[type="radio"] {
    margin-top: 0.25rem;
    cursor: pointer;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .option-content {
    flex: 1;
  }

  .option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .option-title {
      font-weight: 600;
      font-size: 1.05rem;
      color: #1a1a1a;
    }

    .option-price {
      font-weight: 700;
      font-size: 1.125rem;
      color: #005eb8;
    }
  }

  .option-description {
    color: #666;
    font-size: 0.875rem;
    margin: 0;
  }
}

.points-redemption {
  background: white;
  border: 2px solid #005eb8;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: -0.5rem;
}

.redemption-input {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }

  .points-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #005eb8;
      box-shadow: 0 0 0 2px rgba(0, 94, 184, 0.1);
    }
  }

  .input-helper {
    color: #666;
    font-size: 0.875rem;
    margin: 0.5rem 0 0 0;
  }
}

.redemption-summary {
  background: #f9f9f9;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;

  &.highlight {
    padding-top: 0.75rem;
    border-top: 1px solid #e5e5e5;
    font-size: 1.05rem;

    strong {
      font-size: 1.25rem;
      color: #005eb8;
    }
  }

  .points-remaining {
    color: #0a8a4e;
  }
}

.flight-details-section {
  padding: 1.5rem 0;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: #1a1a1a;
  }
}

.flight-detail-card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;
}

.flight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .airline-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .airline-logo {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .airline-name {
      font-weight: 600;
      font-size: 1rem;
      color: #1a1a1a;
    }

    .airline-label {
      font-size: 0.875rem;
      color: #666;
    }
  }

  .booking-notice {
    .notice-text {
      font-size: 0.875rem;
      color: #0a8a4e;
      font-weight: 500;
    }
  }
}

.flight-leg {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .leg-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .leg-date {
      color: #666;
    }
  }

  .leg-details {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1.5rem;
    align-items: center;

    .time-point {
      text-align: center;

      .time {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.25rem;
        color: #1a1a1a;
      }

      .airport {
        font-size: 0.875rem;
        color: #666;
        font-weight: 500;
      }
    }

    .journey-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;

      .journey-line {
        width: 100%;
        height: 2px;
        background: #e5e5e5;
        position: relative;

        &::before, &::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background: #999;
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

      .journey-duration {
        font-size: 0.875rem;
        color: #666;
        font-weight: 500;
      }

      .journey-stops {
        font-size: 0.875rem;
        color: #666;

        &.nonstop {
          color: #0a8a4e;
          font-weight: 600;
        }
      }
    }
  }

  .flight-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;

    .separator {
      color: #ccc;
    }
  }

  .amenities {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      gap: 0.75rem;
    }

    .amenity {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.875rem;
      color: #666;

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }
}

.book-section {
  padding: 1.5rem 0;

  .book-button {
    width: 100%;
    padding: 1rem 2rem;
    font-size: 1.125rem;
    font-weight: 700;
  }
}

.debug-panel {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 8px;

  h3 {
    margin: 0 0 1rem 0;
    color: #856404;
  }

  .debug-section {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: white;
    border-radius: 4px;

    h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #666;
    }

    pre {
      margin: 0;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 0.85rem;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        padding: 0.25rem 0;
        font-family: monospace;
        font-size: 0.9rem;
      }
    }
  }
}
</style>
