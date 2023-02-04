<template>
  <div>
    <LineupSelection />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import LineupSelection from '../components/LineupSelection.vue';

  export default defineComponent({
    setup() {
      return {}
    },
    components: {
      LineupSelection,
    },
  });
</script>

<style scoped>
</style>
