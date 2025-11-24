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
    <!-- Outbound Flight (or single flight for one-way) -->
    <div class="flight-main">
      <div class="flight-info-wrapper">
        <img v-if="airlineLogo" :src="airlineLogo" :alt="displayFlight.airline" class="airline-logo" />
        <div class="flight-info">
          <div v-if="isRoundTrip" class="flight-label">Departure</div>
          <div class="airline">{{ displayFlight.airline }}</div>
          <div class="flight-number">{{ displayFlight.flightNumber }}</div>
        </div>
      </div>

      <div class="flight-route">
        <div class="route-point">
          <div class="time">{{ displayFlight.departure.time }}</div>
          <div class="airport">{{ displayFlight.departure.airport }}</div>
        </div>

        <div class="route-visual">
          <div class="route-line">
            <div class="line"></div>
          </div>
          <div class="duration">{{ displayFlight.duration }}</div>
          <div class="stops" v-if="displayFlight.stops > 0">{{ displayFlight.stops }} stop{{ displayFlight.stops > 1 ? 's' : '' }}</div>
          <div class="nonstop" v-else>Nonstop</div>
        </div>

        <div class="route-point">
          <div class="time">{{ displayFlight.arrival.time }}</div>
          <div class="airport">{{ displayFlight.arrival.airport }}</div>
        </div>
      </div>

      <div v-if="!isRoundTrip" class="flight-price">
        <button @click="selectFlight" class="btn-primary select-btn">
          {{ formatPrice(displayPrice) }}
        </button>
      </div>
    </div>

    <!-- Return Flight (only for round-trip) -->
    <div v-if="isRoundTrip && flightPair" class="flight-separator"></div>
    <div v-if="isRoundTrip && flightPair" class="flight-main">
      <div class="flight-info-wrapper">
        <img v-if="returnAirlineLogo" :src="returnAirlineLogo" :alt="flightPair.return.airline" class="airline-logo" />
        <div class="flight-info">
          <div class="flight-label">Return</div>
          <div class="airline">{{ flightPair.return.airline }}</div>
          <div class="flight-number">{{ flightPair.return.flightNumber }}</div>
        </div>
      </div>

      <div class="flight-route">
        <div class="route-point">
          <div class="time">{{ flightPair.return.departure.time }}</div>
          <div class="airport">{{ flightPair.return.departure.airport }}</div>
        </div>

        <div class="route-visual">
          <div class="route-line">
            <div class="line"></div>
          </div>
          <div class="duration">{{ flightPair.return.duration }}</div>
          <div class="stops" v-if="flightPair.return.stops > 0">{{ flightPair.return.stops }} stop{{ flightPair.return.stops > 1 ? 's' : '' }}</div>
          <div class="nonstop" v-else>Nonstop</div>
        </div>

        <div class="route-point">
          <div class="time">{{ flightPair.return.arrival.time }}</div>
          <div class="airport">{{ flightPair.return.arrival.airport }}</div>
        </div>
      </div>

      <div class="flight-price">
        <button @click="selectFlight" class="btn-primary select-btn">
          {{ formatPrice(displayPrice) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

  &.round-trip-card {
    padding: 1rem 1rem 0.75rem;
  }
}

.flight-separator {
  height: 1px;
  background: linear-gradient(to right, #e5e5e5 0%, #ccc 50%, #e5e5e5 100%);
  margin: 0.75rem 0;
}

.flight-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: $color-accent;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
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

.flight-info-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    order: 1;
  }
}

.airline-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
}

.flight-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

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
</style>
