<template>
  <div>
    <section>
      <Splitter layout="vertical">
        <SplitterPanel>
          <div class="tableHeader">
            <Dropdown v-model="selectedRound" :options="roundNumbers" @change="showRoundFixtures" />
            {{ heading }}
            <Dropdown
              v-model="selectedUser"
              :options="allUsers?.map(u => u.team_short)"
              @change="showUserFixtures"
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
                <template v-if="selectedRound === '--'">R{{ slotProps.data.round_number }}</template>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div style="text-align: center">
                  <img
                    :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data.home}.png`"
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
                    :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data.away}.png`"
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
      const selectedRound = ref(String(store.getters.activeRoundNumber));

      const allUsers = computed(() => store.state.allUsers);
      const selectedUser = ref('');

      const heading = ref('');
      const fixtures = ref([] as XrlFixture[]);

      const roundNumbers = computed(() => {
        return allRounds.value?.map(r => String(r.round_number)).concat(['--']) ?? [];
      });

      const getRoundInfo = (roundNo: number) => {
        if (!allRounds.value) return null;
        let i = allRounds.value.findIndex(
          r => r.round_number === roundNo
        );
        if (i !== -1) return allRounds.value[i];
        return null;
      };

      const roundInfo = computed(() => {
        if (isNaN(Number(selectedRound.value))) return null;
        return getRoundInfo(Number(selectedRound.value));
      });

      const loadFixtureTable = () => {
        if (!roundInfo.value) return;
        fixtures.value = roundInfo.value.fixtures.map(f => {
          return { ...f, round_number: roundInfo.value?.round_number } as XrlFixture;
        });
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

      // watch(
      //   () => selectedRound.value,
      //   () => {
      //     selectedUser.value = 'None';
      //     loadFixtureTable();
      //   }
      // );

      watch(() => currentRound.value, (newValue) => selectedRound.value = String(newValue));

      const userFixtures = computed(() => {
        let uf: XrlFixture[] = [];
        if (allRounds.value) {
          for (let r of allRounds.value) {
            let i = r.fixtures.findIndex(
              f =>
                f.away === selectedUser.value || f.home === selectedUser.value
            );
            if (i !== -1) {
              const fixture = { ...r.fixtures[i], round_number: r.round_number } as XrlFixture;
              uf.push(fixture);
            };
          }
        }
        return uf;
      });

      function showRoundFixtures() {
        selectedUser.value = 'None';
        loadFixtureTable();
      }

      function showUserFixtures() {
        fixtures.value = userFixtures.value;
        heading.value = selectedUser.value + ' Fixtures';
        selectedRound.value = '--';
      };

      const router = useRouter();
      const goToMatch = (event: any) => {
        const fixture = event.data as XrlFixture;
        const matchQuery = `round=${fixture.round_number}&fixture=${fixture.home}-v-${fixture.away}`;
        router.push('/matchcentre?' + matchQuery);
      }

      onMounted(async () => {
        loadFixtureTable();
      });

      return {
        roundNumbers,
        selectedRound,
        allUsers,
        selectedUser,
        heading,
        fixtures,
        goToMatch,
        showRoundFixtures,
        showUserFixtures
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
