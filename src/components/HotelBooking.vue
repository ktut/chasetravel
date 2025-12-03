<script lang="ts">
import type { Booking } from '@/stores/searchStore'
import { formatPrice, formatDate } from '@/utils/formatters'
import { calculateNights } from '@/utils/dateUtils'

export default {
  name: 'HotelBooking',
  props: {
    booking: {
      type: Object as () => Booking,
      required: true
    }
  },
  methods: {
    formatPrice,
    formatDate,
    calculateNights,
    getBookingPrice(): number {
      if (this.booking.hotel && this.booking.searchData) {
        const nights = calculateNights(this.booking.searchData.checkIn, this.booking.searchData.checkOut)
        if (this.booking.room) {
          return this.booking.room.pricePerNight * nights
        }
        return this.booking.hotel.pricePerNight * nights
      }
      return 0
    },
    navigateToDetail() {
      this.$router.push(`/booking/${this.booking.id}`)
    }
  }
}
</script>

<template>
  <div
    v-if="booking.hotel"
    class="booking-card"
    @click="navigateToDetail"
    @keydown.enter="navigateToDetail"
    tabindex="0"
    role="button"
    :aria-label="`View details for ${booking.hotel.name}`"
  >
    <div class="booking-content">
      <div class="booking-type-badge hotel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Hotel
      </div>

      <div class="booking-details">
        <div class="hotel-image-container">
          <img :src="booking.hotel.image" :alt="booking.hotel.name" class="hotel-thumbnail" />
        </div>
        <div class="hotel-info">
          <h3>{{ booking.hotel.name }}</h3>
          <div class="hotel-meta">
            <span class="hotel-location">{{ booking.hotel.location }}</span>
            <span class="separator">•</span>
            <span class="hotel-stars">
              <span v-for="star in booking.hotel.stars" :key="star" class="star">★</span>
            </span>
            <template v-if="booking.searchData">
              <span class="separator">•</span>
              <span>{{ calculateNights(booking.searchData.checkIn, booking.searchData.checkOut) }} night{{ calculateNights(booking.searchData.checkIn, booking.searchData.checkOut) > 1 ? 's' : '' }}</span>
            </template>
          </div>
          <div v-if="booking.room" class="room-name">{{ booking.room.name }}</div>
        </div>
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

  &.hotel {
    background: #fff4e6;
    color: #c8a96e;
  }
}

.booking-details {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 1rem;
  align-items: center;
}

.hotel-image-container {
  .hotel-thumbnail {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;

    @media (max-width: 768px) {
      width: 80px;
      height: 80px;
    }
  }
}

.hotel-info {
  flex: 1;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.4rem 0;
    color: $color-primary;
  }

  .hotel-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;

    .separator {
      color: #ccc;
    }

    .hotel-stars {
      color: #ffa500;
      display: inline-flex;
    }
  }

  .room-name {
    color: #666;
    font-size: 0.8125rem;
    margin-top: 0.25rem;
    font-style: italic;
  }
}
</style>
