<script lang="ts">
import { getHotelById, getMockRoomsForHotel } from '@/services/MockHotelResults'
import { parseSearchDataFromQuery } from '@/types/search'
import type { Hotel, Room, SearchData } from '@/types/search'
import AmenityPills from '@/components/AmenityPills.vue'

export default {
  name: 'HotelView',
  components: {
    AmenityPills
  },
  data() {
    return {
      hotel: null as Hotel | null,
      rooms: [] as Room[],
      searchData: null as SearchData | null,
      selectedBedFilter: 'all' as 'all' | '2' | '3+',
      currentRoomImageIndex: {} as Record<number, number>,
      numberOfNights: 1,
      showLightbox: false,
      currentLightboxIndex: 0,
      touchStartX: 0,
      touchEndX: 0,
      touchCurrentX: 0,
      isSwiping: false,
      swipeOffset: 0,
      transitioning: false
    }
  },
  computed: {
    filteredRooms(): Room[] {
      if (this.selectedBedFilter === 'all') {
        return this.rooms
      } else if (this.selectedBedFilter === '2') {
        return this.rooms.filter(room => room.bedCount === 2)
      } else {
        return this.rooms.filter(room => room.bedCount >= 3)
      }
    },
    mainImage(): string {
      if (!this.hotel || !this.hotel.images || this.hotel.images.length === 0) {
        return this.hotel?.image || ''
      }
      return this.hotel.images[0]
    },
    thumbnailImages(): string[] {
      if (!this.hotel || !this.hotel.images || this.hotel.images.length <= 1) {
        return []
      }
      return this.hotel.images.slice(1, 5)
    },
    totalImages(): number {
      return this.hotel?.images?.length || 0
    },
    allImages(): string[] {
      return this.hotel?.images || []
    },
    currentLightboxImage(): string {
      if (!this.hotel || !this.hotel.images || this.hotel.images.length === 0) {
        return ''
      }
      return this.hotel.images[this.currentLightboxIndex] || this.hotel.images[0]
    },
    lightboxImageStyle(): string {
      if (!this.hotel || !this.hotel.images) {
        return 'transform: translateX(0);'
      }
      
      const baseOffset = -(this.currentLightboxIndex * 100)
      const currentOffset = this.isSwiping && !this.transitioning 
        ? baseOffset + (this.swipeOffset / window.innerWidth * 100)
        : baseOffset
      
      if (this.isSwiping && !this.transitioning) {
        return `transform: translateX(calc(${currentOffset}vw)); transition: none;`
      }
      return `transform: translateX(calc(${currentOffset}vw)); transition: transform 0.3s ease;`
    },
    starsArray(): number[] {
      if (!this.hotel) return []
      return Array.from({ length: this.hotel.stars }, (_, i) => i)
    },
    emptyStarsArray(): number[] {
      if (!this.hotel) return []
      const empty = 5 - this.hotel.stars
      return Array.from({ length: empty }, (_, i) => i)
    },
    googleMapsUrl(): string {
      if (!this.hotel) return ''
      const { lat, lng } = this.hotel.coordinates
      return `https://www.google.com/maps?q=${lat},${lng}`
    },
    googleMapsEmbedUrl(): string {
      if (!this.hotel) return ''
      const { lat, lng } = this.hotel.coordinates
      // Use Google Maps embed without API key (may have limitations but works for demo)
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841320930243!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}%2C${lng}!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`
    }
  },
  mounted() {
    this.loadHotelData()
    // Add keyboard listeners for lightbox
    document.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    // Remove keyboard listeners
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  watch: {
    '$route.params': {
      handler() {
        this.loadHotelData()
      },
      deep: true
    }
  },
  methods: {
    loadHotelData() {
      const hotelId = parseInt(this.$route.params.id as string)
      
      if (isNaN(hotelId)) {
        this.$router.push('/search')
        return
      }

      // Try to get search data from query params first, then sessionStorage
      let searchData: SearchData | null = null
      
      if (this.$route.query.type) {
        searchData = parseSearchDataFromQuery(this.$route.query)
      } else {
        const stored = sessionStorage.getItem('confirmationSearchData')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            // Convert date strings back to Date objects
            parsed.checkIn = new Date(parsed.checkIn)
            parsed.checkOut = new Date(parsed.checkOut)
            searchData = parsed
          } catch (e) {
            console.error('Error parsing search data:', e)
          }
        }
      }

      if (!searchData) {
        this.$router.push('/search')
        return
      }

      // Store search data in sessionStorage
      sessionStorage.setItem('confirmationSearchData', JSON.stringify(searchData))

      // Calculate number of nights
      const checkIn = new Date(searchData.checkIn)
      const checkOut = new Date(searchData.checkOut)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      this.numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

      // Get hotel by ID
      const hotel = getHotelById(hotelId, searchData)
      
      if (!hotel) {
        this.$router.push('/search')
        return
      }

      this.hotel = hotel
      this.searchData = searchData

      // Load rooms for this hotel
      this.rooms = getMockRoomsForHotel(hotelId)
      
      // Initialize image indices
      this.rooms.forEach(room => {
        this.currentRoomImageIndex[room.id] = 0
      })
    },
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
    goBack() {
      this.$router.back()
    },
    selectBedFilter(filter: 'all' | '2' | '3+') {
      this.selectedBedFilter = filter
    },
    getRoomTotalPrice(room: Room): number {
      return room.pricePerNight * this.numberOfNights
    },
    getRoomOriginalTotalPrice(room: Room): number | null {
      if (!room.originalPrice) return null
      return room.originalPrice * this.numberOfNights
    },
    nextRoomImage(roomId: number) {
      const room = this.rooms.find(r => r.id === roomId)
      if (!room) return
      const currentIndex = this.currentRoomImageIndex[roomId] || 0
      const nextIndex = (currentIndex + 1) % room.images.length
      this.currentRoomImageIndex[roomId] = nextIndex
    },
    prevRoomImage(roomId: number) {
      const room = this.rooms.find(r => r.id === roomId)
      if (!room) return
      const currentIndex = this.currentRoomImageIndex[roomId] || 0
      const prevIndex = (currentIndex - 1 + room.images.length) % room.images.length
      this.currentRoomImageIndex[roomId] = prevIndex
    },
    getCurrentRoomImage(roomId: number): string {
      const room = this.rooms.find(r => r.id === roomId)
      if (!room) return ''
      const index = this.currentRoomImageIndex[roomId] || 0
      return room.images[index] || room.images[0] || ''
    },
    reserveRoom(room: Room) {
      if (!this.hotel || !this.searchData) return

      // Store hotel, room, and search data in sessionStorage
      try {
        sessionStorage.setItem('selectedHotel', JSON.stringify(this.hotel))
        sessionStorage.setItem('selectedRoom', JSON.stringify(room))
        sessionStorage.setItem('confirmationSearchData', JSON.stringify(this.searchData))

        // Navigate to confirmation
        this.$router.push('/confirmation')
      } catch (e) {
        console.error('Error storing reservation data:', e)
      }
    },
    openLightbox(index: number) {
      if (!this.hotel || !this.hotel.images) return
      this.currentLightboxIndex = index
      this.showLightbox = true
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden'
    },
    closeLightbox() {
      this.showLightbox = false
      // Restore body scroll
      document.body.style.overflow = ''
    },
    nextLightboxImage() {
      if (!this.hotel || !this.hotel.images) return
      this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.hotel.images.length
    },
    prevLightboxImage() {
      if (!this.hotel || !this.hotel.images) return
      this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.hotel.images.length) % this.hotel.images.length
    },
    handleKeyDown(event: KeyboardEvent) {
      if (!this.showLightbox) return
      
      if (event.key === 'Escape') {
        this.closeLightbox()
      } else if (event.key === 'ArrowRight') {
        this.nextLightboxImage()
      } else if (event.key === 'ArrowLeft') {
        this.prevLightboxImage()
      }
    },
    handleTouchStart(event: TouchEvent) {
      if (!this.showLightbox || this.transitioning) return
      this.isSwiping = true
      this.touchStartX = event.touches[0].clientX
      this.touchCurrentX = event.touches[0].clientX
      this.swipeOffset = 0
    },
    handleTouchMove(event: TouchEvent) {
      if (!this.showLightbox || !this.isSwiping || this.transitioning) return
      this.touchCurrentX = event.touches[0].clientX
      this.swipeOffset = this.touchCurrentX - this.touchStartX
    },
    handleTouchEnd(event: TouchEvent) {
      if (!this.showLightbox || !this.isSwiping) return
      this.isSwiping = false
      this.touchEndX = event.changedTouches[0].clientX
      this.handleSwipe()
    },
    handleSwipe() {
      const swipeThreshold = 50
      const diff = this.touchStartX - this.touchEndX
      
      // Reset swipe offset
      this.swipeOffset = 0
      this.transitioning = true
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next image
          this.nextLightboxImage()
        } else {
          // Swipe right - previous image
          this.prevLightboxImage()
        }
      }
      
      // Re-enable transitions after animation completes
      setTimeout(() => {
        this.transitioning = false
      }, 300)
    },
    getCurrentRoomImageIndex(roomId: number): number {
      return this.currentRoomImageIndex[roomId] || 0
    }
  }
}
</script>

<template>
  <div class="hotel-view" v-if="hotel">
    <div class="hotel-container">
      <!-- Back Button -->
      <button @click="goBack" class="back-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        See all properties
      </button>

      <!-- Image Gallery -->
      <div class="image-gallery">
        <div class="main-image" @click="openLightbox(0)">
          <img :src="mainImage" :alt="hotel.name" />
        </div>
        <div class="thumbnail-grid">
          <div 
            v-for="(thumb, index) in thumbnailImages" 
            :key="index"
            class="thumbnail"
            @click="openLightbox(index + 1)"
          >
            <img :src="thumb" :alt="hotel.name" />
          </div>
          <div v-if="totalImages > 5" class="thumbnail more-images" @click="openLightbox(4)">
            <img :src="hotel.images[4]" :alt="hotel.name" />
            <div class="more-overlay">{{ totalImages - 5 }}+</div>
          </div>
        </div>
      </div>

      <!-- Lightbox -->
      <div 
        v-if="showLightbox" 
        class="lightbox"
        @click="closeLightbox"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <button class="lightbox-close" @click.stop="closeLightbox" aria-label="Close lightbox">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
        <button 
          class="lightbox-nav lightbox-prev" 
          @click.stop="prevLightboxImage"
          v-if="totalImages > 1"
          aria-label="Previous image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div class="lightbox-content" @click.stop>
          <div 
            class="lightbox-images-container" 
            :style="lightboxImageStyle"
          >
            <img 
              v-for="(image, index) in allImages" 
              :key="index"
              :src="image" 
              :alt="hotel.name"
              :class="{ 'lightbox-image-active': index === currentLightboxIndex }"
              class="lightbox-image"
            />
          </div>
          <div class="lightbox-counter" v-if="totalImages > 1">
            {{ currentLightboxIndex + 1 }} / {{ totalImages }}
          </div>
        </div>
        <button 
          class="lightbox-nav lightbox-next" 
          @click.stop="nextLightboxImage"
          v-if="totalImages > 1"
          aria-label="Next image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Left Column: Property Info and Rooms -->
        <div class="left-column">
          <!-- Property Info -->
          <div class="property-info">
            <div class="property-header">
              <span class="vip-badge" v-if="hotel.stars >= 5">VIP Access</span>
              <h1 class="property-name">{{ hotel.name }}</h1>
            </div>
            
            <div class="property-meta">
              <div class="stars">
                <span v-for="star in starsArray" :key="star" class="star filled">★</span>
                <span v-for="star in emptyStarsArray" :key="star" class="star empty">☆</span>
              </div>
              <div class="booking-feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Reserve now, pay later.
              </div>
              <div class="rating-badge">
                <span class="rating-score">{{ hotel.rating.toFixed(1) }}</span>
                <span class="rating-label">Wonderful.</span>
              </div>
            </div>

            <div class="about-section">
              <h2>About this property</h2>
              <p class="description">City-center hotel within walking distance of Merchandise Mart.</p>
              <AmenityPills :amenities="hotel.amenities" />
            </div>
          </div>

          <!-- Room Selection -->
          <div class="room-selection">
            <h2>Choose your room</h2>
            <div class="room-filters">
              <button 
                class="filter-btn" 
                :class="{ active: selectedBedFilter === 'all' }"
                @click="selectBedFilter('all')"
              >
                All rooms
              </button>
              <button 
                class="filter-btn" 
                :class="{ active: selectedBedFilter === '2' }"
                @click="selectBedFilter('2')"
              >
                2 beds
              </button>
              <button 
                class="filter-btn" 
                :class="{ active: selectedBedFilter === '3+' }"
                @click="selectBedFilter('3+')"
              >
                3+ beds
              </button>
            </div>
            
            <div class="rooms-count">Showing {{ filteredRooms.length }} of {{ rooms.length }} rooms</div>

            <div class="rooms-list">
              <div v-for="room in filteredRooms" :key="room.id" class="room-card">
                <div class="room-image-container">
                  <img :src="getCurrentRoomImage(room.id)" :alt="room.name" />
                </div>
                
                <div class="room-details">
                  <h3 class="room-name">{{ room.name }}</h3>
                  <div class="room-capacity">{{ room.capacity }}</div>
                  <div class="room-beds">{{ room.bedConfig }}</div>
                  <div class="room-features">
                    <span v-for="feature in room.features" :key="feature" class="feature">{{ feature }}</span>
                  </div>
                  
                  <div class="room-pricing">
                    <div v-if="room.discount" class="discount-badge">{{ room.discount }} off</div>
                    <div class="price-info">
                      <div v-if="room.originalPrice" class="original-price">{{ formatPrice(room.originalPrice) }} nightly</div>
                      <div class="total-price">
                        <span v-if="getRoomOriginalTotalPrice(room)" class="strikethrough">{{ formatPrice(getRoomOriginalTotalPrice(room)!) }}</span>
                        <span class="current-total">{{ formatPrice(getRoomTotalPrice(room)) }} total</span>
                      </div>
                      <div class="price-note">✓ Total includes taxes and fees</div>
                      <div class="payment-option">Pay over time with affirm</div>
                    </div>
                  </div>

                  <div class="room-availability">We have {{ room.availability }} left.</div>
                  
                  <button @click="reserveRoom(room)" class="btn-primary reserve-btn">
                    Reserve
                  </button>
                  <div class="charge-note">You will not be charged yet.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Map -->
        <div class="right-column">
          <div class="explore-area">
            <h2>Explore the area.</h2>
            <div class="map-container">
              <iframe
                :src="googleMapsEmbedUrl"
                width="100%"
                height="100%"
                style="border:0;"
                :allowfullscreen="true"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div class="address">{{ hotel.address }}</div>
            <a :href="googleMapsUrl" target="_blank" class="map-link">
              View in a map
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hotel-view {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16rem 1.5rem 2rem;

  @media (max-width: 768px) {
    padding: 11rem 1rem 1rem;
  }
}

.hotel-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: $color-accent;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 0;
  transition: all 0.2s;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: #004a94;
    transform: translateX(-2px);
  }
}

.image-gallery {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0.5rem;
  height: 400px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }

  .main-image {
    cursor: pointer;
    overflow: hidden;
    border-radius: 8px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.02);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .thumbnail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
      margin-top: 0.5rem;
    }

      .thumbnail {
        position: relative;
        cursor: pointer;
        overflow: hidden;
        border-radius: 8px;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.05);
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          min-height: 98px;
        }

      &.more-images {
        .more-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.25rem;
        }
      }
    }
  }
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
  touch-action: pan-y;

  .lightbox-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
    z-index: 10001;

    @media (max-width: 768px) {
      top: 0.5rem;
      right: 0.5rem;
      width: 40px;
      height: 40px;
    }

    svg {
      width: 24px;
      height: 24px;

      @media (max-width: 768px) {
        width: 20px;
        height: 20px;
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: all 0.2s;
    z-index: 10001;

    @media (max-width: 768px) {
      width: 40px;
      height: 40px;
      opacity: 0.8;
    }

    svg {
      width: 24px;
      height: 24px;

      @media (max-width: 768px) {
        width: 20px;
        height: 20px;
      }
    }

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-50%) scale(1.1);
    }

    &:active {
      transform: translateY(-50%) scale(0.95);
    }

    &.lightbox-prev {
      left: 1rem;

      @media (max-width: 768px) {
        left: 0.5rem;
      }
    }

    &.lightbox-next {
      right: 1rem;

      @media (max-width: 768px) {
        right: 0.5rem;
      }
    }
  }

  .lightbox-content {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    .lightbox-images-container {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      will-change: transform;

      .lightbox-image {
        flex: 0 0 100%;
        width: 100vw;
        max-width: 100vw;
        max-height: 100vh;
        object-fit: contain;
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
        pointer-events: none;
      }
    }

    .lightbox-counter {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 24px;
      font-size: 0.9rem;
      font-weight: 500;

      @media (max-width: 768px) {
        bottom: 1rem;
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

.property-info {
  .property-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .vip-badge {
      background: black;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      width: fit-content;
      text-transform: uppercase;
    }

    .property-name {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: $color-primary;
    }
  }

  .property-meta {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;

    .stars {
      .star {
        font-size: 1.25rem;
        margin-right: 2px;

        &.filled {
          color: #ffa500;
        }

        &.empty {
          color: #ddd;
        }
      }
    }

    .booking-feature {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #0a8a4e;
      font-size: 0.9rem;

      svg {
        width: 18px;
        height: 18px;
        color: #0a8a4e;
      }
    }

    .rating-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .rating-score {
        background: #0a8a4e;
        color: white;
        padding: 0.4rem 0.75rem;
        border-radius: 6px;
        font-weight: 700;
        font-size: 1rem;
      }

      .rating-label {
        color: $color-text-light;
        font-size: 0.9rem;
      }
    }
  }

  .about-section {
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      color: $color-primary;
    }

    .description {
      color: $color-text-light;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
  }
}

.room-selection {
  margin-top: 3rem;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1.5rem 0;
    color: $color-primary;
  }

  .room-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    .filter-btn {
      padding: 0.5rem 1.5rem;
      border: 2px solid $color-light-grey;
      background: white;
      border-radius: 24px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;

      &.active {
        border-color: $color-accent;
        background: $color-accent;
        color: white;
      }

      &:hover:not(.active) {
        border-color: $color-accent;
      }
    }
  }

  .rooms-count {
    color: $color-text-light;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .rooms-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    @media (max-width: 968px) {
      grid-template-columns: 1fr;
    }
  }

  .room-card {
    display: block;
    grid-template-columns: 300px 1fr;
    gap: 1.5rem;
    border: 1px solid $color-light-grey;
    border-radius: 8px;
    padding: 1.5rem;
    transition: all 0.2s;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
    }

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .room-image-container {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      height: 200px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .room-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;

      .room-name {
        font-size: 1.25rem;
        font-weight: 600;
        margin: 0;
        color: $color-primary;
      }

      .room-capacity {
        font-weight: 500;
        color: $color-text;
      }

      .room-beds {
        color: $color-text-light;
        font-size: 0.9rem;
      }

      .room-features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin: 0.5rem 0;

        .feature {
          color: $color-text;
          font-size: 0.85rem;
        }
      }

      .more-details {
        color: $color-accent;
        text-decoration: none;
        font-size: 0.9rem;
        width: fit-content;

        &:hover {
          text-decoration: underline;
        }
      }

      .room-pricing {
        margin: 1rem 0;

        .discount-badge {
          background: #d32f2f;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          width: fit-content;
          margin-bottom: 0.5rem;
        }

        .price-info {
          .original-price {
            text-decoration: line-through;
            color: $color-text-light;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
          }

          .total-price {
            display: flex;
            align-items: baseline;
            gap: 0.5rem;
            margin-bottom: 0.5rem;

            .strikethrough {
              text-decoration: line-through;
              color: $color-text-light;
              font-size: 1rem;
            }

            .current-total {
              font-size: 1.5rem;
              font-weight: 700;
              color: $color-primary;
            }
          }

          .price-note {
            color: $color-text-light;
            font-size: 0.85rem;
            margin-bottom: 0.25rem;
          }

          .payment-option {
            color: $color-text-light;
            font-size: 0.85rem;
          }
        }
      }

      .room-availability {
        color: $color-text-light;
        font-size: 0.9rem;
      }

      .reserve-btn {
        margin-top: 0.5rem;
        padding: 0.75rem 2rem;
        width: fit-content;
      }

      .charge-note {
        color: $color-text-light;
        font-size: 0.85rem;
      }
    }
  }
}

.explore-area {
  background: white;
  border: 1px solid $color-light-grey;
  border-radius: 8px;
  padding: 1.5rem;
  position: sticky;
  top: 120px;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 1rem 0;
    color: $color-primary;
  }

  .map-container {
    width: 100%;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 1rem;

    iframe {
      width: 100%;
      height: 100%;
    }
  }

  .address {
    color: $color-text;
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    line-height: 1.5;
  }

  .map-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: $color-accent;
    text-decoration: none;
    font-size: 0.9rem;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

