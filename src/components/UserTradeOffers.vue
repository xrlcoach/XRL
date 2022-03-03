<template>
  <div>
    <Card layout="vertical">
      <template #title>
        <div
          style="
            display: flex;
            justify-content: space-evenly;
            align-items: center;
          "
        >
          <div>
            <h3>Trade Offers</h3>
          </div>
        </div>
      </template>
      <template #content>
        <transition name="grow" mode="out-in">
          <div v-if="loaded && tradeOffers.length > 0" style="overflow: hidden">
            <DataTable :value="tradeOffers" responsiveLayout="scroll">
              <Column field="date"></Column>
              <Column header="Offer From">
                <template #body="slotProps">
                  <div style="display: flex; gap: 10px; align-items: center">
                    <img
                      :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data.offeredBy.team_short}.png`"
                      :alt="slotProps.data.offeredBy.team_short"
                      :height="50"
                      :width="50"
                    />
                    <span>{{ slotProps.data.offeredBy.team_name }}</span>
                  </div>
                </template>
              </Column>
              <Column header="To">
                <template #body="slotProps">
                  <div style="display: flex; gap: 10px; align-items: center">
                    <img
                      :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data.offeredTo.team_short}.png`"
                      :alt="slotProps.data.offeredTo.team_short"
                      :height="50"
                      :width="50"
                    />
                    <span>{{ slotProps.data.offeredTo.team_name }}</span>
                  </div>
                </template>
              </Column>
              <Column header="Deal">
                <template #body="slotProps">
                  <span>{{ getOfferText(slotProps.data) }}</span>
                </template>
              </Column>
              <Column header="Status" field="status"></Column>
              <Column>
                <template #body="slotProps">
                  <Button
                    v-if="slotProps.data.status === 'Pending'"
                    label="View"
                    @click="viewTradeOffer(slotProps.data)"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </transition>
      </template>
    </Card>
    <TradeOfferView
      v-if="selectedOffer && selectedOfferRecord && tradeViewerVisible"
      v-model:visible="tradeViewerVisible"
      :offer="selectedOffer"
      :offerRecord="selectedOfferRecord"
    />
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    onMounted,
    ref,
    watch,
    computed,
    ComputedRef,
  } from "vue";
  import { MappedTradeOffer, TradeOffer } from "../global";
  import { useXrlStore } from "../store";
  import { ActionTypes } from "../store-types";
  import TradeOfferView from "./TradeOfferView.vue";

  export default defineComponent({
    components: { TradeOfferView },
    setup() {
      const store = useXrlStore();

      const loaded = ref(false);
      const error = ref("");

      store
        .dispatch(ActionTypes.GetTradeOffers)
        .finally(() => (loaded.value = true));

      const user = computed(() => store.state.user);
      const allUsers = computed(() => store.state.allUsers);
      const offers = computed(() => store.state.tradeOffers);

      const allPlayers = computed(() => store.state.allPlayers);
      const tradeOffers: ComputedRef<MappedTradeOffer[]> = computed(() => {
        return (offers.value ?? []).map((o) => {
          return {
            pk: o.pk,
            offeredBy: (allUsers.value ?? []).find(
              (u) => u.username === o.offered_by
            ),
            userOffer: o.offered_by === user.value?.username,
            offeredTo: (allUsers.value ?? []).find(
              (u) => u.username === o.offered_to
            ),
            playersOffered: o.players_offered.map((id) =>
              (allPlayers.value ?? []).find((p) => p.player_id === id)
            ),
            playersWanted: o.players_wanted.map((id) =>
              (allPlayers.value ?? []).find((p) => p.player_id === id)
            ),
            powerplaysOffered: o.powerplays_offered,
            powerplaysWanted: o.powerplays_wanted,
            date: o.datetime,
            status: o.offer_status,
          };
        });
      });

      const getOfferText = (offer: MappedTradeOffer) => {
        let text = "";
        if (!offer.playersOffered?.length && !offer.powerplaysOffered)
          text = "Nothing";
        if (offer.playersOffered?.length) {
          text += offer.playersOffered.map((p) => p?.player_name).join(", ");
          if (offer.powerplaysOffered) text += " and ";
        }
        if (offer.powerplaysOffered)
          text +=
            offer.powerplaysOffered +
            " powerplay" +
            (offer.powerplaysOffered > 1 ? "s" : "");
        text += " for ";
        if (!offer.playersWanted?.length && !offer.powerplaysWanted)
          text += "nothing";
        if (offer.playersWanted?.length) {
          text += offer.playersWanted.map((p) => p?.player_name).join(", ");
          if (offer.powerplaysWanted) text += " and ";
        }
        if (offer.powerplaysWanted)
          text +=
            offer.powerplaysWanted +
            " powerplay" +
            (offer.powerplaysWanted > 1 ? "s" : "");
        return text;
      };

      const tradeViewerVisible = ref(false);
      const selectedOffer = ref<MappedTradeOffer | null>(null);
      const selectedOfferRecord = ref<TradeOffer | null>(null);

      const viewTradeOffer = (offer: MappedTradeOffer) => {
        selectedOffer.value = offer;
        const offerRecord = offers.value?.find(o => o.pk === offer.pk) ?? null;
        selectedOfferRecord.value = offerRecord; 
        tradeViewerVisible.value = true;
      };

      watch(tradeOffers, (newValue) => {
        if (selectedOffer.value) {
          const updatedOffer = newValue.find(o => o.pk === selectedOffer.value?.pk);
          if (updatedOffer) {
            selectedOffer.value = updatedOffer;
          }
        }
      })

      return {
        loaded,
        error,
        allUsers,
        tradeOffers,
        getOfferText,
        viewTradeOffer,
        selectedOffer,
        selectedOfferRecord,
        tradeViewerVisible,
      };
    },
  });
</script>

<style scoped></style>
