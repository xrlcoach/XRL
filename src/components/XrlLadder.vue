<template>
  <div>
    <transition name="fade" mode="out-in">
      <Splitter layout="vertical">
        <SplitterPanel class="ladder-header">
          <h3>XRL</h3>
          <Dropdown v-model="selectedYear" :options="yearOptions" />
        </SplitterPanel>
        <SplitterPanel>
          <DataTable
            :value="ladder"
            dataKey="username"
            responsiveLayout="scroll"
            selectionMode="single"
            @row-select="onSelectTeam"
            :loading="tableLoading"
          >
            <Column>
              <template #body="slotProps">
                <div style="text-align: center">
                  <img
                    :src="`src/assets/${slotProps.data.team_short}.png`"
                    :alt="slotProps.data.team_short"
                    :height="50"
                    :width="50"
                  />
                </div>
              </template>
            </Column>
            <Column header="Team" field="team_name"></Column>
            <Column header="Wins" field="stats.wins"></Column>
            <Column header="Draws" field="stats.draws"></Column>
            <Column header="Losses" field="stats.losses"></Column>
            <Column header="Powerplays" field="powerplays"></Column>
            <Column header="For" field="stats.for"></Column>
            <Column header="Against" field="stats.against"></Column>
            <Column header="Diff">
              <template #body="slotProps">
                {{ slotProps.data.stats.for - slotProps.data.stats.against }}
              </template>
            </Column>
            <Column header="Points" field="stats.points"></Column>
          </DataTable>
        </SplitterPanel>
      </Splitter>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch, ref } from 'vue';
  import { XrlUser } from '../global';
import { DefaultPlayerSort } from '../services/players';
  import { GetAllUserInfoSorted, SortLeageTable } from '../services/users';
import { GetAllUsers } from '../services/xrlApi';
  import { useXrlStore } from '../store';

  export default defineComponent({
    setup() {
      const store = useXrlStore();
      
      const currentYear = new Date().getFullYear();
      const selectedYear = ref(currentYear);
      const yearOptions = [2021, 2022];

      const currentLadder = computed(() => store.getters.xrlLadder);
      const ladder = ref<XrlUser[]>(currentLadder.value);

      const tableLoading = ref(false);

      watch(selectedYear, async year => {
        if (year === currentYear) {
          ladder.value = currentLadder.value;
        } else {
          tableLoading.value = true;
          const yearLadder = await GetAllUsers(year);
          ladder.value = SortLeageTable(yearLadder);
          tableLoading.value = false;
        }
      });

      const onSelectTeam = (event: any) => {
        console.log(event.data?.team_name);
      };

      return {
        yearOptions,
        selectedYear,
        ladder,
        onSelectTeam,
        tableLoading
      };
    },
  });
</script>

<style scoped lang="scss">
  .ladder-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    h3 {
      margin-right: 1rem;
    }
  }
</style>
