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
    cancelBooking() {
      this.$emit('cancel', this.booking.id)
    }
  }
}
</script>

<template>
  <div v-if="flightsToDisplay.length > 0" class="booking-card" :class="{ 'round-trip': isRoundTrip }">
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

      <!-- Actions -->
      <div class="booking-footer">
        <button @click="cancelBooking" class="btn-cancel">Cancel Booking</button>
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

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
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

.booking-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;

  @media (max-width: 768px) {
    justify-content: stretch;
  }
}

.booking-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;

  @media (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
  }
}

.btn-cancel {
  padding: 0.4rem 0.875rem;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background: white;
  color: #666;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #fee;
    border-color: #dc3545;
    color: #dc3545;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
}
</style>
