<script lang="ts">
export default {
  name: 'PointsBoostBadge',
  props: {
    price: {
      type: Number,
      required: true
    },
    itemType: {
      type: String as () => 'flight' | 'hotel',
      default: 'flight'
    },
    variant: {
      type: String as () => 'compact' | 'full',
      default: 'compact'
    }
  },
  computed: {
    // Old points value at 1.5 cents per point
    oldPointsValue(): number {
      return Math.round(this.price / 0.015)
    },
    // New points value at 2 cents per point
    newPointsValue(): number {
      return Math.round(this.price / 0.02)
    },
    // Points saved
    pointsSaved(): number {
      return this.oldPointsValue - this.newPointsValue
    },
    formattedOldPoints(): string {
      return this.oldPointsValue.toLocaleString('en-US')
    },
    formattedNewPoints(): string {
      return this.newPointsValue.toLocaleString('en-US')
    },
    formattedPointsSaved(): string {
      return this.pointsSaved.toLocaleString('en-US')
    },
    badgeText(): string {
      return `This ${this.itemType} is eligible for Points Boost`
    }
  }
}
</script>

<template>
  <div class="points-boost-badge" :class="`variant-${variant}`">
    <div class="badge-content">
      <div class="badge-header">
        <span class="badge-title">{{ badgeText }}</span>
      </div>
      <div class="points-pricing">
        <span class="old-price">{{ formattedOldPoints }} pts</span>
        <span class="arrow">→</span>
        <span class="new-price">{{ formattedNewPoints }} pts</span>
        <span class="savings-label" v-if="variant === 'full'">• Save {{ formattedPointsSaved }} pts</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.points-boost-badge {
  background: $color-primary;
  color: white;
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  
  &.variant-compact {
    padding: 0.65rem 0.85rem;
  }

  &.variant-full {
    padding: 1rem 1.25rem;
  }
}

.badge-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.badge-header {
  .badge-title {
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.3;
    color: white;
    letter-spacing: 0.01em;

    .variant-full & {
      font-size: 0.9rem;
      font-weight: 600;
    }
  }
}

.points-pricing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .old-price {
    font-size: 0.85rem;
    text-decoration: line-through;
    color: rgba(255, 255, 255, 0.65);
    font-weight: 500;

    .variant-full & {
      font-size: 0.9rem;
    }
  }

  .arrow {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;

    .variant-full & {
      font-size: 1rem;
    }
  }
  
  .new-price {
    font-size: 1rem;
    font-weight: 700;
    color: white;

    .variant-full & {
      font-size: 1.1rem;
    }
  }
  
  .savings-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    margin-left: 0.15rem;

    .variant-full & {
      font-size: 0.8rem;
    }
  }
}

@media (max-width: 768px) {
  .points-boost-badge {
    padding: 0.6rem 0.75rem;

    &.variant-full {
      padding: 0.85rem 1rem;
    }
  }

  .badge-header {
    .badge-title {
      font-size: 0.75rem;
    }
  }

  .points-pricing {
    gap: 0.4rem;

    .old-price {
      font-size: 0.8rem;
    }

    .arrow {
      font-size: 0.85rem;
    }

    .new-price {
      font-size: 0.95rem;
    }

    .savings-label {
      font-size: 0.7rem;
    }
  }
}
</style>

