<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :breakpoints="{ '960px': '100vw' }"
    :style="{ width: '80vw' }"
  >
    <template #header>
      <h3>
        Trade Offer -
        <span
          :style="{
            color:
              offer.status === 'Pending'
                ? 'var(--yellow-500)'
                : offer.status === 'Accepted'
                ? 'var(--primary-color)'
                : '#F48FB1',
          }"
          >{{ offer.status }}</span
        >
      </h3>
    </template>
    <div id="offerBuilderContainer">
      <section id="targetUser" class="input-field">
        <label for="targetUserSelect">Trade offered to</label>
        <TextInput
          id="targetUserSelect"
          :disabled="true"
          class="p-disabled"
          :modelValue="offer.offeredTo?.team_name"
        />
      </section>
      <form ref="tradeOfferForm" @submit.prevent="sendOffer" id="tradeOffer">
        <section id="offering">
          <Panel header="Offer">
            <div class="trade-content">
              <div class="trade-players">
                <article v-if="!offer.playersOffered.length">
                  No players offered
                </article>
                <article
                  class="trade-player"
                  v-for="player in offer.playersOffered"
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
                </article>
              </div>
              <div class="trade-powerplays">
                <label>Powerplays</label>
                <strong>{{ offer.powerplaysOffered }}</strong>
              </div>
            </div>
            <Divider />
          </Panel>
        </section>
        <section id="for">
          <Panel header="For">
            <div class="trade-content">
              <div class="trade-players">
                <article v-if="!offer.playersWanted.length">
                  No players wanted
                </article>
                <article
                  class="trade-player"
                  v-for="player in offer.playersWanted"
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
                </article>
              </div>
              <div class="trade-powerplays">
                <label>Powerplays</label>
                <strong>{{ offer.powerplaysWanted }}</strong>
              </div>
            </div>
            <Divider />
          </Panel>
        </section>
      </form>
      <section v-if="!offerComplete" class="offerActions">
        <Button
          v-if="isUserOffer"
          type="button"
          class="p-button-danger"
          label="Cancel Offer"
          :loading="cancellingOffer"
          @click="onCancelClick"
          :disabled="offerComplete"
        />
        <template v-else-if="isOfferedToUser">
          <Button
            type="button"
            class="p-button-danger"
            label="Reject Offer"
            :loading="rejectingOffer"
            @click="onRejectClick"
            :disabled="offerComplete"
          />
          <Button
            type="button"
            label="Accept Offer"
            :loading="acceptingOffer"
            @click="onAcceptClick"
            :disabled="offerComplete"
          />
        </template>
      </section>
    </div>
  </Dialog>
</template>

<script lang="ts">
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import { computed, defineComponent, PropType, ref, watch } from "vue";
  import { MappedTradeOffer, TradeOffer } from "../global";
  import { useXrlStore } from "../store";
  import { ActionTypes } from "../store-types";

  export default defineComponent({
    emits: ["complete", "update:visible"],
    props: {
      visible: Boolean,
      offer: {
        type: Object as PropType<MappedTradeOffer>,
        required: true,
      },
      offerRecord: {
        type: Object as PropType<TradeOffer>,
        required: true,
      },
    },
    setup(props) {
      const store = useXrlStore();
      const offer = computed(() => props.offer);
      const offerRecord = computed(() => props.offerRecord);
      const user = computed(() => store.state.user);
      const isUserOffer = computed(() => offer.value.offeredBy?.pk === user.value?.pk);
      const isOfferedToUser = computed(() => offer.value.offeredTo?.pk === user.value?.pk);
      const offerComplete = computed(() => offer.value.status !== "Pending");
      const confirm = useConfirm();
      const toast = useToast();

      const onCancelClick = () => {
        confirm.require({
          header: "Confirm",
          message: `Cancel offer to ${offer.value.offeredTo?.team_name}?`,
          icon: "pi pi-trash",
          accept: () => {
            cancelOffer();
          },
        });
      };
      const onAcceptClick = () => {
        confirm.require({
          header: "Confirm",
          message: `Accept offer from ${offer.value.offeredBy?.team_name}?`,
          icon: "pi pi-check",
          accept: () => {
            acceptOffer();
          },
        });
      };
      const onRejectClick = () => {
        confirm.require({
          header: "Confirm",
          message: `Reject offer from ${offer.value.offeredBy?.team_name}?`,
          icon: "pi pi-times",
          accept: () => {
            rejectOffer();
          },
        });
      };

      const cancellingOffer = ref(false);
      const acceptingOffer = ref(false);
      const rejectingOffer = ref(false);

      const cancelOffer = async () => {
        cancellingOffer.value = true;
        await store.dispatch(ActionTypes.WithdrawTradeOffer, offerRecord.value);
        toast.add({
          severity: "info",
          summary: "Complete",
          detail: "Trade offer withdrawn",
        });
        cancellingOffer.value = false;
      };
      const acceptOffer = async () => {
        acceptingOffer.value = true;
        await store.dispatch(ActionTypes.ProcessTradeOffer, {
          offer: offerRecord.value,
          accepted: true,
        });
        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Trade offer accepted!",
        });
        acceptingOffer.value = false;
      };
      const rejectOffer = async () => {
        rejectingOffer.value = true;
        await store.dispatch(ActionTypes.ProcessTradeOffer, {
          offer: offerRecord.value,
          accepted: false,
        });
        toast.add({
          severity: "info",
          summary: "Done",
          detail: "Trade offer rejected",
        });
        rejectingOffer.value = false;
      };

      return {
        user,
        isUserOffer,
        isOfferedToUser,
        offerComplete,
        onCancelClick,
        onAcceptClick,
        onRejectClick,
        cancellingOffer,
        acceptingOffer,
        rejectingOffer,
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
  .offerActions {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
