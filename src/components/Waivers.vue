<template>
  <div>
    <Splitter layout="vertical">
      <SplitterPanel>
        <h3>Waivers</h3>
      </SplitterPanel>
      <SplitterPanel>
        <transition name="grow" mode="out-in">
          <section
            class="p-d-flex p-ai-center p-flex-wrap"
            v-if="loaded"
            layout="horizontal"
            style="overflow: hidden"
          >
            <section id="waiverSection">
              <h4>Waiver Rank</h4>
              <p id="waiverRank">{{ user?.waiver_rank }}</p>
              <Dropdown
                :options="waiverReportOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Waiver Reports"
                v-model="selectedWaiverRound"
              />
              <Button label="View" :disabled="!selectedWaiverReport" @click="showReport = true" />
              <Dialog v-model:visible="showReport" class="waiver-report-dialog">
                <template #header>
                  <h3>
                    {{
                      `Round ${selectedWaiverReport?.waiver_round.split("_")[0]
                        } ${selectedWaiverReport?.waiver_round.split("_")[1]}`
                    }}
                  </h3>
                </template>
                <pre>{{ selectedWaiverReport?.report }}</pre>
              </Dialog>
            </section>
            <section id="preferences-section">
              <Splitter layout="vertical">
                <SplitterPanel>
                  <section>
                    <article class="pick-list-container">
                      <OrderList
                        v-model="preferences"
                        :listStyle="{ height: 'auto' }"
                        data-key="pick"
                        v-model:selection="selectedPreferences"
                      >
                        <template #header>
                          <div class="p-d-flex p-jc-start">Waiver Preferences</div>
                        </template>
                        <template #item="{ item }">
                          <div class="preferenceDisplay">
                            <div class="preferenceDisplayName">
                              <div>
                                <img
                                  :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${item.pick.nrl_club}.svg`"
                                  :alt="item.pick.nrl_club"
                                  :height="50"
                                  :width="50"
                                />
                              </div>
                              <div>{{ item.pick.player_name }}</div>
                            </div>
                            <div>
                              <Button
                                icon="pi pi-times"
                                class="p-button-rounded p-button-text"
                                @click="confirmDropClaim"
                                :disabled="
                                  selectedPreference.pick?.player_id !==
                                  item.pick.player_id
                                "
                              />
                            </div>
                          </div>
                        </template>
                      </OrderList>
                    </article>
                    <article class="drop-list-container">
                      <OrderList
                        v-model="selectedPreference.drop"
                        :listStyle="{ height: 'auto' }"
                        data-key="player_id"
                        v-model:selection="selectedDropPlayers"
                      >
                        <template #header>
                          <div class="p-d-flex p-jc-between p-ai-center">
                            <div>Drop List</div>
                            <div class="p-d-flex p-ai-center">
                              <span class="p-inputgroup">
                                <Dropdown
                                  v-model="newDropPlayer"
                                  :disabled="!selectedPreference.pick"
                                  :options="dropOptions"
                                  optionLabel="player_name"
                                />
                                <Button
                                  label="Add To Drop List"
                                  class="p-button-danger"
                                  :disabled="!newDropPlayer"
                                  @click="addPlayerToDrop"
                                />
                              </span>
                            </div>
                          </div>
                        </template>
                        <template #item="{ item }">
                          <div class="preferenceDisplay">
                            <div class="preferenceDisplayName">
                              <div>
                                <img
                                  :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${item.nrl_club}.svg`"
                                  :alt="item.nrl_club"
                                  :height="50"
                                  :width="50"
                                />
                              </div>
                              <div>{{ item.player_name }}</div>
                            </div>
                            <div>
                              <Button
                                icon="pi pi-times"
                                class="p-button-rounded p-button-text"
                                @click="removeDropPlayer(item)"
                              />
                            </div>
                          </div>
                        </template>
                      </OrderList>
                      <div
                        v-if="!selectedPreference.pick"
                        class="p-d-flex p-jc-center p-ai-center empty-droplist-message"
                        style="height: 200px"
                      >
                        <Message severity="info">
                          Select a waiver pick to set associated drop
                          preferences
                        </Message>
                      </div>
                    </article>
                  </section>
                </SplitterPanel>
                <SplitterPanel>
                  <section id="waiverFooter">
                    <div>
                      <Button
                        @click="saveChanges"
                        label="Save Changes"
                        loadingIcon="pi pi-spin pi-spinner"
                        :loading="savingChanges"
                        :disabled="noChangesMade"
                      />
                    </div>
                  </section>
                </SplitterPanel>
              </Splitter>
            </section>
          </section>
        </transition>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  LoadedWaiverPreference,
  Player,
  WaiverReport,
  XrlUser,
} from "../global";
import { GetUserSquad } from "../services/players";
import { GetWaivers } from "../services/transfers";
import { GetUserInfo } from "../services/users";
import OrderList from "primevue/orderlist";
import { GetPlayerById } from "../services/xrlApi";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { useXrlStore } from "../store";
import { isPlayer } from "../services/utils";
import { ActionTypes } from "../store-types";

