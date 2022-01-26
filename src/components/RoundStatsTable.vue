<template>
  <div>
    <DataTable
      :value="filteredPlayers"
      dataKey="player_id"
      :paginator="true"
      :rows="10"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rowsPerPageOptions="[10, 20, 50]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
      v-model:selection="selectedPlayer"
      selectionMode="single"
      @rowSelect="onSelectPlayer"
      responsiveLayout="scroll"
    >
      <template #header>
        <div style="display: flex; justify-content: space-between">
          <div>
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined"
              @click="clearSearch"
            />
            <span style="margin-left: 20px">
              <TextInput v-model="searchTerm" placeholder="Search" />
            </span>
            <span style="margin-left: 20px">
              <Button label="Export" icon="pi pi-download" iconPos="right" @click="exportRoundStats" />
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px">
            <span>Include kicking points in total</span>
            <InputSwitch v-model="includeKickingPoints" />
          </div>
        </div>
      </template>
      <Column header="Club" :sortable="true">
        <template #body="slotProps">
          <img
            :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data.nrl_club}.svg`"
            :alt="slotProps.data.nrl_club"
            :height="50"
            :width="50"
          /> </template
      ></Column>
      <Column field="player_name" header="Name" :sortable="true"> </Column>
      <Column field="minutes" header="Mins" :sortable="true"></Column>
      <Column field="tries" header="Tries" :sortable="true"></Column>
      <Column field="goals" header="Goals" :sortable="true"></Column>
      <Column field="field_goals" header="FG" :sortable="true"></Column>
      <Column field="it" header="IT" :sortable="true"></Column>
      <Column field="pt" header="PT" :sortable="true"></Column>
      <Column field="mia" header="MIA" :sortable="true"></Column>
      <Column field="concede" header="CON" :sortable="true"></Column>
      <Column field="points" header="Points" :sortable="true"></Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, watch, PropType, ref } from 'vue';
  import {
    Player,
    PlayerAppearanceStats,
    PlayerScoringStats,
    ScoringStats,
  } from '../global';
  import { GetPlayerXrlScores } from '../services/utils';
import { useXrlStore } from '../store';
import { MutationTypes } from '../store-types';
  import PlayerProfile from './PlayerProfile.vue';

  export default defineComponent({
    components: { PlayerProfile },
    emits: ['export'],
    props: {
      stats: {
        type: Array as PropType<(Player & PlayerAppearanceStats)[]>,
        required: true,
      },
    },
    setup({ stats }, { emit }) {
      const store = useXrlStore();
      console.log(stats[0]);

      const displayData = computed(() => {
        return stats
          .map(p => {
            let scoring = p.scoring_stats[
              p.position as keyof PlayerScoringStats
            ] as ScoringStats | undefined;
            return {
              player_id: p.player_id,
              player_name: p.player_name,
              search_name: p.search_name,
              nrl_club: p.nrl_club,
              minutes: p.stats['Mins Played'] ?? 0,
              tries: p.stats.Tries ?? 0,
              goals: p.scoring_stats.kicker.goals ?? 0,
              field_goals:
                (scoring?.field_goals ?? 0) +
                (scoring?.['2point_field_goals'] ?? 0),
              it: scoring?.involvement_try ? 1 : 0,
              pt: scoring?.positional_try ? 1 : 0,
              mia: scoring?.mia ? 1 : 0,
              concede: scoring?.concede ? 1 : 0,
              points: includeKickingPoints.value
                ? GetPlayerXrlScores(p.position, p, true)
                : GetPlayerXrlScores(p.position, p, false),
            };
          })
          .sort((a, b) => b.points - a.points);
      });

      const includeKickingPoints = ref(true);

      const selectedPlayer = ref<Player>();
      const onSelectPlayer = (event: any) => {
        selectedPlayer.value = stats.find(
          p => p.player_id === event.data.player_id
        );
        store.commit(MutationTypes.SHOW_SELECTED_PLAYER, selectedPlayer.value);
      };

      const searchTerm = ref('');
      const clearSearch = () => {
        searchTerm.value = '';
      };
      const filteredPlayers = computed(() => {
        return displayData.value.filter(p => {
          if (!p.search_name) console.log(p);
          return p.search_name.includes(searchTerm.value);
        }
        );
      });

      const exportRoundStats = () => {
        const records = stats;
        emit('export', records);
      }

      return {
        selectedPlayer,
        onSelectPlayer,
        searchTerm,
        clearSearch,
        filteredPlayers,
        includeKickingPoints,
        exportRoundStats
      };
    },
  });
</script>

<style scoped>
  div {
    font-size: 16px;
  }
</style>
