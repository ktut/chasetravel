<script lang="ts">
import type { Hotel } from '@/types/search'
import { formatPrice } from '@/utils/formatters'
import AmenityPills from './AmenityPills.vue'

export default {
  name: 'HotelCard',
  components: {
    AmenityPills
  },
  props: {
    hotel: {
      type: Object as () => Hotel,
      required: true
    },
    searchData: {
      type: Object,
      default: null
    }
  },
  computed: {
    numberOfNights(): number {
      if (!this.searchData?.checkIn || !this.searchData?.checkOut) {
        return 1
      }
      const checkIn = new Date(this.searchData.checkIn)
      const checkOut = new Date(this.searchData.checkOut)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays || 1
    },
    totalCost(): number {
      return this.hotel.pricePerNight * this.numberOfNights
    }
  },
  methods: {
    formatPrice,
    getStarsArray(count: number): number[] {
      return Array.from({ length: count }, (_, i) => i)
    },
    selectHotel() {
      // Store search data in sessionStorage for navigation
      try {
        const searchDataJson = JSON.stringify(this.searchData)
        sessionStorage.setItem('confirmationSearchData', searchDataJson)
        this.$router.push(`/hotel/${this.hotel.id}`)
      } catch (e) {
        console.error('Error in selectHotel:', e)
      }
    }
  }
}
</script>

<template>
  <div class="hotel-card">
    <div class="hotel-image">
      <img :src="hotel.image" :alt="hotel.name" />
    </div>

    <div class="hotel-details">
      <div class="hotel-header">
        <div class="hotel-name-wrapper">
          <div class="hotel-name">{{ hotel.name }}</div>
          <div class="hotel-rating-compact">
            <span class="rating-score">{{ hotel.rating }}</span>
            <span class="rating-reviews">({{ hotel.reviewCount }})</span>
            <div class="hotel-stars">
              <span v-for="star in getStarsArray(hotel.stars)" :key="star" class="star">★</span>
            </div>
          </div>
        </div>
      </div>

      <AmenityPills :amenities="hotel.amenities" />
    </div>

    <div class="hotel-price desktop-only">
      <div class="price-info">
        <div class="price-per-night">
          <span class="price-amount">{{ formatPrice(hotel.pricePerNight) }}</span>
          <span class="price-label">/night</span>
        </div>
        <div class="price-total">
          <span class="total-label">Total: </span>
          <span class="total-amount">{{ formatPrice(totalCost) }}</span>
        </div>
      </div>
      <button @click="selectHotel" class="btn-primary select-btn">
        Select
      </button>
    </div>

    <div class="hotel-price-mobile">
      <button @click="selectHotel" class="btn-primary select-btn">
        <span class="price-text">{{ formatPrice(hotel.pricePerNight) }}</span>
        <span class="per-night">/night</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hotel-card {
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 8px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 240px 1fr 180px;
  transition: all 0.2s;
  cursor: pointer;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: $color-accent;
  }
}

.desktop-only {
  @media (max-width: 968px) {
    display: none !important;
  }
}

.hotel-image {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;

    @media (max-width: 968px) {
      min-height: 120px;
      max-height: 120px;
    }
  }

  &:hover img {
    transform: scale(1.05);
  }
}

.hotel-details {
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 968px) {
    padding: 0.75rem;
    gap: 0.5rem;
  }
}

.hotel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  .hotel-name-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    @media (max-width: 968px) {
      gap: 0.35rem;
    }
  }

  .hotel-name {
    font-size: 1.05rem;
    font-weight: 600;
    color: $color-text;
    line-height: 1.3;

    @media (max-width: 968px) {
      font-size: 1rem;
      line-height: 1.2;
    }
  }

  .hotel-rating-compact {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;

    @media (max-width: 968px) {
      gap: 0.35rem;
    }

    .rating-score {
      background: $color-accent;
      color: white;
      padding: 0.2rem 0.45rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.78rem;

      @media (max-width: 968px) {
        padding: 0.2rem 0.4rem;
        font-size: 0.75rem;
      }
    }

    .rating-reviews {
      color: $color-text-light;
      font-size: 0.78rem;

      @media (max-width: 968px) {
        font-size: 0.75rem;
      }
    }

    .hotel-stars {
      color: #ffa500;
      display: flex;
      gap: 1px;

      .star {
        font-size: 0.8rem;

        @media (max-width: 968px) {
          font-size: 0.75rem;
        }
      }
    }
  }
}

.hotel-price {
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  background: $color-bg-light;
  border-left: 1px solid $color-light-grey;

  .price-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    width: 100%;
  }

  .price-per-night {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;

    .price-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: $color-text;
      line-height: 1;
    }

    .price-label {
      color: $color-text-light;
      font-size: 0.8rem;
      line-height: 1;
    }
  }

  .price-total {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    padding: 0.3rem 0.6rem;
    background: rgba($color-accent, 0.08);
    border-radius: 4px;

    .total-label {
      color: $color-text-light;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .total-amount {
      font-size: 0.95rem;
      font-weight: 700;
      color: $color-text;
    }
  }

  .select-btn {
    padding: 0.65rem 1.25rem;
    white-space: nowrap;
    font-size: 0.9rem;
    width: 100%;
  }
}

.hotel-price-mobile {
  display: none;

  @media (max-width: 968px) {
    display: block;
    padding: 0.75rem;
    border-top: 1px solid $color-light-grey;
    background: white;

    .select-btn {
      width: 100%;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.2rem;

      .price-text {
        font-size: 1.15rem;
        font-weight: 700;
        line-height: 1;
      }

      .per-night {
        font-size: 0.9rem;
        font-weight: 500;
        line-height: 1;
      }
    }
  }
}
</style>
