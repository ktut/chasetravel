<script lang="ts">
import Calendar from './Calendar.vue'

interface Location {
  name: string
  code: string
}

interface PassengerCounts {
  adults: number
  children: number
}

export default {
  name: 'SearchWidget',
  components: {
    Calendar
  },
  data() {
    return {
      searchType: 'flights' as 'flights' | 'hotels',
      location: '',
      destination: '',
      showLocationDropdown: false,
      showDestinationDropdown: false,
      passengerCounts: {
        adults: 1,
        children: 0
      } as PassengerCounts,
      showPassengerDropdown: false,
      checkInDate: null as Date | null,
      checkOutDate: null as Date | null,
      checkInFlexibility: 'exact' as string,
      checkOutFlexibility: 'exact' as string,
      // Sample locations for typeahead
      allLocations: [
        { name: 'New York, NY', code: 'NYC' },
        { name: 'Los Angeles, CA', code: 'LAX' },
        { name: 'Chicago, IL', code: 'ORD' },
        { name: 'San Francisco, CA', code: 'SFO' },
        { name: 'Miami, FL', code: 'MIA' },
        { name: 'Boston, MA', code: 'BOS' },
        { name: 'Seattle, WA', code: 'SEA' },
        { name: 'Las Vegas, NV', code: 'LAS' },
        { name: 'Orlando, FL', code: 'MCO' },
        { name: 'Denver, CO', code: 'DEN' },
        { name: 'Paris, France', code: 'CDG' },
        { name: 'London, UK', code: 'LHR' },
        { name: 'Tokyo, Japan', code: 'NRT' },
        { name: 'Dubai, UAE', code: 'DXB' },
        { name: 'Rome, Italy', code: 'FCO' }
      ] as Location[]
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
  },
  computed: {
    filteredLocations(): Location[] {
      if (!this.location) return this.allLocations
      const search = this.location.toLowerCase()
      return this.allLocations.filter(loc =>
        loc.name.toLowerCase().includes(search) ||
        loc.code.toLowerCase().includes(search)
      )
    },
    filteredDestinations(): Location[] {
      if (!this.destination) return this.allLocations
      const search = this.destination.toLowerCase()
      return this.allLocations.filter(loc =>
        loc.name.toLowerCase().includes(search) ||
        loc.code.toLowerCase().includes(search)
      )
    },
    totalPassengers(): number {
      return this.passengerCounts.adults + this.passengerCounts.children
    },
    passengerLabel(): string {
      const parts = []
      if (this.passengerCounts.adults > 0) {
        parts.push(`${this.passengerCounts.adults} Adult${this.passengerCounts.adults > 1 ? 's' : ''}`)
      }
      if (this.passengerCounts.children > 0) {
        parts.push(`${this.passengerCounts.children} Child${this.passengerCounts.children > 1 ? 'ren' : ''}`)
      }
      return parts.join(', ') || '0 Passengers'
    },
    locationLabel(): string {
      return this.searchType === 'flights' ? 'From' : 'Location'
    },
    showDestinationField(): boolean {
      return this.searchType === 'flights'
    }
  },
  methods: {
    handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('.location-input-wrapper')) {
        this.showLocationDropdown = false
        this.showDestinationDropdown = false
      }
      if (!target.closest('.passenger-selector')) {
        this.showPassengerDropdown = false
      }
    },
    selectLocation(location: Location) {
      this.location = location.name
      this.showLocationDropdown = false
    },
    selectDestination(location: Location) {
      this.destination = location.name
      this.showDestinationDropdown = false
    },
    onLocationInput() {
      this.showLocationDropdown = true
      this.showDestinationDropdown = false
    },
    onDestinationInput() {
      this.showDestinationDropdown = true
      this.showLocationDropdown = false
    },
    togglePassengerDropdown() {
      this.showPassengerDropdown = !this.showPassengerDropdown
    },
    incrementAdults() {
      if (this.passengerCounts.adults < 9) {
        this.passengerCounts.adults++
      }
    },
    decrementAdults() {
      if (this.passengerCounts.adults > 1) {
        this.passengerCounts.adults--
      }
    },
    incrementChildren() {
      if (this.passengerCounts.children < 9) {
        this.passengerCounts.children++
      }
    },
    decrementChildren() {
      if (this.passengerCounts.children > 0) {
        this.passengerCounts.children--
      }
    },
    handleDateRangeSelected(dateRange: {
      checkIn: Date | null,
      checkOut: Date | null,
      checkInFlexibility?: string,
      checkOutFlexibility?: string
    }) {
      this.checkInDate = dateRange.checkIn
      this.checkOutDate = dateRange.checkOut
      if (dateRange.checkInFlexibility) {
        this.checkInFlexibility = dateRange.checkInFlexibility
      }
      if (dateRange.checkOutFlexibility) {
        this.checkOutFlexibility = dateRange.checkOutFlexibility
      }
    },
    handleSubmit() {
      const searchData = {
        searchType: this.searchType,
        location: this.location,
        destination: this.searchType === 'flights' ? this.destination : null,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        checkInFlexibility: this.checkInFlexibility,
        checkOutFlexibility: this.checkOutFlexibility,
        passengers: {
          adults: this.passengerCounts.adults,
          children: this.passengerCounts.children,
          total: this.totalPassengers
        }
      }

      this.$emit('search-submitted', searchData)
    }
  }
}
</script>

