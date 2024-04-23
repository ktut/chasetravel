<script lang="ts">
import { defineComponent } from "vue";
import Search from "./views/Search.vue";

export default defineComponent({
  name: "App",
  components: {
    Search,
  },
  data: () => ({
    transitionName: "",
  }),
  computed: {
    isSearch() {
      return this.$route.path === "/search";
    },
  },
});
</script>

<template>
  <div>Search Bar</div>
  <Search v-if="isSearch" />
</template>

<style scoped></style>
