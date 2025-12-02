<script lang="ts">
export default {
  name: 'StarsDisplay',
  props: {
    stars: {
      type: Number,
      required: true,
      validator: (value: number) => value >= 0 && value <= 5
    },
    showEmpty: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as () => 'small' | 'medium' | 'large',
      default: 'medium'
    }
  },
  computed: {
    starsArray(): number[] {
      return Array.from({ length: this.stars }, (_, i) => i)
    },
    emptyStarsArray(): number[] {
      if (!this.showEmpty) return []
      const empty = 5 - this.stars
      return Array.from({ length: empty }, (_, i) => i)
    }
  }
}
</script>

<template>
  <div class="stars-display" :class="`size-${size}`">
    <span v-for="star in starsArray" :key="star" class="star filled">★</span>
    <span v-for="star in emptyStarsArray" :key="star" class="star empty">☆</span>
  </div>
</template>

<style lang="scss" scoped>
.stars-display {
  display: inline-flex;
  gap: 2px;
  align-items: center;

  .star {
    color: #ffa500;

    &.filled {
      color: #ffa500;
    }

    &.empty {
      color: #ddd;
    }
  }

  &.size-small .star {
    font-size: 0.75rem;
  }

  &.size-medium .star {
    font-size: 0.8rem;
  }

  &.size-large .star {
    font-size: 1.1rem;
  }
}
</style>

