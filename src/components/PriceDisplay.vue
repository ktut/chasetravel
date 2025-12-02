<script lang="ts">
import { formatPrice } from '@/utils/formatters'

export default {
  name: 'PriceDisplay',
  props: {
    price: {
      type: Number,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    showTotal: {
      type: Boolean,
      default: false
    },
    totalPrice: {
      type: Number,
      default: null
    },
    totalLabel: {
      type: String,
      default: 'Total'
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium'
    },
    variant: {
      type: String as () => 'default' | 'compact' | 'inline',
      default: 'default'
    }
  },
  methods: {
    formatPrice
  }
}
</script>

<template>
  <div class="price-display" :class="[`size-${size}`, `variant-${variant}`]">
    <div v-if="variant === 'default'" class="price-info">
      <div class="price-per-night">
        <span class="price-amount">{{ formatPrice(price) }}</span>
        <span v-if="label" class="price-label">{{ label }}</span>
      </div>
      <div v-if="showTotal && totalPrice !== null" class="price-total">
        <span class="total-label">{{ totalLabel }}: </span>
        <span class="total-amount">{{ formatPrice(totalPrice) }}</span>
      </div>
    </div>
    <div v-else-if="variant === 'compact'" class="price-compact">
      <span class="price-amount">{{ formatPrice(price) }}</span>
      <span v-if="label" class="price-label">{{ label }}</span>
    </div>
    <div v-else-if="variant === 'inline'" class="price-inline">
      <span class="price-amount">{{ formatPrice(price) }}</span>
      <span v-if="label" class="price-label">{{ label }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.price-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &.variant-compact,
  &.variant-inline {
    flex-direction: row;
    align-items: baseline;
    gap: 0.25rem;
  }

  .price-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    width: 100%;

    .price-per-night {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;

      .price-amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: $color-text;
        line-height: 1;

        .size-small & {
          font-size: 1.25rem;
        }

        .size-large & {
          font-size: 2rem;
        }
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
  }

  .price-compact,
  .price-inline {
    .price-amount {
      font-size: 1.5rem;
      font-weight: 700;
      color: $color-text;
      line-height: 1;

      .size-small & {
        font-size: 1.25rem;
      }

      .size-large & {
        font-size: 2rem;
      }
    }

    .price-label {
      color: $color-text-light;
      font-size: 0.8rem;
      line-height: 1;
    }
  }
}
</style>

