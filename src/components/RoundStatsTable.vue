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
      :scrollable="true"
      scrollDirection="horizontal"
      :showGridlines="isMobile"
    >
      <template #header>
        <div class="statsTableHeader">
          <div>
            <span class="p-inputgroup">
              <Button
                type="button"
                icon="pi pi-filter-slash"
                label="Clear"
                class="p-button-outlined"
                @click="clearSearch"
              />
              <TextInput v-model="searchTerm" placeholder="Search" />
            </span>
            <span>
              <Button
                label="Export"
                icon="pi pi-download"
                iconPos="right"
                @click="exportRoundStats"
              />
            </span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px">
            <span>Include kicking points in total</span>
            <InputSwitch v-model="includeKickingPoints" />
          </div>
        </div>
      </template>
      <Column header="Club" :sortable="true" :frozen="true" alignFrozen="left">
        <template #body="slotProps">
          <img
            :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data.nrl_club}.svg`"
            :alt="slotProps.data.nrl_club"
            :height="50"
            :width="50"
          /> </template
      ></Column>
      <Column
        field="player_name"
        header="Name"
        :frozen="true"
        alignFrozen="left"
        :sortable="true"
        style="min-width: 150px"
      >
      </Column>
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
    <Dialog header="Player Appearance" v-model:visible="showPlayer" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" >
      <PlayerRoundStats v-if="selectedAppearance" :appearance="selectedAppearance"  />
    </Dialog>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, watch, PropType, ref } from "vue";
  import {
    Player,
    PlayerAppearanceStats,
    PlayerScoringStats,
    ScoringStats,
  } from "../global";
  import { GetPlayerXrlScores } from "../services/utils";
  import { useXrlStore } from "../store";
  import { MutationTypes } from "../store-types";
  import PlayerAppearance from "./PlayerAppearance.vue";
import PlayerRoundStats from "./PlayerRoundStats.vue";

  export default defineComponent({
    components: { PlayerAppearance, PlayerRoundStats },
    emits: ["export"],
    props: {
      stats: {
        type: Array as PropType<(Player & PlayerAppearanceStats)[]>,
        required: true,
      },
    },
    setup({ stats }, { emit }) {
      const store = useXrlStore();
      console.log(stats[0]);

      const isMobile = computed(() => store.state.isMobile);

      const displayData = computed(() => {
        return stats
          .map((p) => {
            let scoring = p.scoring_stats[
              p.position as keyof PlayerScoringStats
            ] as ScoringStats | undefined;
            return {
              player_id: p.player_id,
              player_name: p.player_name,
              search_name: p.search_name,
              nrl_club: p.nrl_club,
              minutes: p.stats["Mins Played"] ?? 0,
              tries: p.stats.Tries ?? 0,
              goals: p.scoring_stats.kicker.goals ?? 0,
              field_goals:
                (scoring?.field_goals ?? 0) +
                (scoring?.["2point_field_goals"] ?? 0),
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

      const selectedAppearance = ref<PlayerAppearanceStats>();
      const onSelectPlayer = (event: any) => {
        selectedAppearance.value = stats.find(
          (p) => p.player_id === event.data.player_id
        );
        showPlayer.value = true;
      };
      const showPlayer = ref(false);

      const searchTerm = ref("");
      const clearSearch = () => {
        searchTerm.value = "";
      };
      const filteredPlayers = computed(() => {
        return displayData.value.filter((p) => {
          if (!p.search_name) console.log(p);
          return p.search_name.includes(searchTerm.value.toLowerCase());
        });
      });

      const exportRoundStats = () => {
        const records = stats;
        emit("export", records);
      };

      return {
        isMobile,
        selectedAppearance,
        onSelectPlayer,
        showPlayer,
        searchTerm,
        clearSearch,
        filteredPlayers,
        includeKickingPoints,
        exportRoundStats,
      };
    },
  });
</script>

<style scoped lang="scss">
  div {
    font-size: 16px;
  }
  .statsTableHeader {
    display: flex;
    justify-content: space-between;
    > div {
      display: flex;
      gap: 1rem;
    }
  }
  @media screen and (max-width: 960px) {
    .statsTableHeader {
      flex-direction: column;
      > div {
        flex-wrap: wrap;
      }
    }
    :deep(.p-datatable) {
      .p-datatable-wrapper {
        .p-datatable-thead,
        .p-datatable-tbody {
          > tr {
            > td,
            > th {
              padding: 0.5rem 0.2rem;
            }
          }
        }
      }
    }
  }
</style>
