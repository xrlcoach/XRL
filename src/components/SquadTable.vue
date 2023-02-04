<template>
  <div>
    <Splitter>
      <SplitterPanel style="max-width: 100%;">
        <h3>{{ name }}</h3>
        <DataTable
          :value="players"
          data-key="player_id"
          v-model:selection="selectedPlayer"
          selectionMode="single"
          @rowSelect="onSelectPlayer"
          responsiveLayout="scroll"
        >
          <template #header>
            <div style="display: flex; justify-content: space-between">
              <span class="p-inputgroup tableFilter">
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Clear"
                  class="p-button-outlined"
                  @click="clearSearch"
                />
                <TextInput v-model="searchTerm" placeholder="Filter" />
                  <!-- <Button @click="searchTerm = input">Search</Button> -->
              </span>
            </div>
          </template>
          <Column header="Club">
            <template #body="slotProps">
              <img
                :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data.nrl_club}.svg`"
                :alt="slotProps.data.nrl_club"
                :height="50"
                :width="50"
              />
            </template>
          </Column>
          <Column field="player_name" header="Name" :sortable="true"></Column>
          <Column header="Positions" sortField="positionOrder" :sortable="true">
            <template #body="slotProps">
              <div>
                {{
                  slotProps.data.position
                }}{{ slotProps.data.position2 ? `, ${slotProps.data.position2}` : '' }}
              </div>
            </template>
          </Column>
          <Column field="stats.appearances" header="Appearances" :sortable="true">
            <template #body="slotProps">{{ slotProps.data.stats?.appearances ?? 0 }}</template>
          </Column>
          <Column field="times_as_captain" header="Captained" :sortable="true"></Column>
        </DataTable>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { Player } from '../global';
import { PositionOrder } from '../services/players';
import { useXrlStore } from '../store';
import { MutationTypes } from '../store-types';
import PlayerProfile from './PlayerProfile.vue';

export default defineComponent({
  props: {
    name: String,
    squad: Array,
  },
  setup(props) {
    const store = useXrlStore();
    const players = computed(() => {
      const squad = props.squad as Player[];
      squad.forEach(p => {
        p.positionOrder = PositionOrder.indexOf(p.position);
      });
      return squad;
    });
    const input = ref('');
    const searchTerm = ref('');
    const filteredPlayers = computed(() => {
      return players.value.filter(p => p.search_name.includes(searchTerm.value));
    });
    const clearSearch = () => {
      input.value = '';
      searchTerm.value = '';
    };
    const selectedPlayer = ref<Player>();
    const onSelectPlayer = (event: any) => {
      selectedPlayer.value = event.data as Player;
      store.commit(MutationTypes.SHOW_SELECTED_PLAYER, selectedPlayer.value);
    };
    return {
      input,
      searchTerm,
      clearSearch,
      players: filteredPlayers,
      selectedPlayer,
      onSelectPlayer,
    };
  },
  components: {
    PlayerProfile,
  }
});
</script>

<style scoped lang="scss">
  .tableFilter {
    max-width: 500px;
  }
  @media screen and (max-width: 960px) {
    :deep(.p-datatable) {
      .p-datatable-wrapper {
        .p-datatable-thead, .p-datatable-tbody {
          > tr {
            > td, > th {
              padding: 0.5rem 0.2rem;
            }
          }
        }
      }
    }
  }
</style>