<template>
  <div class="search-widget glass-effect">
    <!-- Search type toggle -->
    <div class="search-type-toggle">
      <button
        :class="['toggle-btn', { active: searchType === 'flights' }]"
        @click="searchType = 'flights'"
      >
        ✈ Flights
      </button>
      <button
        :class="['toggle-btn', { active: searchType === 'hotels' }]"
        @click="searchType = 'hotels'"
      >
        🏨 Hotels
      </button>
    </div>

    <!-- Location inputs -->
    <div class="search-inputs">
      <!-- From/Location field -->
      <div class="location-input-wrapper">
        <label class="input-label">{{ locationLabel }}</label>
        <input
          v-model="location"
          type="text"
          class="location-input"
          :placeholder="searchType === 'flights' ? 'Departure city' : 'Hotel location'"
          @input="onLocationInput"
          @focus="showLocationDropdown = true"
        />
        <div v-if="showLocationDropdown && filteredLocations.length > 0" class="location-dropdown">
          <div
            v-for="loc in filteredLocations"
            :key="loc.code"
            class="location-option"
            @click="selectLocation(loc)"
          >
            <span class="location-name">{{ loc.name }}</span>
            <span class="location-code">{{ loc.code }}</span>
          </div>
        </div>
      </div>

      <!-- To field (only for flights) -->
      <div v-if="showDestinationField" class="location-input-wrapper">
        <label class="input-label">To</label>
        <input
          v-model="destination"
          type="text"
          class="location-input"
          placeholder="Destination city"
          @input="onDestinationInput"
          @focus="showDestinationDropdown = true"
        />
        <div v-if="showDestinationDropdown && filteredDestinations.length > 0" class="location-dropdown">
          <div
            v-for="loc in filteredDestinations"
            :key="loc.code"
            class="location-option"
            @click="selectDestination(loc)"
          >
            <span class="location-name">{{ loc.name }}</span>
            <span class="location-code">{{ loc.code }}</span>
          </div>
        </div>
      </div>

      <!-- Passenger selector -->
      <div class="passenger-selector">
        <label class="input-label">Passengers</label>
        <button class="passenger-button" @click="togglePassengerDropdown">
          {{ passengerLabel }} ▾
        </button>
        <div v-if="showPassengerDropdown" class="passenger-dropdown">
          <div class="passenger-row">
            <span class="passenger-type">Adults</span>
            <div class="passenger-controls">
              <button class="control-btn" @click="decrementAdults" :disabled="passengerCounts.adults <= 1">-</button>
              <span class="passenger-count">{{ passengerCounts.adults }}</span>
              <button class="control-btn" @click="incrementAdults" :disabled="passengerCounts.adults >= 9">+</button>
            </div>
          </div>
          <div class="passenger-row">
            <span class="passenger-type">Children</span>
            <div class="passenger-controls">
              <button class="control-btn" @click="decrementChildren" :disabled="passengerCounts.children <= 0">-</button>
              <span class="passenger-count">{{ passengerCounts.children }}</span>
              <button class="control-btn" @click="incrementChildren" :disabled="passengerCounts.children >= 9">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar component -->
    <div class="calendar-section">
      <Calendar @date-range-selected="handleDateRangeSelected" />
    </div>

    <!-- Submit button -->
    <div class="submit-section">
      <button class="submit-btn" @click="handleSubmit">
        Search {{ searchType === 'flights' ? 'Flights' : 'Hotels' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-widget {
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-type-toggle {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;

  .toggle-btn {
    flex: 1;
    padding: 12px 24px;
    border: 1px solid #d0d0d0;
    background: white;
    border-radius: 4px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #f5f5f5;
      border-color: #2563eb;
    }

    &.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }
  }
}

.search-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.location-input-wrapper {
  position: relative;

  .input-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    margin-bottom: 6px;
  }

  .location-input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-size: 15px;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  .location-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;

    .location-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #f5f5f5;
      }

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }

      .location-name {
        font-size: 14px;
        color: #000;
      }

      .location-code {
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }
    }
  }
}

.passenger-selector {
  position: relative;

  .input-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #666;
    margin-bottom: 6px;
  }

  .passenger-button {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    background: white;
    font-size: 15px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #2563eb;
    }

    &:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  .passenger-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: white;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
    padding: 12px;

    .passenger-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;

      &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }

      .passenger-type {
        font-size: 14px;
        color: #000;
        font-weight: 500;
      }

      .passenger-controls {
        display: flex;
        align-items: center;
        gap: 12px;

        .control-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #d0d0d0;
          border-radius: 4px;
          background: white;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover:not(:disabled) {
            background: #f5f5f5;
            border-color: #2563eb;
          }

          &:disabled {
            color: #d0d0d0;
            cursor: not-allowed;
            opacity: 0.5;
          }
        }

        .passenger-count {
          font-size: 16px;
          font-weight: 500;
          min-width: 24px;
          text-align: center;
        }
      }
    }
  }
}

.calendar-section {
  margin-bottom: 24px;
}

.submit-section {
  display: flex;
  justify-content: flex-end;

  .submit-btn {
    padding: 14px 32px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #1d4ed8;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  }
}
</style>
