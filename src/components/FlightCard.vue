<script lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import type { Flight, FlightPair } from '@/types/search'
import { getAirlineLogo } from '@/utils/airlineLogos'

export default {
  name: 'FlightCard',
  props: {
    flight: {
      type: Object as () => Flight | null,
      default: null
    },
    flightPair: {
      type: Object as () => FlightPair | null,
      default: null
    },
    searchData: {
      type: Object,
      default: null
    }
  },
  computed: {
    searchStore() {
      return useSearchStore()
    },
    isRoundTrip(): boolean {
      return this.flightPair !== null &&this.flightPair !== undefined
    },
    displayFlight(): Flight | null {
      if (this.isRoundTrip && this.flightPair) {
        return this.flightPair.outbound
      }
      return this.flight
    },
    displayPrice(): number {
      if (this.isRoundTrip && this.flightPair) {
        return this.flightPair.totalPrice
      }
      return this.flight ? this.flight.price : 0
    },
    airlineLogo() {
      return this.displayFlight ? getAirlineLogo(this.displayFlight.airline) : null
    },
    returnAirlineLogo() {
      if (!this.isRoundTrip || !this.flightPair) return null
      return getAirlineLogo(this.flightPair.return.airline)
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
    formatTime(time: string): string {
      // Convert 24hr time to 12hr format (e.g., "14:30" -> "2:30 pm")
      const [hours, minutes] = time.split(':')
      const hour = parseInt(hours)
      const period = hour >= 12 ? 'pm' : 'am'
      const hour12 = hour % 12 || 12
      return `${hour12}:${minutes} ${period}`
    },
    selectFlight() {
      console.log('=== FlightCard.selectFlight CALLED ===')
      console.log('Is round-trip:', this.isRoundTrip)
      console.log('Flight/Pair selected:', this.isRoundTrip ? this.flightPair : this.flight)
      console.log('Search data:', this.searchData)

      // Store flight(s) and search data in sessionStorage for navigation
      try {
        const searchDataJson = JSON.stringify(this.searchData)

        if (this.isRoundTrip && this.flightPair) {
          // Store both outbound and return flights for round-trip
          console.log('Storing round-trip flights...')
          sessionStorage.setItem('outboundFlight', JSON.stringify(this.flightPair.outbound))
          sessionStorage.setItem('returnFlight', JSON.stringify(this.flightPair.return))
        } else {
          // Store single flight for one-way
          console.log('Storing one-way flight...')
          sessionStorage.setItem('selectedFlight', JSON.stringify(this.flight))
        }

        console.log('Storing in sessionStorage...')
        sessionStorage.setItem('confirmationSearchData', searchDataJson)

        // Verify it was stored
        const storedFlight = sessionStorage.getItem('selectedFlight')
        const storedSearch = sessionStorage.getItem('confirmationSearchData')
        console.log('Verification - Flight in storage:', storedFlight ? 'YES' : 'NO')
        console.log('Verification - Search in storage:', storedSearch ? 'YES' : 'NO')

        console.log('Navigating to /confirmation...')
        // Use nextTick to ensure sessionStorage is written before navigation
        this.$nextTick(() => {
          this.$router.push('/confirmation')
        })
      } catch (e) {
        console.error('Error in selectFlight:', e)
      }
    }
  }
}
</script>

<template>
  <div v-if="displayFlight" class="flight-card" :class="{ 'round-trip-card': isRoundTrip }">
    <div class="flights-container">
      <!-- Outbound Flight (or single flight for one-way) -->
      <div class="flight-segment">
        <div class="flight-info-wrapper">
          <img v-if="airlineLogo" :src="airlineLogo" :alt="displayFlight.airline" class="airline-logo" />
          <div class="flight-info">
            <div class="flight-times">
              {{ formatTime(displayFlight.departure.time) }} - {{ formatTime(displayFlight.arrival.time) }}
            </div>
            <div class="airline-name">{{ displayFlight.airline }}</div>
          </div>
        </div>

        <div class="flight-stops">
          <span v-if="displayFlight.stops === 0">nonstop</span>
          <span v-else>{{ displayFlight.stops }} stop{{ displayFlight.stops > 1 ? 's' : '' }}</span>
        </div>

        <div class="flight-details" :class="{ 'mobile-compact': !isRoundTrip }">
          <div class="duration">{{ displayFlight.duration }}</div>
          <div class="route">{{ displayFlight.departure.airport }}-{{ displayFlight.arrival.airport }}</div>
        </div>
      </div>

      <!-- Return Flight (only for round-trip) -->
      <div v-if="isRoundTrip && flightPair" class="flight-segment">
        <div class="flight-info-wrapper">
          <img v-if="returnAirlineLogo" :src="returnAirlineLogo" :alt="flightPair.return.airline" class="airline-logo" />
          <div class="flight-info">
            <div class="flight-times">
              {{ formatTime(flightPair.return.departure.time) }} - {{ formatTime(flightPair.return.arrival.time) }}
            </div>
            <div class="airline-name">{{ flightPair.return.airline }}</div>
          </div>
        </div>

        <div class="flight-stops">
          <span v-if="flightPair.return.stops === 0">nonstop</span>
          <span v-else>{{ flightPair.return.stops }} stop{{ flightPair.return.stops > 1 ? 's' : '' }}</span>
        </div>

        <div class="flight-details">
          <div class="duration">{{ flightPair.return.duration }}</div>
          <div class="route">{{ flightPair.return.departure.airport }}-{{ flightPair.return.arrival.airport }}</div>
        </div>
      </div>
    </div>

    <!-- Price section spans full height -->
    <div class="flight-actions">
      <div class="price-info">
        <div class="price">{{ formatPrice(displayPrice) }}</div>
        <div class="fare-class">Basic Economy</div>
      </div>
      <button @click="selectFlight" class="select-btn">Select</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flight-card {
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  transition: all 0.2s;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
    grid-template-columns: 1fr;
    gap: 0;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: darken($color-light-grey, 10%);
  }

  &.round-trip-card {
    padding: 1.5rem;
  }
}

