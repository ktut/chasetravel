<script lang="ts">
export default {
  name: 'AmenityPills',
  props: {
    amenities: {
      type: Array as () => string[],
      required: true
    }
  }
}
</script>

<template>
  <div class="amenities-container">
    <div class="amenities">
      <span v-for="amenity in amenities" :key="amenity" class="amenity">{{ amenity }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.amenities-container {
  position: relative;
  overflow: hidden;
  max-width: 78vw;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 968px) {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 40px;
      background: linear-gradient(to left, white, transparent);
      pointer-events: none;
    }
  }
}

.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;

  @media (max-width: 968px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE/Edge
    gap: 0.4rem;
    margin-top: 0;
    padding-bottom: 2px;

    &::-webkit-scrollbar {
      display: none; // Chrome/Safari
    }
  }

  .amenity {
    background: $color-bg-light;
    padding: 0.03rem 0.65rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: $color-text-light;
    border: 1px solid $color-light-grey;

    @media (max-width: 968px) {
      padding: 0.2rem 0.5rem;
      font-size: 0.7rem;
      white-space: nowrap;
      flex-shrink: 0;
    }
  }
}
</style>
