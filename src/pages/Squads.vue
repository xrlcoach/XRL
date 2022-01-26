<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <div id="dropdownRow">
      <div>
        <Dropdown
          :options="xrlTeams"
          v-model="squadName"
          placeholder="XRL Teams"
        />
      </div>
      <div>
        <Dropdown
          :options="nrlClubs"
          v-model="squadName"
          placeholder="NRL Clubs"
        />
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <SquadTable :name="squadName" :squad="players" />
    </transition>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref } from "vue";
  import { XrlTeam, NrlClub } from "../global";
  import { NrlClubs, XrlTeams } from "../services/players";
  import { SquadTable, LoadingIndicator } from "../components";
  import { useXrlStore } from "../store";

  export default defineComponent({
    props: {
      squadName: {
        type: String as PropType<XrlTeam | NrlClub>,
        required: false,
      },
    },
    setup(props) {
      const store = useXrlStore();

      const xrlTeams = Array.from(XrlTeams) as string[];
      const nrlClubs = Array.from(NrlClubs) as string[];

      const squadName = ref<XrlTeam | NrlClub>(
        props.squadName || store.getters.activeUserTeamShort
      );

      const isXrlTeam = (name: string): name is XrlTeam => {
        if (xrlTeams.includes(name)) return true;
        return false;
      };

      const players = computed(() =>
        isXrlTeam(squadName.value)
          ? store.getters.getXrlSquad(squadName.value)
          : store.getters.getNrlSquad(squadName.value)
      );

      return {
        xrlTeams,
        nrlClubs,
        squadName,
        players,
      };
    },
    components: {
      SquadTable,
      LoadingIndicator,
    },
  });
</script>

<style scoped>
  #dropdownRow {
    display: flex;
    justify-content: space-evenly;
    padding: 20px 0px;
  }
</style>
