<template>
  <div>
    <section>
      <Splitter layout="vertical">
        <SplitterPanel>
          <div class="tableHeader">
            <Dropdown v-model="selectedRound" :options="roundNumbers" />
            {{ heading }}
            <Dropdown
              v-model="selectedUser"
              :options="allUsers?.map(u => u.team_short)"
            />
          </div>
        </SplitterPanel>
        <SplitterPanel>
          <DataTable 
            v-if="fixtures.length > 0" 
            :value="fixtures"
            selectionMode="single"
            @rowSelect="goToMatch"
          >
            <Column>
              <template #body="slotProps">
                <div style="text-align: center">
                  <img
                    :src="`src/assets/${slotProps.data.home}.png`"
                    :alt="slotProps.data.home"
                    :height="50"
                    :width="50"
                  />
                </div>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div style="text-align: center">
                  {{
                    allUsers?.find(u => u.team_short === slotProps.data.home)
                      ?.team_name
                  }}
                </div>
              </template>
            </Column>
            <Column field="home_score">
              <template #body="slotProps">
                <div style="text-align: center">
                  {{ slotProps.data.home_score }}
                </div>
              </template>
            </Column>
            <Column field="away_score">
              <template #body="slotProps">
                <div style="text-align: center">
                  {{ slotProps.data.away_score }}
                </div>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div style="text-align: center">
                  {{
                    allUsers?.find(u => u.team_short === slotProps.data.away)
                      ?.team_name
                  }}
                </div>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div style="text-align: center">
                  <img
                    :src="`src/assets/${slotProps.data.away}.png`"
                    :alt="slotProps.data.away"
                    :height="50"
                    :width="50"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </SplitterPanel>
      </Splitter>
    </section>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
  import { XrlFixture, XrlRoundWithFixtures, XrlUser } from '../global';
  import { GetActiveRoundNumber, GetAllRounds } from '../services/rounds';
  import { GetAllUserInfoSorted } from '../services/users';
import { useXrlStore } from '../store';

  export default defineComponent({
    setup() {
      const store = useXrlStore();
      const allRounds = computed(() => store.state.allRounds);
      const currentRound = computed(() => store.getters.activeRoundNumber);
      const selectedRound = ref(store.getters.activeRoundNumber);

      const allUsers = computed(() => store.state.allUsers);
      const selectedUser = ref('');

      const heading = ref('');
      const fixtures = ref([] as XrlFixture[]);

      const roundNumbers = computed(() => {
        return allRounds.value?.map(r => r.round_number) ?? [];
      });

      const getRoundInfo = (roundNo: number) => {
        if (!allRounds.value) return null;
        let i = allRounds.value.findIndex(
          r => r.round_number === selectedRound.value
        );
        if (i !== -1) return allRounds.value[i];
        return allRounds.value[0];
      };

      const roundInfo = computed(() => {
        return getRoundInfo(selectedRound.value);
      });

      const loadFixtureTable = () => {
        if (!roundInfo.value) return;
        fixtures.value = roundInfo.value.fixtures;
        heading.value = `Round ${selectedRound.value} - ${
          roundInfo.value?.completed
            ? 'Completed'
            : roundInfo.value.in_progress
            ? 'In Progress'
            : roundInfo.value.active
            ? 'Active'
            : 'Inactive'
        }`;
      };

      watch(
        () => roundInfo.value,
        () => {
          loadFixtureTable();
        }
      );

      watch(() => currentRound.value, (newValue) => selectedRound.value = newValue);

      const userFixtures = computed(() => {
        let uf: XrlFixture[] = [];
        if (allRounds.value) {
          for (let r of allRounds.value) {
            let i = r.fixtures.findIndex(
              f =>
                f.away === selectedUser.value || f.home === selectedUser.value
            );
            if (i !== -1) uf.push(r.fixtures[i]);
          }
        }
        return uf;
      });

      watch(
        () => userFixtures.value,
        (currentValue) => {
          fixtures.value = currentValue;
          heading.value = selectedUser.value + ' Fixtures';
        }
      );

      const router = useRouter();
      const goToMatch = (event: any) => {
        if (!roundInfo.value) return;
        const fixture = event.data as XrlFixture;
        const matchQuery = `round=${roundInfo.value.round_number}&fixture=${fixture.home}-v-${fixture.away}`;
        router.push('/matchcentre?' + matchQuery);
      }

      onMounted(async () => {
        getRoundInfo(selectedRound.value);
        loadFixtureTable();
      });

      return {
        allRounds,
        roundNumbers,
        selectedRound,
        allUsers,
        roundInfo,
        selectedUser,
        userFixtures,
        heading,
        fixtures,
        goToMatch
      };
    },
  });
</script>

<style lang="scss" scoped>
  .tableHeader {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
</style>
