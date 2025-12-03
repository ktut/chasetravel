<script lang="ts">
import type { Flight, FlightPair, SearchData } from '@/types/search'
import { formatPrice } from '@/utils/formatters'
import { saveFlightBooking } from '@/services/bookingStorage'
import LoadingSpinner from './LoadingSpinner.vue'
import PriceDisplay from './PriceDisplay.vue'
import FlightSegment from './FlightSegment.vue'
import PointsBoostBadge from './PointsBoostBadge.vue'

export default {
  name: 'FlightCard',
  components: {
    LoadingSpinner,
    PriceDisplay,
    FlightSegment,
    PointsBoostBadge
  },
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
      type: Object as () => SearchData | null,
      default: null
    },
    isFirstResult: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isSelecting: false
    }
  },
  computed: {
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
  },
  methods: {
    formatPrice,
    selectFlight() {
      if (this.isSelecting) return

      this.isSelecting = true

      setTimeout(() => {
        if (!this.searchData) {
          this.isSelecting = false
          return
        }

        try {
          const flightToSave = this.isRoundTrip && this.flightPair 
            ? this.flightPair 
            : this.flight

          if (!flightToSave) {
            this.isSelecting = false
            return
          }

          saveFlightBooking(flightToSave, this.searchData)
          
          // Use nextTick to ensure sessionStorage is written before navigation
          this.$nextTick(() => {
            this.$router.push('/confirmation')
          })
        } catch (e) {
          console.error('Error in selectFlight:', e)
          this.isSelecting = false
        }
      }, 2000)
    }
  }
}
</script>

<template>
  <div v-if="displayFlight" class="flight-card" :class="{ 'round-trip-card': isRoundTrip, 'has-boost': isFirstResult }">
    <!-- Points Boost Badge -->
    <div v-if="isFirstResult" class="boost-badge-container">
      <PointsBoostBadge :price="displayPrice" item-type="flight" variant="compact" />
    </div>

    <div class="flights-container">
      <!-- Outbound Flight (or single flight for one-way) -->
      <FlightSegment
        :flight="displayFlight"
        variant="card"
        :class="{ 'mobile-compact': !isRoundTrip }"
      />

      <!-- Return Flight (only for round-trip) -->
      <FlightSegment
        v-if="isRoundTrip && flightPair"
        :flight="flightPair.return"
        variant="card"
      />
    </div>

    <!-- Price section spans full height -->
    <div class="flight-actions">
      <div class="price-info">
        <PriceDisplay :price="displayPrice" variant="compact" size="large" />
        <div class="fare-class">Basic Economy</div>
      </div>
      <button @click="selectFlight" :disabled="isSelecting" class="select-btn">
        <LoadingSpinner v-if="isSelecting" />
        <span v-else>Select</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

.flight-card {
  @include card-base;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
    grid-template-columns: 1fr;
    gap: 0;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &.round-trip-card {
    padding: 1.5rem;
  }
}

.boost-badge-container {
  z-index: 1;
  grid-column-end: span 2;
}

.flights-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
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
    @include button-select;
  }
}
</style>
