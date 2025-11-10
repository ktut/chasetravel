<script lang="ts">
export default {
  name: 'HomeView',
  data() {
    return {
      title: 'Chase Sapphire Reserve'
    }
  }
}
</script>

<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <h2>Premium Travel Rewards</h2>
    <p>Experience luxury travel with exclusive benefits and rewards.</p>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding: $spacing-xl;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    color: $color-primary;
  }

  h2 {
    color: $color-accent;
  }

  p {
    font-size: 1.125rem;
    color: $color-text-light;
  }
}
</style>
