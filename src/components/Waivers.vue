<template>
  <div>
    <Splitter layout="vertical">
      <SplitterPanel>
        <h3>Waivers</h3>
      </SplitterPanel>
      <SplitterPanel>
        <transition name="grow" mode="out-in">
          <Splitter v-if="loaded" layout="horizontal" style="overflow: hidden">
            <SplitterPanel>
              <section id="waiverSection">
                <h4>Waiver Rank</h4>
                <p id="waiverRank">{{ user?.waiver_rank }}</p>
                <Dropdown
                  :options="waiverOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Waiver Reports"
                  v-model="selectedWaiverRound"
                />
              </section>
              <Dialog v-model:visible="showReport">
                <template #header>
                  <h3>
                    {{
                      `Round ${
                        selectedWaiverReport?.waiver_round.split('_')[0]
                      } ${selectedWaiverReport?.waiver_round.split('_')[1]}`
                    }}
                  </h3>
                </template>
                <pre>{{ selectedWaiverReport?.report }}</pre>
              </Dialog>
            </SplitterPanel>
            <SplitterPanel>
              <Splitter layout="vertical">
                <SplitterPanel>
                  <section>
                    <OrderList
                      v-model="preferences"
                      :listStyle="{ height: 'auto' }"
                      dataKey="player_id"
                      v-model:selection="selectedPlayers"
                    >
                      <template #header>Waiver Preferences</template>
                      <template #item="slotProps">
                        <div class="preferenceDisplay">
                          <div class="preferenceDisplayName">
                            <div>
                              <img
                                :src="`src/assets/${slotProps.item.nrl_club}.svg`"
                                :alt="slotProps.item.nrl_club"
                                :height="50"
                                :width="50"
                              />
                            </div>
                            <div>
                              {{ slotProps.item.player_name }}
                            </div>
                          </div>
                          <div>
                            <Button icon="pi pi-times" class="p-button-rounded p-button-text" @click="confirmDropClaim" :disabled="selectedPlayers?.[0]?.player_id !== slotProps.item.player_id" />
                          </div>
                        </div>
                      </template>
                    </OrderList>
                  </section>
                </SplitterPanel>
                <SplitterPanel>
                  <section id="waiverFooter">
                    <div>
                      <h5 style="margin-bottom: 5px">Provisional Drop</h5>
                      <Dropdown
                        id="provisionalDropSelect"
                        :options="[
                          ...squad,
                          { player_name: 'None', player_id: '' },
                        ]"
                        optionLabel="player_name"
                        optionValue="player_id"
                        v-model="provisionalDrop"
                      />
                    </div>
                    <div>
                      <Button
                        @click="saveChanges"
                        label="Save Changes"
                        loadingIcon="pi pi-spin pi-spinner"
                        :loading="savingChanges"
                        :disabled="changesMade"
                        :key="changesMade"
                      />
                    </div>
                  </section>
                </SplitterPanel>
              </Splitter>
            </SplitterPanel>
          </Splitter>
        </transition>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
  import { Player, WaiverReport, XrlUser } from '../global';
  import { GetUserSquad } from '../services/players';
  import { GetWaivers } from '../services/transfers';
  import { GetUserInfo } from '../services/users';
  import OrderList from 'primevue/orderlist';
  import { GetPlayerById } from '../services/xrlApi';
  import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

  export default defineComponent({
    setup() {
      const loaded = ref(false);
      const error = ref('');

      const user = ref<XrlUser>();
      const squad = ref([] as Player[]);
      const waiverReports = ref([] as WaiverReport[]);
      const waiverOptions = computed(() => {
        return waiverReports.value.map(r => {
          return {
            label:
              'Round ' +
              r.waiver_round.split('_')[0] +
              ' ' +
              r.waiver_round.split('_')[1],
            value: r.waiver_round,
          };
        });
      });
      const selectedWaiverRound = ref('');
      const selectedWaiverReport = computed(() => {
        return waiverReports.value.find(
          r => r.waiver_round === selectedWaiverRound.value
        );
      });
      const showReport = ref(false);
      watch(selectedWaiverReport, () => {
        showReport.value = true;
      });

      let originalPreferences: Player[] = [];
      const preferences = ref([] as Player[]);
      let originalPD = '';
      const provisionalDrop = ref('');

      const changesMade = computed(() => {
        return (
          JSON.stringify(preferences.value) ===
            JSON.stringify(originalPreferences) &&
          provisionalDrop.value === originalPD
        );
      });

      const confirm = useConfirm();
      const toast = useToast();
      const savingChanges = ref(false);
      const saveChanges = async () => {
        savingChanges.value = true;
        setTimeout(() => {
          toast.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: 'Your changes have been saved',
            life: 3000,
          });
          savingChanges.value = false;
        }, 1000);
      };

      const selectedPlayers = ref([] as Player[]);

      const confirmDropClaim = () => {
        confirm.require({
          message: `Are you sure you want to remove your claim for ${selectedPlayers.value?.[0]?.player_name}?`,
          header: 'Confirm Claim',
          icon: 'pi pi-undo',
          accept: () => {
            toast.add({
              severity: 'info',
              summary: 'Confirmed',
              detail: `Your claim for ${selectedPlayers.value?.[0]?.player_name} has been rescinded`,
              life: 3000,
            });
          }
        })
      }

      onMounted(async () => {
        try {
          user.value = await GetUserInfo();
          squad.value = await GetUserSquad();
          waiverReports.value = await GetWaivers();
          for (let id of user.value.waiver_preferences) {
            originalPreferences = [
              ...preferences.value,
              await GetPlayerById(id),
            ];
            preferences.value = originalPreferences;
          }
          originalPD = user.value.provisional_drop || '';
          provisionalDrop.value = originalPD;
        } catch (err) {
          error.value = err;
        } finally {
          loaded.value = true;
        }
      });

      return {
        loaded,
        error,
        user,
        squad,
        waiverReports,
        waiverOptions,
        selectedWaiverRound,
        selectedWaiverReport,
        showReport,
        preferences,
        provisionalDrop,
        savingChanges,
        saveChanges,
        changesMade,
        confirmDropClaim,
        selectedPlayers
      };
    },
    components: {
      OrderList,
    },
  });
</script>

<style scoped>
  #waiverSection {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
  #waiverRank {
    font-size: 64px;
  }
  .preferenceDisplay {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .preferenceDisplayName {
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 20px;
    align-items: center;
  }
  #waiverFooter {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    padding: 20px;
    align-items: center;
  }
</style>
