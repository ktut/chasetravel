<template>
  <div class="hotel-map-container">
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Hotel, SearchData } from '@/types/search'

export default defineComponent({
  name: 'HotelMap',
  props: {
    hotels: {
      type: Array as PropType<Hotel[]>,
      required: true
    },
    searchData: {
      type: Object as PropType<SearchData>,
      default: null
    }
  },
  data() {
    return {
      map: null as L.Map | null,
      markers: [] as L.Marker[]
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      // Initialize map centered on first hotel or default location
      const centerLat = this.hotels[0]?.coordinates.lat || 40.7128
      const centerLng = this.hotels[0]?.coordinates.lng || -74.006

      this.map = L.map(this.$refs.mapContainer as HTMLElement, {
        center: [centerLat, centerLng],
        zoom: 12,
        scrollWheelZoom: true,
        zoomControl: true
      })

      // Add OpenStreetMap tiles (no API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map as L.Map)

      this.updateMarkers()
    },

    updateMarkers() {
      if (!this.map) return

      // Clear existing markers
      this.markers.forEach((marker) => marker.remove())
      this.markers = []

      // Create marker bounds for auto-fitting
      const bounds = L.latLngBounds([])

      // Add markers for each hotel
      this.hotels.forEach((hotel) => {
        const marker = L.marker([hotel.coordinates.lat, hotel.coordinates.lng], {
          icon: this.createCustomIcon(hotel)
        })

        // Create popup with hotel info
        const popupContent = this.createPopupContent(hotel)
        marker.bindPopup(popupContent, {
          maxWidth: 280,
          className: 'hotel-map-popup'
        })

        marker.addTo(this.map as L.Map)
        this.markers.push(marker)
        bounds.extend([hotel.coordinates.lat, hotel.coordinates.lng])
      })

      // Fit map to show all markers
      if (this.hotels.length > 0 && this.map) {
        this.map.fitBounds(bounds, { padding: [50, 50] })
      }
    },

    createCustomIcon(hotel: Hotel) {
      // Create custom marker with price label
      const iconHtml = `
        <div class="custom-marker">
          <div class="marker-price">${this.formatPrice(hotel.pricePerNight)}</div>
        </div>
      `

      return L.divIcon({
        html: iconHtml,
        className: 'hotel-marker',
        iconSize: [60, 30],
        iconAnchor: [30, 30],
        popupAnchor: [0, -30] // Align popup to top of marker (negative of iconAnchor Y)
      })
    },

    createPopupContent(hotel: Hotel): HTMLElement {
      const container = document.createElement('div')
      container.className = 'hotel-popup-card'
      container.innerHTML = `
        <img src="${hotel.image}" alt="${hotel.name}" class="popup-image" />
        <div class="popup-details">
          <h4 class="popup-hotel-name">${hotel.name}</h4>
          <div class="popup-rating">
            <span class="rating-score">${hotel.rating}</span>
            <span class="rating-reviews">(${hotel.reviewCount} reviews)</span>
            <div class="popup-stars">${'★'.repeat(hotel.stars)}</div>
          </div>
          <div class="popup-price">
            <span class="price-amount">${this.formatPrice(hotel.pricePerNight)}</span>
            <span class="price-label">per night</span>
          </div>
          <button class="btn-primary popup-view-btn" data-hotel-id="${hotel.id}">
            View Details
          </button>
        </div>
      `

      // Add click handler for "View Details" button
      const viewBtn = container.querySelector('.popup-view-btn')
      viewBtn?.addEventListener('click', () => {
        this.navigateToHotel(hotel)
      })

      return container
    },

    navigateToHotel(hotel: Hotel) {
      // Store search data in sessionStorage (following existing pattern)
      try {
        if (this.searchData) {
          const searchDataJson = JSON.stringify(this.searchData)
          sessionStorage.setItem('confirmationSearchData', searchDataJson)
        }

        this.$router.push(`/hotel/${hotel.id}`)
      } catch (e) {
        console.error('Error navigating to hotel:', e)
      }
    },

    formatPrice(price: number): string {
      return `$${price.toLocaleString()}`
    }
  },

  watch: {
    hotels: {
      handler() {
        // Update markers when hotel list changes (due to filtering/sorting)
        if (this.map) {
          this.updateMarkers()
        }
      },
      deep: true
    }
  },

  beforeUnmount() {
    // Clean up map instance
    if (this.map) {
      this.map.remove()
      this.map = null
    }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.hotel-map-container {
  grid-area: map;
  position: sticky;
  top: 9rem;
  height: calc(100vh - 11rem);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid $color-light-grey;
  background: white;

  @media (max-width: 968px) {
    display: none; // Completely hidden on mobile
  }

  .map {
    width: 100%;
    height: 100%;
  }
}

// Custom marker styling
:deep(.hotel-marker) {
  background: transparent;
  border: none;

  .custom-marker {
    background: white;
    border: 2px solid $color-accent;
    border-radius: 20px;
    padding: 0.25rem 0.75rem;
    font-weight: 600;
    font-size: 0.85rem;
    color: $color-text;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: $color-accent;
      color: white;
      transform: scale(1.1);
    }

    .marker-price {
      line-height: 1;
    }
  }
}

// Popup card styling
:deep(.hotel-map-popup) {
  .leaflet-popup-content-wrapper {
    padding: 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .leaflet-popup-content {
    margin: 0;
    width: 280px !important;
  }

  .hotel-popup-card {
    display: flex;
    flex-direction: column;

    .popup-image {
      width: 100%;
      height: 140px;
      object-fit: cover;
    }

    .popup-details {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .popup-hotel-name {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
        color: $color-text;
      }

      .popup-rating {
        display: flex;
        align-items: center;
        gap: 0.4rem;

        .rating-score {
          background: $color-accent;
          color: white;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .rating-reviews {
          color: $color-text-light;
          font-size: 0.75rem;
        }

        .popup-stars {
          color: #ffa500;
          font-size: 0.75rem;
          margin-left: auto;
        }
      }

      .popup-price {
        display: flex;
        align-items: baseline;
        gap: 0.25rem;

        .price-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: $color-text;
        }

        .price-label {
          font-size: 0.8rem;
          color: $color-text-light;
        }
      }

      .popup-view-btn {
        width: 100%;
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
        margin-top: 0.25rem;
        background: $color-accent;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s;

        &:hover {
          background: color.scale($color-accent, $lightness: -29%);
        }
      }
    }
  }
}
</style>
