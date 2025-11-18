<script lang="ts">
import { useSearchStore } from '@/stores/searchStore'
import type { Flight } from '@/types/search'

export default {
  name: 'FlightCard',
  props: {
    flight: {
      type: Object as () => Flight,
      required: true
    },
    searchData: {
      type: Object,
      default: null
    }
  },
  computed: {
    searchStore() {
      return useSearchStore()
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
      console.log('Flight selected:', this.flight)
      console.log('Search data:', this.searchData)

      // Store flight and search data in sessionStorage for navigation
      try {
        const flightJson = JSON.stringify(this.flight)
        const searchDataJson = JSON.stringify(this.searchData)

        console.log('Storing in sessionStorage...')
        sessionStorage.setItem('selectedFlight', flightJson)
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
  <div class="flight-card">
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
        <button @click="selectFlight" class="btn-primary select-btn">
          {{ formatPrice(flight.price) }}
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
</style>
