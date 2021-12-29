<template>
  <div>
    <div id="dashboardContainer">
      <TeamInfo />
      <RecentFixtures />
      <Inbox />
      <SquadTable v-if="squad" name="First Team Squad" :squad="squad" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeMount, ref } from 'vue';
  import { TeamInfo, RecentFixtures, SquadTable, Inbox } from '../components';
  import { Player } from '../global';
  import { DefaultPlayerSort, GetUserSquad } from '../services/players';

  export default defineComponent({
    setup() {
      // const user = ref<XrlUser>();
      // onBeforeMount(async () => {
      //   user.value = await GetUserInfo();
      // });
      const squad = ref<Player[]>();
      onBeforeMount(async () => {
        squad.value = (await GetUserSquad()).sort(DefaultPlayerSort);
      });
      return {
        squad
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
