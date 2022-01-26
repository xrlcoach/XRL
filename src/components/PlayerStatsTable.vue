<template>
  <div>
    <Dialog
      header="Player Profile"
      v-model:visible="showPlayer"
      :breakpoints="{ '960px': '75vw', '640px': '100vw' }"
      :style="{ width: '50vw' }"
    >
      <PlayerProfile v-if="selectedPlayer" :player="selectedPlayer" />
    </Dialog>
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
              <Button label="Export" icon="pi pi-download" iconPos="right" @click="exportPlayerStats" />
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span>Include kicking points in total</span>
            <InputSwitch v-model="includeKickingPoints" />
          </div>
        </div>
      </template>
      <Column header="Club" :sortable="true">
        <template #body="slotProps">
          <img
            :src="`src/assets/${slotProps.data.nrl_club}.svg`"
            :alt="slotProps.data.nrl_club"
            :height="50"
            :width="50"
          /> </template
      ></Column>
      <Column field="player_name" header="Name" :sortable="true"> </Column>
      <Column field="appearances" header="Apps" :sortable="true"></Column>
      <Column field="tries" header="Tries" :sortable="true"></Column>
      <Column
        field="goals"
        header="Goals"
        :sortable="true"
      ></Column>
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
  import { computed, defineComponent, PropType, ref } from 'vue';
  import { Player, PlayerScoringStats, ScoringStats } from '../global';
import { SortByTotalXrlScore } from '../services/players';
  import PlayerProfile from './PlayerProfile.vue';

  export default defineComponent({
    emits: ['export'],
    props: {
      players: {
        type: Array as PropType<Player[]>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const players = computed(() => props.players);
      players.value.sort(SortByTotalXrlScore);

      const playerDisplayData = computed(() => {
        return players.value.map(p => {
          let scoring = p.scoring_stats[
            p.position as keyof PlayerScoringStats
          ] as ScoringStats | undefined;
          return {
            player_id: p.player_id,
            player_name: p.player_name,
            search_name: p.search_name,
            nrl_club: p.nrl_club,
            appearances: p.stats.appearances ?? 0,
            tries: p.stats.Tries ?? 0,
            goals: p.scoring_stats.kicker.goals ?? 0,
            field_goals:
              (scoring?.field_goals ?? 0) +
              (scoring?.['2point_field_goals'] ?? 0),
            it: scoring?.involvement_try ?? 0,
            pt: scoring?.positional_try ?? 0,
            mia: scoring?.mia ?? 0,
            concede: scoring?.concede ?? 0,
            points: includeKickingPoints.value ? (scoring?.points ?? 0) + (p.scoring_stats.kicker.points ?? 0)  : scoring?.points ?? 0 ,
          };
        });
      });

      const includeKickingPoints = ref(true);

      const selectedPlayer = ref<Player>();
      const showPlayer = ref(false);
      const onSelectPlayer = (event: any) => {
        selectedPlayer.value = players.value.find(
          p => p.player_id === event.data.player_id
        );
        showPlayer.value = true;
      };

      const searchTerm = ref('');
      const clearSearch = () => {
        searchTerm.value = '';
      };
      const filteredPlayers = computed(() => {
        return playerDisplayData.value.filter(p =>
          p.search_name.includes(searchTerm.value)
        );
      });

      const exportPlayerStats = () => {
        const playerRecords = players.value;
        emit('export', playerRecords);        
      }

      return {
        selectedPlayer,
        onSelectPlayer,
        searchTerm,
        clearSearch,
        filteredPlayers,
        showPlayer,
        includeKickingPoints,
        exportPlayerStats
      };
    },
    components: {
      PlayerProfile
    }
  });
</script>

<style scoped>
  div {
    font-size: 16px;
  }
</style>
