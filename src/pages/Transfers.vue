<template>
  <div>
    <section>
      <Waivers />
      <TransferHistory />
      <PlayerNews />
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Waivers, TransferHistory, PlayerNews } from '../components';

  export default defineComponent({
    setup() {
      return {};
    },
    components: {
      Waivers,
      TransferHistory,
      PlayerNews
    }
  });
</script>

<style scoped>
  section {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin: 40px 0px;
  }
</style>
