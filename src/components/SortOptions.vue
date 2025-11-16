<script lang="ts">
export default {
  name: 'SortOptions',
  props: {
    modelValue: {
      type: String as () => 'price' | 'duration' | 'departure',
      required: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    updateSort(value: string) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>

<template>
  <div class="sort-options">
    <label>Sort by:</label>
    <select :value="modelValue" @change="updateSort(($event.target as HTMLSelectElement).value)" class="sort-select">
      <option value="price">Best Price</option>
      <option value="duration">Shortest Duration</option>
      <option value="departure">Departure Time</option>
    </select>
  </div>
</template>

<style lang="scss" scoped>
.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    color: $color-text-light;
  }

  .sort-select {
    padding: 0.5rem 1rem;
    border: 1px solid $color-light-grey;
    border-radius: 4px;
    font-size: 1rem;
    background: white;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: $color-accent;
    }
  }
}
</style>
