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
      <SquadTable
        v-if="loaded"
        :name="squadName"
        :squad="players"
        :key="players"
      />
      <div v-else style="height: 100%; display: flex; align-items: center; justify-content: center;">
      <LoadingIndicator />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import { XrlTeam, NrlClub, Player } from '../global';
  import { NrlClubs, XrlTeams } from '../services/players';
  import { SquadTable, LoadingIndicator } from '../components';
  import {
    GetActiveUserTeamShort,
    GetPlayersFromNrlClub,
    GetPlayersFromXrlTeam,
  } from '../services/xrlApi';

  export default defineComponent({
    props: {
      squadName: {
        type: String as PropType<XrlTeam | NrlClub>,
        required: false,
      },
    },
    setup(props) {
      const loaded = ref(false);
      const error = ref('');

      const xrlTeams = Array.from(XrlTeams) as string[];
      const nrlClubs = Array.from(NrlClubs) as string[];

      const squadName = ref(props.squadName || GetActiveUserTeamShort());

      const squadIsXrlTeam = (name: string) => {
        return xrlTeams.includes(name);
      };

      const players = ref([] as Player[]);

      const getPlayers = async (name: string) => {
        try {
          loaded.value = false;
          if (squadIsXrlTeam(name)) {
            players.value = await GetPlayersFromXrlTeam(name);
          } else {
            players.value = await GetPlayersFromNrlClub(name);
          }
        } catch (err) {
          error.value = err;
        } finally {
          loaded.value = true;
        }
      };

      watch(squadName, async newValue => {
        getPlayers(newValue);
      });

      onMounted(async () => {
        try {
          await getPlayers(squadName.value);
        } catch (err) {
          error.value = err;
        } 
      });

      return {
        loaded,
        error,
        xrlTeams,
        nrlClubs,
        squadName,
        players,
      };
    },
    components: {
      SquadTable,
      LoadingIndicator
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
