<template>
  <div id="offerBuilderContainer">
    <section id="targetUser" class="input-field">
      <label for="targetUserSelect">Offer trade to</label>
      <Dropdown
        id="targetUserSelect"
        v-model="selectedTeam"
        :options="xrlTeams"
      />
    </section>
    <form ref="tradeOfferForm" @submit.prevent="sendOffer" id="tradeOffer">
      <section id="offering">
        <Panel header="Offer">
          <div class="trade-content">
            <div class="trade-players">
              <article v-if="!offeredPlayers.length">
                No players offered
              </article>
              <article
                class="trade-player"
                v-for="(player, index) in offeredPlayers"
                :key="player.player_id"
              >
                <div class="trade-player-left">
                  <img
                    :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${player.nrl_club}.svg`"
                    :alt="player.nrl_club"
                    :height="30"
                    :width="30"
                  />
                  <span>{{ player.player_name }}</span>
                </div>
                <div class="trade-player-right">
                  <Button
                    v-if="!offerSent"
                    class="p-button-danger"
                    icon="pi pi-times"
                    @click="offeredPlayers.splice(index, 1)"
                  />
                </div>
              </article>
            </div>
            <div class="trade-powerplays">
              <label>Powerplays</label>
              <div class="p-inputgroup">
                <InputNumber
                  v-model="offeredPowerplays"
                  :disabled="offerSent"
                  mode="decimal"
                  showButtons
                  buttonLayout="horizontal"
                  :min="0"
                  :max="user.powerplays"
                  decrementButtonClass="p-button-danger"
                  incrementButtonClass="p-button-primary"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                />
              </div>
            </div>
          </div>
          <Divider />
          <div class="offer-actions">
            <div class="add-player p-inputgroup">
              <Dropdown
                id="offeredPlayersSelect"
                v-model="selectedOffer"
                :options="offerOptions"
                :disabled="offerSent"
                optionLabel="player_name"
              />
              <Button
                label="Add Player"
                icon="pi pi-plus"
                iconPos="right"
                :disabled="!selectedOffer || offerSent"
                @click="offeredPlayers.push(selectedOffer)"
              />
            </div>
          </div>
        </Panel>
      </section>
      <section id="for">
        <Panel header="For">
          <div class="trade-content">
            <div class="trade-players">
              <article v-if="!desiredPlayers.length">No players wanted</article>
              <article
                class="trade-player"
                v-for="(player, index) in desiredPlayers"
                :key="player.player_id"
              >
                <div class="trade-player-left">
                  <img
                    :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${player.nrl_club}.svg`"
                    :alt="player.nrl_club"
                    :height="30"
                    :width="30"
                  />
                  <span>{{ player.player_name }}</span>
                </div>
                <div class="trade-player-right">
                  <Button
                    v-if="!offerSent"
                    class="p-button-danger"
                    icon="pi pi-times"
                    @click="desiredPlayers.splice(index, 1)"
                  />
                </div>
              </article>
            </div>
            <div class="trade-powerplays">
              <label>Powerplays</label>
              <div class="p-inputgroup">
                <InputNumber
                  v-model="desiredPowerplays"
                  :disabled="offerSent"
                  mode="decimal"
                  showButtons
                  buttonLayout="horizontal"
                  :min="0"
                  :max="targetUser.powerplays"
                  decrementButtonClass="p-button-danger"
                  incrementButtonClass="p-button-primary"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                />
              </div>
            </div>
          </div>
          <Divider />
          <div class="offer-actions">
            <div class="add-player p-inputgroup">
              <Dropdown
                id="offeredPlayersSelect"
                v-model="selectedDesire"
                :disabled="offerSent"
                :options="desiredOptions"
                optionLabel="player_name"
              />
              <Button
                label="Add Player"
                icon="pi pi-plus"
                iconPos="right"
                :disabled="!selectedDesire || offerSent"
                @click="desiredPlayers.push(selectedDesire)"
              />
            </div>
          </div>
        </Panel>
      </section>
    </form>
    <section class="offer-submit">
      <Button
        type="button"
        label="Submit Offer"
        :loading="sendingOffer"
        @click="confirmOffer"
        :disabled="offerSent"
      />
    </section>
  </div>
</template>

<script lang="ts">
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import { computed, defineComponent, PropType, ref, watch } from "vue";
  import { Player, XrlTeam, XrlUser } from "../global";
  import { XrlTeams } from "../services/players";
  import { SendTradeOffer } from "../services/xrlApi";
  import { useXrlStore } from "../store";
