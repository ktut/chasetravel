<script lang="ts">
import type { Hotel, SearchData } from '@/types/search'
import { formatPrice } from '@/utils/formatters'
import { calculateNights } from '@/utils/dateUtils'
import { saveHotelBooking } from '@/services/bookingStorage'
import AmenityPills from './AmenityPills.vue'
import StarsDisplay from './StarsDisplay.vue'
import PriceDisplay from './PriceDisplay.vue'
import PointsBoostBadge from './PointsBoostBadge.vue'

export default {
  name: 'HotelCard',
  components: {
    AmenityPills,
    StarsDisplay,
    PriceDisplay,
    PointsBoostBadge
  },
  props: {
    hotel: {
      type: Object as () => Hotel,
      required: true
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
  computed: {
    numberOfNights(): number {
      if (!this.searchData?.checkIn || !this.searchData?.checkOut) {
        return 1
      }
      return calculateNights(this.searchData.checkIn, this.searchData.checkOut)
    },
    totalCost(): number {
      return this.hotel.pricePerNight * this.numberOfNights
    }
  },
  methods: {
    formatPrice,
    selectHotel() {
      if (!this.searchData) return
      
      try {
        saveHotelBooking(this.hotel, this.searchData)
        this.$router.push(`/hotel/${this.hotel.id}`)
      } catch (e) {
        console.error('Error in selectHotel:', e)
      }
    }
  }
}
</script>

<template>
  <div class="hotel-card" :class="{ 'has-boost': isFirstResult }">
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
            <StarsDisplay :stars="hotel.stars" size="small" />
          </div>
        </div>
      </div>

      <AmenityPills :amenities="hotel.amenities" />
      <!-- Points Boost Badge -->
      <div v-if="isFirstResult" class="boost-badge-overlay">
        <PointsBoostBadge :price="totalCost" item-type="hotel" variant="compact" />
      </div>
    </div>

    <div class="hotel-price desktop-only">
      <PriceDisplay 
        :price="hotel.pricePerNight" 
        label="/night"
        :show-total="true"
        :total-price="totalCost"
        size="large"
      />
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
@use '@/styles/mixins.scss' as *;

.hotel-card {
  @include card-base;
  overflow: hidden;
  display: grid;
  grid-template-columns: 240px 1fr 180px;
  cursor: pointer;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  &:hover {
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

.boost-badge-overlay {
  margin-top: 1rem;
  z-index: 2;
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

  // PriceDisplay component handles these styles now

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
