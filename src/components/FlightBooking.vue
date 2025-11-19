<script lang="ts">
import type { Booking } from '@/stores/searchStore'
import { getAirlineLogo } from '@/utils/airlineLogos'

export default {
  name: 'FlightBooking',
  props: {
    booking: {
      type: Object as () => Booking,
      required: true
    }
  },
  computed: {
    airlineLogo() {
      if (!this.booking.flight) return null
      return getAirlineLogo(this.booking.flight.airline)
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
    formatDate(date: Date | string): string {
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    cancelBooking() {
      this.$emit('cancel', this.booking.id)
    }
  }
}
</script>

<template>
  <div v-if="booking.flight" class="booking-card">
    <div class="booking-content">
      <div class="booking-type-badge flight">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path>
        </svg>
        Flight
      </div>

      <div class="booking-details">
        <div class="flight-info-wrapper">
          <img v-if="airlineLogo" :src="airlineLogo" :alt="booking.flight.airline" class="airline-logo" />
          <div class="flight-info">
            <h3>{{ booking.flight.departure.airport }} → {{ booking.flight.arrival.airport }}</h3>
            <div class="flight-meta">
              <span>{{ booking.flight.airline }} {{ booking.flight.flightNumber }}</span>
              <span class="separator">•</span>
              <span class="time">{{ booking.flight.departure.time }}</span>
              <span class="separator">→</span>
              <span class="time">{{ booking.flight.arrival.time }}</span>
              <span class="separator">•</span>
              <span class="duration">{{ booking.flight.duration }}</span>
            </div>
          </div>
        </div>
        <div class="booking-actions">
          <button @click="cancelBooking" class="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.booking-card {
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;

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

.flight-info-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.airline-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
}

.flight-info {
  flex: 1;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.4rem 0;
    color: $color-primary;
  }

  .flight-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;

    .separator {
      color: #ccc;
    }

    .time {
      font-weight: 600;
      color: $color-primary;
    }

    .duration {
      color: #999;
    }
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