import { ActionTypes } from "../store-types";

  export default defineComponent({
    emits: ["complete"],
    props: {
      player: {
        type: Object as PropType<Player>,
        required: false,
      },
    },
    setup({ player }) {
      const store = useXrlStore();

      const user = computed(() => store.state.user);
      const userSquad = computed(() => store.getters.squad);

      const targetUser = ref<XrlUser | null>(
        player ? store.getters.getUserByTeamShort(player.xrl_team) : null
      );
      const targetUserSquad = ref(
        targetUser.value
          ? store.getters.getXrlSquad(targetUser.value.team_short)
          : ([] as Player[])
      );

      const xrlTeams = XrlTeams.filter((team) => team !== "None");
      const selectedTeam = ref<XrlTeam>(targetUser.value?.team_short ?? "None");

      watch(selectedTeam, async (team) => {
        if (selectedTeam.value !== "None") {
          targetUser.value = store.getters.getUserByTeamShort(team);
          targetUserSquad.value = store.getters.getXrlSquad(team);
          desiredPlayers.value = [];
          desiredPowerplays.value = 0;
        }
      });

      const desiredPlayers = ref(player ? [player] : ([] as Player[]));
      const offeredPlayers = ref([] as Player[]);
      const selectedOffer = ref<Player>();
      const selectedDesire = ref<Player>();
      const offerOptions = computed(() => {
        return userSquad.value.filter((p) => !offeredPlayers.value.includes(p));
      });
      const desiredOptions = computed(() => {
        return targetUserSquad.value.filter(
          (p) => !desiredPlayers.value.includes(p)
        );
      });

      const desiredPowerplays = ref(0);
      const addPowerplayToRequest = () => {
        if (
          targetUser.value &&
          desiredPowerplays.value < targetUser.value.powerplays
        ) {
          desiredPowerplays.value++;
        }
      };
      const removePowerplayFromRequest = () => {
        desiredPowerplays.value = Math.max(0, desiredPowerplays.value - 1);
      };
      const offeredPowerplays = ref(0);
      const addPowerplayToOffer = () => {
        if (user.value && offeredPowerplays.value < user.value.powerplays) {
          offeredPowerplays.value++;
        }
      };
      const removePowerplayFromOffer = () => {
        offeredPowerplays.value = Math.max(0, offeredPowerplays.value - 1);
      };

      const confirm = useConfirm();
      const toast = useToast();
      const sendingOffer = ref(false);
      const offerSent = ref(false);
      const sendOffer = async () => {
        sendingOffer.value = true;
        if (!user.value || !targetUser.value) return;
        try {
          await store.dispatch(ActionTypes.SendTradeOffer, {
            sendingUser: user.value,
            targetUser: targetUser.value,
            playersOffered: offeredPlayers.value,
            playersWanted: desiredPlayers.value,
            powerplaysOffered: offeredPowerplays.value,
            powerplaysWanted: desiredPowerplays.value,
          });
          toast.add({
            severity: "success",
            summary: "Success",
            detail: "Trade offer sent",
          });
          offerSent.value = true;
        } catch (error) {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: String(error),
          });
        } finally {
          sendingOffer.value = false;
        }
      };
      const confirmOffer = () => {
        confirm.require({
          header: "Confirm",
          message: `Send trade offer to ${targetUser.value?.team_name}?`,
          icon: "pi pi-send",
          accept: () => {
            sendOffer();
          },
        });
      };

      return {
        user,
        userSquad,
        targetUser,
        targetUserSquad,
        xrlTeams,
        selectedTeam,
        desiredPlayers,
        offeredPlayers,
        selectedOffer,
        selectedDesire,
        offerOptions,
        desiredOptions,
        desiredPowerplays,
        addPowerplayToRequest,
        removePowerplayFromRequest,
        addPowerplayToOffer,
        removePowerplayFromOffer,
        offeredPowerplays,
        confirmOffer,
        sendOffer,
        sendingOffer,
        offerSent,
      };
    },
  });
</script>

<style scoped>
  #offerBuilderContainer {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  #tradeOffer {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 10px;
  }
  #offering,
  #for {
    flex: 1 1 400px;
    min-width: 350px;
  }
  .trade-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .trade-player {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .trade-player-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .trade-powerplays {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .trade-powerplays .p-inputgroup {
    width: 120px;
  }
  .trade-powerplays :deep(.p-inputtext) {
    text-align: center;
  }
  .input-field {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
  }
</style>
