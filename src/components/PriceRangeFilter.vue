<script lang="ts">
import { formatPrice } from '@/utils/formatters'
import type { Flight, Hotel } from '@/types/search'

export default {
  name: 'PriceRangeFilter',
  props: {
    results: {
      type: Array as () => (Flight | Hotel | any)[],
      required: true
    },
    minPrice: {
      type: Number,
      required: true
    },
    maxPrice: {
      type: Number,
      required: true
    },
    modelValue: {
      type: Array as unknown as () => [number, number],
      required: true
    },
    priceKey: {
      type: String as () => 'price' | 'pricePerNight' | 'totalPrice',
      default: 'price'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      localMin: this.modelValue[0],
      localMax: this.modelValue[1],
      isDraggingMin: false,
      isDraggingMax: false
    }
  },
  computed: {
    numBuckets(): number {
      const range = this.maxPrice - this.minPrice
      if (range <= 100) return 20
      if (range <= 500) return 30
      return 40
    },
    priceDistribution(): number[] {
      const buckets = new Array(this.numBuckets).fill(0)
      const bucketSize = (this.maxPrice - this.minPrice) / this.numBuckets

      this.results.forEach((result: any) => {
        const price = result[this.priceKey]
        if (price !== undefined && price >= this.minPrice && price <= this.maxPrice) {
          let bucketIndex = Math.floor((price - this.minPrice) / bucketSize)
          // Handle edge case where price equals maxPrice
          if (bucketIndex >= this.numBuckets) {
            bucketIndex = this.numBuckets - 1
          }
          buckets[bucketIndex]++
        }
      })

      return buckets
    },
    maxBucketCount(): number {
      return Math.max(...this.priceDistribution, 1)
    },
    nonZeroBars(): number {
      return this.priceDistribution.filter(count => count > 0).length
    },
    shouldShowSlider(): boolean {
      return this.nonZeroBars >= 10
    },
    minPercent(): number {
      return ((this.localMin - this.minPrice) / (this.maxPrice - this.minPrice)) * 100
    },
    maxPercent(): number {
      return ((this.localMax - this.minPrice) / (this.maxPrice - this.minPrice)) * 100
    },
    labelPositions(): { minTransform: string; maxTransform: string; minLeft: string; maxLeft: string } {
      const minPercent = this.minPercent
      const maxPercent = this.maxPercent
      
      // Estimate label widths (approximately 8-9 pixels per character)
      const minLabel = this.formatPrice(this.localMin)
      const maxLabel = this.formatPrice(this.localMax)
      const minWidth = minLabel.length * 8.5
      const maxWidth = maxLabel.length * 8.5
      const minGap = 16 // minimum gap between labels in pixels
      
      // Assume a typical container width of 250px for percentage calculations
      const containerWidth = 250
      const percentDiff = maxPercent - minPercent
      const pixelDiff = (percentDiff / 100) * containerWidth
      
      // Calculate space needed for centered labels
      const spaceNeeded = (minWidth / 2) + (maxWidth / 2) + minGap
      
      // Always try to center, but adjust if they would overlap
      if (pixelDiff < spaceNeeded) {
        // Labels would overlap if centered, adjust to prevent overlap
        const adjustment = ((spaceNeeded - pixelDiff) / containerWidth) * 50 // Convert to percentage adjustment
        
        return {
          minLeft: Math.max(0, minPercent - adjustment) + '%',
          minTransform: 'translateX(-50%)',
          maxLeft: Math.min(100, maxPercent + adjustment) + '%',
          maxTransform: 'translateX(-50%)'
        }
      } else {
        // Labels have enough space, center them under handles
        return {
          minLeft: minPercent + '%',
          minTransform: 'translateX(-50%)',
          maxLeft: maxPercent + '%',
          maxTransform: 'translateX(-50%)'
        }
      }
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.localMin = newVal[0]
        this.localMax = newVal[1]
      },
      deep: true
    }
  },
  methods: {
    formatPrice,
    getBarHeight(count: number): number {
      if (count === 0) return 0
      // Use a minimum of 15% height for visibility, then scale to 100%
      const minHeight = 15
      const scaledHeight = ((count / this.maxBucketCount) * (100 - minHeight)) + minHeight
      return Math.max(scaledHeight, minHeight)
    },
    isBarInRange(index: number): boolean {
      const bucketSize = (this.maxPrice - this.minPrice) / this.numBuckets
      const bucketStart = this.minPrice + (index * bucketSize)
      const bucketEnd = this.minPrice + ((index + 1) * bucketSize)
      // Check if bucket overlaps with selected range
      return bucketStart <= this.localMax && bucketEnd >= this.localMin
    },
    updateMin(event: Event) {
      const target = event.target as HTMLInputElement
      const value = Math.round(parseFloat(target.value))
      this.localMin = Math.min(value, this.localMax)
      this.emitUpdate()
    },
    updateMax(event: Event) {
      const target = event.target as HTMLInputElement
      const value = Math.round(parseFloat(target.value))
      this.localMax = Math.max(value, this.localMin)
      this.emitUpdate()
    },
    emitUpdate() {
      this.$emit('update:modelValue', [Math.round(this.localMin), Math.round(this.localMax)])
    }
  }
}
</script>

