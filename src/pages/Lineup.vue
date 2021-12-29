<template>
  <div>
    <LineupSelection />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import LineupSelection from '../components/LineupSelection.vue';
  import { Player, PlayerLineupEntry } from '../global';
  import { GetUserSquad } from '../services/players';
  import { GetUserLineup } from '../services/lineups';

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
