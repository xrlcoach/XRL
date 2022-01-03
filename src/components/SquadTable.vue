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
    <Splitter>
      <SplitterPanel>
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
              <div>
                <Button
                  type="button"
                  icon="pi pi-filter-slash"
                  label="Clear"
                  class="p-button-outlined"
                  @click="clearSearch"
                />
                <span style="margin-left: 20px">
                  <TextInput v-model="searchTerm" placeholder="Filter" />
                  <!-- <Button @click="searchTerm = input">Search</Button> -->
                </span>
              </div>
            </div>
          </template>
          <Column header="Club">
            <template #body="slotProps">
              <img
                :src="`src/assets/${slotProps.data.nrl_club}.svg`"
                :alt="slotProps.data.nrl_club"
                :height="50"
                :width="50"
              />
            </template>
          </Column>
          <Column field="player_name" header="Name" :sortable="true"></Column>
          <Column header="Positions" :sortable="true">
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
import PlayerProfile from './PlayerProfile.vue';

export default defineComponent({
  props: {
    name: String,
    squad: Array,
  },
  setup(props) {
    const players = computed(() => props.squad as Player[]);
    const input = ref('');
    const searchTerm = ref('');
    const filteredPlayers = computed(() => {
      return players.value.filter(p => p.search_name.includes(searchTerm.value));
    });
    const clearSearch = () => {
      input.value = '';
      searchTerm.value = '';
    };
    const showPlayer = ref(false);
    const selectedPlayer = ref<Player>();
    const onSelectPlayer = (event: any) => {
      selectedPlayer.value = event.data as Player;
      showPlayer.value = true;
    };
    return {
      input,
      searchTerm,
      clearSearch,
      players: filteredPlayers,
      selectedPlayer,
      onSelectPlayer,
      showPlayer,
    };
  },
  components: {
    PlayerProfile,
  }
});
</script>

<style scoped></style>
