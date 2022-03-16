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
            <h3>Transfers</h3>
          </div>
          <div>
            <div class="p-inputgroup">
              <span
                class="p-inputgroup-addon"
                style="font-size: 1rem; font-weight: normal"
                >Round</span
              >
              <Dropdown v-model="roundNumber" :options="roundNumbers" optionLabel="label" optionValue="value" />
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <transition name="grow" mode="out-in">
          <div v-if="loaded && transfers.length > 0" style="overflow: hidden">
            <DataTable :value="transfers" responsiveLayout="scroll">
              <Column field="datetime"></Column>
              <Column>
                <template #body="slotProps">
                  <div style="display: flex; gap: 10px; align-items: center">
                    <img
                      :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data.userInfo.team_short}.png`"
                      :alt="slotProps.data.userInfo.team_short"
                      :height="50"
                      :width="50"
                    />
                    <span>{{ slotProps.data.userInfo.team_name }}</span>
                  </div>
                </template>
              </Column>
              <Column>
                <template #body="slotProps">
                  <span>{{
                    slotProps.data.type === 'Drop' ? 'DROPPED' : 'SIGNED'
                  }}</span>
                </template>
              </Column>
              <Column>
                <template #body="slotProps">
                  <span>{{ slotProps.data.playerInfo?.player_name }}</span>
                </template>
              </Column>
              <Column>
                <template #body="slotProps">
                  <span>{{
                    slotProps.data.type === 'Scoop'
                      ? 'on a free transfer'
                      : slotProps.data.type === 'Waiver'
                      ? 'on a waiver'
                      : slotProps.data.type === 'Drop'
                      ? ''
                      : 'from ' + slotProps.data.sellerInfo?.team_name
                  }}</span>
                </template>
              </Column>
            </DataTable>
          </div>
        </transition>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref, watch, computed } from 'vue';
  import { Player, Transfer, XrlUser } from '../global';
  import { GetActiveRoundNumber } from '../services/rounds';
  import { GetAllUserInfoSorted } from '../services/users';
  import {
    GetGroupPlayersById,
    GetTransferHistoryByRound,
  } from '../services/xrlApi';
import { useXrlStore } from '../store';
import { ActionTypes } from '../store-types';

  export default defineComponent({
    setup() {
      const store = useXrlStore();

      const loaded = ref(false);
      const error = ref('');

      store.dispatch(ActionTypes.GetTransferHistory).finally(() => loaded.value = true);

      const allUsers = computed(() => store.state.allUsers);
      const roundNumber = ref(store.getters.activeRoundNumber);
      const roundNumbers: { label: string, value: number }[] = [];
      for (let i = roundNumber.value; i > 0; i--) {
        roundNumbers.push({label: String(i), value: i});
      }
      const latestTransferRecords = computed(() => store.state.transfers);
      const transferRecords = ref(latestTransferRecords.value ?? []);

      const allPlayers = computed(() => store.state.allPlayers);
      const transfers = computed(() => {
        const transfers = transferRecords.value.map(t => {
          return {
            ...t,
            userInfo: allUsers.value?.find(u => u.username === t.user),
            playerInfo: allPlayers.value?.find(p => p.player_id === t.player_id),
            sellerInfo: t.seller
              ? allUsers.value?.find(u => u.username === t.seller)
              : undefined,
          };
        });
        return transfers;
      });

      const getTransfers = async (roundNo: number) => {
        try {
          if (roundNo === store.getters.activeRoundNumber) {
            transferRecords.value = latestTransferRecords.value ?? [];
          } else {
            transferRecords.value = await GetTransferHistoryByRound(roundNo);
          }
        } catch (err) {
          error.value = String(err);
        }
      };

      onMounted(() => getTransfers(roundNumber.value));

      watch(roundNumber, async newValue => {
        await getTransfers(newValue);
      });

      return {
        loaded,
        error,
        allUsers,
        roundNumber,
        roundNumbers,
        transfers,
      };
    },
  });
</script>

<style scoped></style>
