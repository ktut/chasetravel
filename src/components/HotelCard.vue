<script lang="ts">
import type { Hotel } from '@/types/search'

export default {
  name: 'HotelCard',
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

      // Store hotel and search data in sessionStorage for navigation
      try {
        const hotelJson = JSON.stringify(this.hotel)
        const searchDataJson = JSON.stringify(this.searchData)

        console.log('Storing in sessionStorage...')
        sessionStorage.setItem('selectedHotel', hotelJson)
        sessionStorage.setItem('confirmationSearchData', searchDataJson)

        // Verify it was stored
        const storedHotel = sessionStorage.getItem('selectedHotel')
        const storedSearch = sessionStorage.getItem('confirmationSearchData')
        console.log('Verification - Hotel in storage:', storedHotel ? 'YES' : 'NO')
        console.log('Verification - Search in storage:', storedSearch ? 'YES' : 'NO')

        console.log('Navigating to /confirmation...')
        // Use nextTick to ensure sessionStorage is written before navigation
        this.$nextTick(() => {
          this.$router.push('/confirmation')
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
        <div class="hotel-name">{{ hotel.name }}</div>
        <div class="hotel-stars">
          <span v-for="star in getStarsArray(hotel.stars)" :key="star" class="star">★</span>
        </div>
      </div>

      <div class="hotel-location">{{ hotel.location }}</div>

      <div class="hotel-rating">
        <span class="rating-score">{{ hotel.rating }}</span>
        <span class="rating-reviews">({{ hotel.reviewCount }} reviews)</span>
      </div>

      <div class="hotel-amenities">
        <span v-for="amenity in hotel.amenities" :key="amenity" class="amenity">{{ amenity }}</span>
      </div>
    </div>

    <div class="hotel-price">
      <div class="price-label">Per night</div>
      <div class="price">{{ formatPrice(hotel.pricePerNight) }}</div>
      <button @click="selectHotel" class="btn-primary select-btn">Select</button>
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
  grid-template-columns: 260px 1fr 200px;
  transition: all 0.2s;
  cursor: pointer;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: $color-accent;
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
    padding: 1rem;
  }
}

.hotel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  .hotel-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: $color-text;
    line-height: 1.3;
  }

  .hotel-stars {
    color: #ffa500;
    flex-shrink: 0;

    .star {
      font-size: 0.9rem;
    }
  }
}

.hotel-location {
  color: $color-text-light;
  font-size: 0.9rem;
}

.hotel-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .rating-score {
    background: $color-accent;
    color: white;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .rating-reviews {
    color: $color-text-light;
    font-size: 0.85rem;
  }
}

.hotel-amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;

  .amenity {
    background: $color-bg-light;
    padding: 0.25rem 0.65rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: $color-text-light;
    border: 1px solid $color-light-grey;
  }
}

.hotel-price {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0.5rem;
  background: $color-bg-light;
  border-left: 1px solid $color-light-grey;

  @media (max-width: 968px) {
    align-items: stretch;
    border-left: none;
    border-top: 1px solid $color-light-grey;
    padding: 1rem;
  }

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
</style>
