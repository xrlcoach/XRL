<template>
  <div>
    <div id="dashboardContainer">
      <TeamInfo />
      <RecentFixtures />
      <Inbox />
      <SquadTable v-if="squad" name="First Team Squad" :squad="sortedSquad" />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, watch } from "vue";
  import { TeamInfo, RecentFixtures, SquadTable, Inbox } from "../components";
  import { DefaultPlayerSort } from "../services/players";
  import { useXrlStore } from "../store";
  import { ActionTypes, MutationTypes } from "../store-types";
  import type { XrlStore } from "../store-types";

  export default defineComponent({
    setup() {
      const store = useXrlStore();
      const squad = computed(() => store.getters.squad);
      const sortedSquad = computed(() => squad.value.sort(DefaultPlayerSort));
      return {
        squad,
        sortedSquad,
      };
    },
    components: {
      TeamInfo,
      RecentFixtures,
      Inbox,
      SquadTable,
    },
  });
</script>

<style scoped>
  #dashboardContainer {
    display: flex;
    flex-direction: column;
    gap: 40px;

    margin-top: 20px;
  }
</style>
