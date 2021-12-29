<template>
  <section>
    <Panel header="Filters" :toggleable="true" :collapsed="true">
      <div class="row">
        <div class="cell">
          <span class="p-float-label">
            <Dropdown
              id="positionFilter"
              :options="positionOptions"
              v-model="selectedPosition"
            />
            <label for="positionFilter">Position</label>
          </span>
        </div>
        <div class="cell">
          <span class="p-float-label">
            <Dropdown
              id="nrlClubFilter"
              :options="nrlClubOptions"
              v-model="selectedNrlClub"
            />
            <label for="nrlClubFilter">NRL Club</label>
          </span>
        </div>
        <div class="cell">
          <span class="p-float-label">
            <Dropdown
              id="xrlTeamFilter"
              :options="xrlTeamOptions"
              v-model="selectedXrlTeam"
            />
            <label for="xrlTeamFilter">XRL Team</label>
          </span>
        </div>
        <div class="cell">
          <span class="p-float-label">
            <Dropdown
              id="roundFilter"
              :options="roundOptions"
              v-model="selectedRound"
            />
            <label for="roundFilter">Round</label>
          </span>
        </div>
        <div class="cell">
          <Button @click="getResults" icon="pi pi-search" label="Apply" />
        </div>
      </div>
    </Panel>
    <transition name="fade" mode="out-in">
      <div
        v-if="loading"
        style="display: flex; justify-content: center; height: 100%"
      >
        <LoadingIndicator />
      </div>
      <div v-else style="width: 100%">
        <div v-if="isSpecificRound">
          <RoundStatsTable
            :stats="statsToShow"
            v-if="statsToShow.length > 0"
            :key="statsToShow"
          />
          <Card v-else style="width: 100%">
            <template #content> No results. </template>
          </Card>
        </div>
        <div v-else>
          <PlayerStatsTable
            :players="playersToShow"
            v-if="playersToShow.length > 0"
            :key="playersToShow"
          />
          <Card v-else style="width: 100%">
            <template #content> No results. </template>
          </Card>
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import {
    GetAllPlayers,
    GetCurrentRoundNumber,
    GetStatsByRound,
  } from '../services/xrlApi';
  import { PositionOrder } from '../services/utils';
  import {
    NrlClub,
    Player,
    PlayerAppearanceStats,
    XrlPosition,
    XrlTeam,
  } from '../global';
  import {
    LoadingIndicator,
    PlayerStatsTable,
    RoundStatsTable,
  } from '../components';
  import { NrlClubs, XrlTeams } from '../services/players';
  import { GetActiveRoundNumber } from '../services/rounds';

  export default defineComponent({
    setup() {
      const loading = ref(true);

      const allPlayers = ref([] as Player[]);
      const playersToShow = ref([] as Player[]);

      const roundStats = ref([] as (PlayerAppearanceStats & Player)[]);
      const statsToShow = ref([] as (PlayerAppearanceStats & Player)[]);

      const positionOptions = ['ALL'].concat(PositionOrder);
      const selectedPosition = ref<XrlPosition | 'ALL'>();

      const nrlClubOptions = ['ALL'].concat(NrlClubs);
      const selectedNrlClub = ref<NrlClub | 'ALL'>();

      const xrlTeamOptions = ['ALL'].concat(XrlTeams);
      const selectedXrlTeam = ref<XrlTeam | 'ALL'>();

      const roundOptions = ['ALL'].concat([
        ...Array.from(Array(21).keys()).map(n => String(n + 1)),
      ]);
      const selectedRound = ref('');
      const currentDisplayedRound = ref(0);

      const isSpecificRound = ref(false);

      const applyFilters = <T extends Player>(results: T[]): T[] => {
        return results.filter(p => {
          return (
            (!selectedPosition.value ||
              selectedPosition.value === 'ALL' ||
              selectedPosition.value === p.position ||
              selectedPosition.value === p.position2) &&
            (!selectedNrlClub.value ||
              selectedNrlClub.value === 'ALL' ||
              selectedNrlClub.value === p.nrl_club) &&
            (!selectedXrlTeam.value ||
              selectedXrlTeam.value === 'ALL' ||
              selectedXrlTeam.value === p.xrl_team)
          );
        });
      };

      const getPlayers = async () => {
        console.log('Calling getPlayers');
        loading.value = true;
        try {
          if (allPlayers.value.length === 0)
            allPlayers.value = await GetAllPlayers();
          playersToShow.value = applyFilters(allPlayers.value);
        } catch (err) {
          console.log(err);
        } finally {
          loading.value = false;
        }
      };

      const getStats = async () => {
        loading.value = true;
        try {
          const roundNumber = Number(selectedRound.value);
          if (currentDisplayedRound.value !== roundNumber) {
            const stats = await GetStatsByRound(roundNumber);
            if (allPlayers.value.length === 0) {
              allPlayers.value = await GetAllPlayers();
            }
            roundStats.value = stats
              .filter(
                p =>
                  allPlayers.value.find(
                    player => player.player_id === p.player_id
                  ) !== undefined
              )
              .map(p => {
                return Object.assign(
                  {},
                  allPlayers.value.find(
                    player => player.player_id === p.player_id
                  ),
                  p
                );
              });
          }
          statsToShow.value = applyFilters(roundStats.value);
        } catch (err) {
          console.log(err);
        } finally {
          loading.value = false;
        }
      };

      const getResults = () => {
        if (selectedRound.value && selectedRound.value !== 'ALL') {
          getStats();
          isSpecificRound.value = true;
        } else {
          getPlayers();
          isSpecificRound.value = false;
        }
      };

      onMounted(getPlayers);

      return {
        loading,
        playersToShow,
        statsToShow,
        positionOptions,
        selectedPosition,
        nrlClubOptions,
        selectedNrlClub,
        xrlTeamOptions,
        selectedXrlTeam,
        roundOptions,
        selectedRound,
        isSpecificRound,
        getResults,
      };
    },
    components: {
      LoadingIndicator,
      PlayerStatsTable,
      RoundStatsTable,
    },
  });
</script>

<style scoped>
  section {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .row {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    padding: 15px 0px;
  }
  .cell {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .flip-list-move {
    transition: transform 0.8s ease;
  }
</style>