.flights-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
}

.flight-segment {
  display: grid;
  grid-template-columns: 220px 140px 140px;
  gap: 1.5rem;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 180px 120px 120px;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto;
    gap: 1rem;
  }
}

.flight-info-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.airline-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
}

.flight-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.flight-times {
  font-size: 1.125rem;
  font-weight: 700;
  color: $color-text;
  white-space: nowrap;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.airline-name {
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
}

.flight-stops {
  text-align: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: $color-text;

  @media (max-width: 1024px) {
    display: none;
  }
}

.flight-details {
  display: flex;
  flex-direction: column;
  text-align: left;

  @media (max-width: 768px) {
    text-align: right;

    &.mobile-compact {
      // For one-way flights, show on the right
      order: 2;
    }
  }

  .duration {
    font-size: 0.95rem;
    font-weight: 400;
    color: $color-text;
  }

  .route {
    font-size: 0.95rem;
    font-weight: 400;
    color: #6b7280;
  }
}

.flight-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-left: 1.5rem;
  border-left: 1px solid $color-light-grey;
  min-width: 240px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 1rem;
    gap: 0.75rem;
    border-left: none;
    padding-left: 0;
    padding-top: 1rem;
    border-top: 1px solid $color-light-grey;
    min-width: unset;
  }

  .price-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;

    @media (max-width: 768px) {
      align-items: flex-end;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: $color-text;
      line-height: 1;

      @media (max-width: 768px) {
        font-size: 1.25rem;
      }
    }

    .fare-class {
      font-size: 0.85rem;
      font-weight: 400;
      color: #6b7280;

      @media (max-width: 768px) {
        font-size: 0.75rem;
      }
    }
  }

  .select-btn {
    background: #ff5722;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;

    &:hover {
      background: darken(#ff5722, 8%);
    }

    @media (max-width: 768px) {
      padding: 0.65rem 1.5rem;
      font-size: 0.95rem;
    }
  }
}
</style>
