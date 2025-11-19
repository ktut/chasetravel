<script lang="ts">
import type { Booking } from '@/stores/searchStore'

export default {
  name: 'HotelBooking',
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
    formatShortDate(date: Date | string): string {
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    },
    calculateNights(checkIn: Date | string, checkOut: Date | string): number {
      const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
      const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    },
    getBookingPrice(): number {
      if (this.booking.hotel && this.booking.searchData) {
        const nights = this.calculateNights(this.booking.searchData.checkIn, this.booking.searchData.checkOut)
        if (this.booking.room) {
          return this.booking.room.pricePerNight * nights
        }
        return this.booking.hotel.pricePerNight * nights
      }
      return 0
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
        <div class="booking-type-badge hotel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Hotel
        </div>
      </div>

      <div class="booking-details hotel-details">
        <div class="hotel-image-container">
          <img :src="booking.hotel.image" :alt="booking.hotel.name" class="hotel-thumbnail" />
        </div>
        <div class="hotel-info">
          <h3>{{ booking.hotel.name }}</h3>
          <div class="hotel-location">{{ booking.hotel.location }}</div>
          <div class="hotel-stars">
            <span v-for="star in booking.hotel.stars" :key="star" class="star">★</span>
          </div>
          <div v-if="booking.searchData" class="reservation-date">
            {{ formatShortDate(booking.searchData.checkIn) }} - {{ formatShortDate(booking.searchData.checkOut) }}
            <span class="nights-label">• {{ calculateNights(booking.searchData.checkIn, booking.searchData.checkOut) }} night{{ calculateNights(booking.searchData.checkIn, booking.searchData.checkOut) > 1 ? 's' : '' }}</span>
          </div>
          <div v-if="booking.room" class="room-name">{{ booking.room.name }}</div>
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

  &.hotel {
    background: #fff4e6;
    color: #c8a96e;
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

  &.hotel-details {
    align-items: flex-start;
    display: grid;
    grid-template-columns: 100px 1fr auto;
    gap: 1rem;
    align-items: center;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

.hotel-image-container {
  .hotel-thumbnail {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 6px;

    @media (max-width: 768px) {
      width: 100%;
      height: 150px;
    }
  }
}

.hotel-info {
  flex: 1;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: $color-primary;
  }

  .hotel-location {
    color: #666;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .hotel-stars {
    color: #ffa500;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .reservation-date {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.5rem;

    .nights-label {
      color: #999;
    }
  }

  .room-name {
    color: #666;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-style: italic;
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
