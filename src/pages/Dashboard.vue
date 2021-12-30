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
  import { ActionTypes, MutationTypes } from "../vuexTypes";
  import type { XrlStore } from "../vuexTypes";

  export default defineComponent({
    setup() {
      const store = useXrlStore() as XrlStore;
      store.dispatch(ActionTypes.GetActiveUser);
      store.dispatch(ActionTypes.GetAllUsers);
      store.dispatch(ActionTypes.GetAllFixtures);
      store.dispatch(ActionTypes.GetAllPlayers);
      const currentRound = computed(() => store.getters.currentRound);
      const teamShort = computed(() => store.getters.activeUserTeamShort);
      const squad = computed(() => store.getters.squad);
      const sortedSquad = computed(() => squad.value.sort(DefaultPlayerSort));
      watch(currentRound, (newValue) => {
        console.log(newValue);
      });
      watch(teamShort, (newValue) => {
        console.log(newValue);
      });
      onMounted(() => console.log(teamShort));
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