<template>
  <div class="price-range-filter">
    <div class="histogram-container">
      <div v-if="shouldShowSlider" class="histogram">
        <div
          v-for="(count, index) in priceDistribution"
          :key="index"
          class="bar"
          :class="{ 'in-range': isBarInRange(index), 'empty': count === 0 }"
          :style="{ height: count > 0 ? getBarHeight(count) + '%' : '0' }"
        ></div>
      </div>

      <div class="slider-container">
        <div class="slider-track">
          <div 
            class="slider-range" 
            :style="{ left: minPercent + '%', width: (maxPercent - minPercent) + '%' }"
          ></div>
        </div>
        <input
          type="range"
          :min="minPrice"
          :max="maxPrice"
          :value="localMin"
          step="1"
          @input="updateMin"
          class="slider slider-min"
        />
        <input
          type="range"
          :min="minPrice"
          :max="maxPrice"
          :value="localMax"
          step="1"
          @input="updateMax"
          class="slider slider-max"
        />
      </div>

      <div class="price-range-display">
        <span 
          class="price-label price-label-min" 
          :style="{ left: labelPositions.minLeft, transform: labelPositions.minTransform }"
        >
          {{ formatPrice(localMin) }}
        </span>
        <span 
          class="price-label price-label-max" 
          :style="{ left: labelPositions.maxLeft, transform: labelPositions.maxTransform }"
        >
          {{ formatPrice(localMax) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/global.scss' as *;

.price-range-filter {
  display: flex;
  flex-direction: column;
}

.histogram-container {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.histogram {
  display: flex;
  align-items: flex-end;
  gap: 1px;
  height: 62px;
  width: 100%;
  padding-bottom: 2px;
  margin-bottom: 0;

  .bar {
    flex: 1;
    min-width: 0;
    background: $color-light-grey;
    opacity: 0.4;
    border-radius: 2px 2px 0 0;
    transition: all 0.2s ease;

    &.in-range {
      background: $color-accent;
      opacity: 0.7;
    }

    &.empty {
      opacity: 0;
    }
  }
}

.slider-container {
  position: relative;
  height: 20px;
  width: 100%;
  margin-top: -2px;
}

.slider-track {
  position: absolute;
  left: 0;
  right: 0;
  height: 4px;
  background: $color-light-grey;
  border-radius: 2px;
  top: 0;
  z-index: 1;

  .slider-range {
    position: absolute;
    height: 100%;
    background: $color-accent;
    border-radius: 2px;
    z-index: 2;
  }
}

.slider {
  position: absolute;
  width: 100%;
  height: 20px;
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  top: -8px;
  left: 0;
  margin: 0;
  padding: 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    border: 3px solid $color-accent;
    cursor: pointer;
    pointer-events: all;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
    margin-top: -7px;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: scale(1.05);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    border: 3px solid $color-accent;
    cursor: pointer;
    pointer-events: all;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
    }

    &:active {
      transform: scale(1.05);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
    }
  }

  &::-webkit-slider-runnable-track {
    background: transparent;
    height: 4px;
    border: none;
  }

  &::-moz-range-track {
    background: transparent;
    height: 4px;
    border: none;
  }
}

.slider-min {
  z-index: 5;
}

.slider-max {
  z-index: 6;
}

.price-range-display {
  position: relative;
  width: 100%;
  height: 24px;
  margin-top: 0.25rem;

  .price-label {
    position: absolute;
    font-size: 0.875rem;
    color: $color-text;
    font-weight: 600;
    white-space: nowrap;
    transition: left 0.15s ease, transform 0.15s ease;
  }
}
</style>

