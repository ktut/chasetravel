<script lang="ts">
import type { Hotel } from '@/types/search'
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
  methods: {
    formatPrice(price: number): string {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(price)
    },
    getStarsArray(count: number): number[] {
      return Array.from({ length: count }, (_, i) => i)
    },
    selectHotel() {
      console.log('=== HotelCard.selectHotel CALLED ===')
      console.log('Hotel selected:', this.hotel)
      console.log('Search data:', this.searchData)

      // Store search data in sessionStorage for navigation
      try {
        const searchDataJson = JSON.stringify(this.searchData)

        console.log('Storing search data in sessionStorage...')
        sessionStorage.setItem('confirmationSearchData', searchDataJson)

        // Verify it was stored
        const storedSearch = sessionStorage.getItem('confirmationSearchData')
        console.log('Verification - Search in storage:', storedSearch ? 'YES' : 'NO')

        console.log('Navigating to /hotel/' + this.hotel.id + '...')
        // Use nextTick to ensure sessionStorage is written before navigation
        this.$nextTick(() => {
          this.$router.push(`/hotel/${this.hotel.id}`)
        })
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
      <div class="price-label">Per night</div>
      <div class="price">{{ formatPrice(hotel.pricePerNight) }}</div>
      <button @click="selectHotel" class="btn-primary select-btn">Select</button>
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
  grid-template-columns: minmax(150px, 1fr) 1fr 145px;
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 200px;
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
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

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
    font-size: 1.1rem;
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
    gap: 0.4rem;
    flex-wrap: wrap;

    @media (max-width: 968px) {
      gap: 0.35rem;
    }

    .rating-score {
      background: $color-accent;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.8rem;

      @media (max-width: 968px) {
        padding: 0.2rem 0.4rem;
        font-size: 0.75rem;
      }
    }

    .rating-reviews {
      color: $color-text-light;
      font-size: 0.8rem;

      @media (max-width: 968px) {
        font-size: 0.75rem;
      }
    }

    .hotel-stars {
      color: #ffa500;
      display: flex;
      gap: 1px;

      .star {
        font-size: 0.85rem;

        @media (max-width: 968px) {
          font-size: 0.75rem;
        }
      }
    }
  }
}

.hotel-price {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: $color-bg-light;
  border-left: 1px solid $color-light-grey;

  .price-label {
    color: $color-text-light;
    font-size: 0.85rem;
  }

  .price {
    font-size: 1.75rem;
    font-weight: 700;
    color: $color-text;
  }

  .select-btn {
    padding: 0.75rem 1.5rem;
    margin-top: 0.5rem;
    white-space: nowrap;
    font-size: 0.95rem;
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