export default defineComponent({
  setup() {
    const store = useXrlStore();

    const loaded = ref(false);
    const error = ref("");

    store
      .dispatch(ActionTypes.GetWaiverReports)
      .finally(() => (loaded.value = true));

    const user = computed(() => store.state.user);
    const userWaiverPreferences = computed(
      () => user.value?.waiver_preferences
    );
    const squad = computed(() => store.getters.squad);
    const waiverReports = computed(() => store.state.waiverReports);
    const waiverReportOptions = computed(() => {
      return waiverReports.value?.map((r) => {
        return {
          label:
            "Round " +
            r.waiver_round.split("_")[0] +
            " " +
            r.waiver_round.split("_")[1],
          value: r.waiver_round,
        };
      });
    });
    const selectedWaiverRound = ref("");
    const selectedWaiverReport = computed(() => {
      return waiverReports.value?.find(
        (r) => r.waiver_round === selectedWaiverRound.value
      );
    });
    const showReport = ref(false);
    watch(selectedWaiverReport, () => {
      showReport.value = true;
    });

    const originalPreferences: ComputedRef<LoadedWaiverPreference[]> = computed(
      () => {
        const players: LoadedWaiverPreference[] = [];
        (userWaiverPreferences.value ?? []).forEach((pref) => {
          const pick = store.getters.getPlayerById(pref.pick);
          const drop: Player[] = [];
          (pref.drop ?? []).forEach((id) => {
            const p = store.getters.getPlayerById(id);
            if (isPlayer(p)) drop.push(p);
          });
          if (isPlayer(pick)) {
            const originalPref = {
              pick,
              drop,
            };
            players.push(originalPref);
          }
        });
        return players;
      }
    );
    const preferences = ref<LoadedWaiverPreference[]>(
      JSON.parse(JSON.stringify(originalPreferences.value)),
    );
    watch(originalPreferences, (value) => (preferences.value = JSON.parse(JSON.stringify(originalPreferences.value))));
    const selectedPreferences = ref([] as LoadedWaiverPreference[]);
    const selectedPreference = ref<
      LoadedWaiverPreference | { pick: null; drop: Player[] }
    >({ pick: null, drop: [] });
    watch(selectedPreferences, (value) => {
      if (value.length) selectedPreference.value = value[0];
      else selectedPreference.value = { pick: null, drop: [] };
    });
    const selectedDropPlayers = ref([] as Player[]);
    const newDropPlayer = ref<Player | undefined>();
    const dropOptions = computed(() => {
      return squad.value.filter(p => selectedPreference.value.drop.findIndex(d => d.player_id === p.player_id) === -1);
    })

    const addPlayerToDrop = () => {
      const pref = selectedPreference.value;
      if (pref && isPlayer(newDropPlayer.value)) {
        pref.drop.push(newDropPlayer.value);
      }
    };
    const removeDropPlayer: (player: Player) => void = (player) => {
      const pref = selectedPreference.value;
      if (pref && isPlayer(player)) {
        const index = pref.drop.findIndex(
          (p) => p.player_id === player.player_id
        );
        pref.drop.splice(index, 1);
      }
    };

    const noChangesMade = computed(() => {
      return (
        JSON.stringify(preferences.value) ===
        JSON.stringify(originalPreferences.value)
      );
    });

    const confirm = useConfirm();
    const toast = useToast();
    const savingChanges = ref(false);
    const saveChanges = async () => {
      savingChanges.value = true;
      const prefs = preferences.value.map((p) => {
        return {
          pick: p.pick.player_id,
          drop: p.drop.map((p) => p.player_id),
        };
      });
      store
        .dispatch(ActionTypes.UpdateUserWaiverPreferences, {
          preferences: prefs,
        })
        .then(() => {
          toast.add({
            severity: "info",
            summary: "Confirmed",
            detail: "Your changes have been saved",
            life: 3000,
          });
          savingChanges.value = false;
        });
    };

    const confirmDropClaim = () => {
      const index = preferences.value.findIndex(
        (p) => p.pick === selectedPreference.value?.pick
      );
      preferences.value.splice(index, 1);
    };

    return {
      loaded,
      user,
      waiverReportOptions,
      selectedWaiverRound,
      selectedWaiverReport,
      showReport,
      preferences,
      savingChanges,
      noChangesMade,
      selectedPreferences,
      selectedPreference,
      selectedDropPlayers,
      newDropPlayer,
      dropOptions,
      saveChanges,
      confirmDropClaim,
      addPlayerToDrop,
      removeDropPlayer,
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
  min-width: 30%;
  flex: auto;
  padding: 20px;
}
#waiverRank {
  font-size: 64px;
}
#preferences-section {
  min-width: 70%;
  flex: auto;
  border: 1px solid #304562;
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
.drop-list-container {
  position: relative;
}
.drop-list-container :deep(.p-orderlist-controls .p-button) {
  background-color: #f48fb1;
  border: 1px solid #f48fb1;
}
.empty-droplist-message {
  position: absolute;
  top: 20%;
  left: calc(10% + 70px);
  width: calc(80% - 70px);
}
#waiverFooter {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 20px;
  align-items: center;
}
:global(.waiver-report-dialog) {
  max-width: 95vw;
}
@media screen and (max-width: 960px) {
  #preferences-section :deep(.p-orderlist) {
    flex-direction: column-reverse;
  }
}
</style>
