<script lang="ts">
import type { Booking } from '@/stores/searchStore'
import { formatPrice, formatDate } from '@/utils/formatters'
import FlightSegment from './FlightSegment.vue'

export default {
  name: 'FlightBooking',
  components: {
    FlightSegment
  },
  props: {
    booking: {
      type: Object as () => Booking,
      required: true
    }
  },
  computed: {
    flightsToDisplay() {
      if (this.booking.flights && this.booking.flights.length > 0) {
        return this.booking.flights
      }
      return []
    },
    isRoundTrip() {
      return this.flightsToDisplay.length === 2 || this.booking.tripType === 'round-trip'
    },
    totalPrice() {
      return this.flightsToDisplay.reduce((sum, flight) => sum + flight.price, 0)
    }
  },
  methods: {
    formatPrice,
    formatDate,
    navigateToDetail() {
      this.$router.push(`/booking/${this.booking.id}`)
    }
  }
}
</script>

<template>
  <div
    v-if="flightsToDisplay.length > 0"
    class="booking-card"
    :class="{ 'round-trip': isRoundTrip }"
    @click="navigateToDetail"
    @keydown.enter="navigateToDetail"
    tabindex="0"
    role="button"
    :aria-label="`View details for ${booking.type} booking`"
  >
    <div class="booking-content">
      <div class="booking-type-badge flight">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path>
        </svg>
        {{ isRoundTrip ? 'Round-trip Flight' : 'Flight' }}
      </div>

      <!-- Outbound Flight (or single flight) -->
      <div class="booking-details">
        <FlightSegment
          :flight="flightsToDisplay[0]"
          variant="booking"
          :label="isRoundTrip ? 'Outbound' : ''"
        />
      </div>

      <!-- Return Flight (if round-trip) -->
      <div v-if="isRoundTrip && flightsToDisplay.length === 2" class="flight-separator"></div>
      <div v-if="isRoundTrip && flightsToDisplay.length === 2" class="booking-details">
        <FlightSegment
          :flight="flightsToDisplay[1]"
          variant="booking"
          label="Return"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;

.booking-card {
  @include card-base;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }

  &:focus {
    outline: 2px solid $color-accent;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }

  &.past {
    opacity: 0.8;
  }
}

.booking-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.booking-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  width: fit-content;

  svg {
    width: 14px;
    height: 14px;
  }

  &.flight {
    background: #e6f2ff;
    color: $color-accent;
  }
}

.booking-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.flight-separator {
  height: 1px;
  background: linear-gradient(to right, #e5e5e5 0%, #ccc 50%, #e5e5e5 100%);
  margin: 0.75rem 0;
  position: relative;

  &::after {
    content: '↓';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 0 0.5rem;
    color: #999;
    font-size: 1rem;
  }
}
</style>
