<script lang="ts">
import type { Booking } from '@/stores/searchStore'

export default {
  name: 'FlightBooking',
  props: {
    booking: {
      type: Object as () => Booking,
      required: true
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
  <div class="booking-card">
    <div class="booking-content">
      <div class="booking-header">
        <div class="booking-type-badge flight">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"></path>
          </svg>
          Flight
        </div>
      </div>

      <div class="booking-details">
        <div class="flight-info">
          <h3>{{ booking.flight.departure.airport }} → {{ booking.flight.arrival.airport }}</h3>
          <div v-if="booking.searchData" class="reservation-date">
            {{ formatDate(booking.searchData.checkIn) }}
          </div>
          <div class="flight-meta">
            <span>{{ booking.flight.airline }} {{ booking.flight.flightNumber }}</span>
          </div>
          <div class="time-info">
            <span class="time">{{ booking.flight.departure.time }}</span>
            <span class="duration">{{ booking.flight.duration }}</span>
            <span class="time">{{ booking.flight.arrival.time }}</span>
          </div>
        </div>
        <div class="booking-actions">
          <button @click="cancelBooking" class="btn-cancel">Cancel Booking</button>
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
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.past {
    opacity: 0.8;
  }
}

.booking-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

.booking-type-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;

  svg {
    width: 16px;
    height: 16px;
  }

  &.flight {
    background: #e6f2ff;
    color: $color-accent;
  }
}

.booking-date {
  color: #666;
  font-size: 0.875rem;
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

.flight-info {
  flex: 1;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: $color-primary;
  }

  .reservation-date {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .flight-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.5rem;

    .separator {
      color: #ccc;
    }
  }

  .time-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: #666;

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
  padding: 0.5rem 1rem;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background: white;
  color: #666;
  font-size: 0.875rem;
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
