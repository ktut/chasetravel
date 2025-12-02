<script lang="ts">
import type { Flight } from '@/types/search'
import { getAirlineLogo } from '@/utils/airlineLogos'
import { formatTime } from '@/utils/formatters'

export default {
  name: 'FlightSegment',
  props: {
    flight: {
      type: Object as () => Flight,
      required: true
    },
    showStops: {
      type: Boolean,
      default: true
    },
    variant: {
      type: String as () => 'card' | 'booking',
      default: 'card'
    },
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    airlineLogo() {
      return getAirlineLogo(this.flight.airline)
    }
  },
  methods: {
    formatTime
  }
}
</script>

<template>
  <div class="flight-segment" :class="`variant-${variant}`">
    <div class="flight-info-wrapper">
      <img v-if="airlineLogo" :src="airlineLogo" :alt="flight.airline" class="airline-logo" />
      <div class="flight-info">
        <div v-if="label" class="leg-label">{{ label }}</div>
        <div v-if="variant === 'card'" class="flight-times">
          {{ formatTime(flight.departure.time) }} - {{ formatTime(flight.arrival.time) }}
        </div>
        <h3 v-else class="flight-route">
          {{ flight.departure.airport }} → {{ flight.arrival.airport }}
        </h3>
        <div class="airline-name">{{ flight.airline }}</div>
        <div v-if="variant === 'booking'" class="flight-meta">
          <span>{{ flight.airline }} {{ flight.flightNumber }}</span>
          <span class="separator">•</span>
          <span class="time">{{ flight.departure.time }}</span>
          <span class="separator">→</span>
          <span class="time">{{ flight.arrival.time }}</span>
          <span class="separator">•</span>
          <span class="duration">{{ flight.duration }}</span>
        </div>
      </div>
    </div>

    <div v-if="showStops && variant === 'card'" class="flight-stops">
      <span v-if="flight.stops === 0">nonstop</span>
      <span v-else>{{ flight.stops }} stop{{ flight.stops > 1 ? 's' : '' }}</span>
    </div>

    <div v-if="variant === 'card'" class="flight-details">
      <div class="duration">{{ flight.duration }}</div>
      <div class="route">{{ flight.departure.airport }}-{{ flight.arrival.airport }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flight-segment {
  display: grid;
  gap: 1.5rem;
  align-items: center;

  &.variant-card {
    grid-template-columns: 220px 140px 140px;
    gap: 1.5rem;

    @media (max-width: 1024px) {
      grid-template-columns: 180px 120px 120px;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr auto;
      gap: 1rem;
    }
  }

  &.variant-booking {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
}

.flight-info-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.airline-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;

  .variant-booking & {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;

    .variant-booking & {
      width: 80px;
      height: 80px;
    }
  }
}

.flight-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;

  .variant-booking & {
    gap: 0.4rem;
  }
}

.flight-times {
  font-size: 1.125rem;
  font-weight: 700;
  color: $color-text;
  white-space: nowrap;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.flight-route {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.4rem 0;
  color: $color-primary;
}

.airline-name {
  font-size: 0.875rem;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
}

.flight-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;

  .separator {
    color: #ccc;
  }

  .time {
    font-weight: 600;
    color: $color-primary;
  }

  .duration {
    color: #999;
  }
}

.leg-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: $color-accent;
  margin-bottom: 0.25rem;
  letter-spacing: 0.5px;
}

.flight-stops {
  text-align: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: $color-text;

  @media (max-width: 1024px) {
    display: none;
  }
}

.flight-details {
  display: flex;
  flex-direction: column;
  text-align: left;

  @media (max-width: 768px) {
    text-align: right;
  }

  .duration {
    font-size: 0.95rem;
    font-weight: 400;
    color: $color-text;
  }

  .route {
    font-size: 0.95rem;
    font-weight: 400;
    color: #6b7280;
  }
}
</style>

