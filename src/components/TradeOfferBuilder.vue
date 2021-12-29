<template>
  <div id="offerBuilderContainer">
    <section id="targetUser">
      <label for="targetUserSelect">Offer trade to</label>
      <Dropdown
        id="targetUserSelect"
        v-model="selectedTeam"
        :options="xrlTeams"
      />
    </section>
    <section id="tradeOffer">
      <section id="offering">
        <div>
          <label for="offeredPlayersSelect">Offer</label>
          <Dropdown
            id="offeredPlayersSelect"
            v-model="selectedPlayer"
            :options="userSquad"
            optionLabel="player_name"
          />
        </div>
        <div>
          <Button label="Powerplay" @click="addPowerplayToOffer" icon="pi pi-plus" />
        </div>
      </section>
      <section id="for">
        <div>
          <label for="desiredPlayersSelect">For</label>
          <Dropdown
            id="desiredPlayersSelect"
            v-model="selectedPlayer"
            :options="targetUserSquad"
            optionLabel="player_name"
          />
        </div>
        <div>
          <Button label="Powerplay" @click="addPowerplayToRequest" icon="pi pi-plus" />
        </div>
      </section>
    </section>
    <section id="tradePowerplays"></section>
  </div>
</template>

<script lang="ts">
  import { useConfirm } from 'primevue/useconfirm';
  import { useToast } from 'primevue/usetoast';
  import { defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import { Player, XrlTeam, XrlUser } from '../global';
  import { XrlTeams } from '../services/players';
  import { GetUserInfo, GetUserInfoByTeamShort } from '../services/users';
  import { GetPlayersFromXrlTeam } from '../services/xrlApi';

  export default defineComponent({
    props: {
      player: {
        type: Object as PropType<Player>,
        required: false,
      },
    },
    setup({ player }) {
      const user = ref<XrlUser>();
      const userSquad = ref([] as Player[]);
      const targetUser = ref<XrlUser>();
      const targetUserSquad = ref([] as Player[]);

      const xrlTeams = XrlTeams.filter(team => team !== 'None');
      const selectedTeam = ref<XrlTeam>('None');

      watch(selectedTeam, async team => {
        if (selectedTeam.value !== 'None') {
          targetUser.value = await GetUserInfoByTeamShort(team);
          targetUserSquad.value = await GetPlayersFromXrlTeam(team);
          desiredPlayers.value = [];
          desiredPowerplays.value = 0;
        }
      });

      const desiredPlayers = ref([] as Player[]);
      if (player) desiredPlayers.value.push(player);
      const offeredPlayers = ref([] as Player[]);
      const selectedPlayer = ref<Player>();

      watch(selectedPlayer, p => {
        if (p) {
          if (p?.xrl_team === user.value?.team_short) {
            if (!offeredPlayers.value.includes(p)) {
              offeredPlayers.value.push(p);
            }
          } else {
            if (!desiredPlayers.value.includes(p)) {
              desiredPlayers.value.push(p);
            }
          }
        }
      });

      const desiredPowerplays = ref(0);
      const addPowerplayToRequest = () => {
        if (targetUser.value && desiredPowerplays.value < targetUser.value.powerplays) {
          desiredPowerplays.value++;
        }
      }
      const removePowerplayFromRequest = () => {
        desiredPowerplays.value = Math.max(0, desiredPowerplays.value - 1);
      }
      const offeredPowerplays = ref(0);
      const addPowerplayToOffer = () => {
        if (user.value && offeredPowerplays.value < user.value.powerplays) {
          offeredPowerplays.value++;
        }
      }
      const removePowerplayFromOffer = () => {
        offeredPowerplays.value = Math.max(0, offeredPowerplays.value - 1);
      }

      const confirm = useConfirm();
      const toast = useToast();
      const sendOffer = () => {
        confirm.require({
          header: 'Confirm',
          message: `Send trade offer to ${targetUser.value?.team_name}?`,
          icon: 'pi pi-send',
          accept: () => {
            toast.add({
              severity: 'info',
              summary: 'Success',
              detail: 'Trade offer sent',
              life: 3000,
            });
          },
        });
      };

      onMounted(async () => {
        user.value = await GetUserInfo();
        if (player) {
          targetUser.value = await GetUserInfoByTeamShort(player.xrl_team);
          targetUserSquad.value = await GetPlayersFromXrlTeam(player.xrl_team);
        }
      });

      return {
        user,
        userSquad,
        targetUser,
        targetUserSquad,
        xrlTeams,
        selectedTeam,
        desiredPlayers,
        offeredPlayers,
        selectedPlayer,
        desiredPowerplays,
        addPowerplayToRequest,
        removePowerplayFromRequest,
        addPowerplayToOffer,
        removePowerplayFromOffer,
        offeredPowerplays,
        sendOffer,
      };
    },
  });
</script>

<style scoped></style>
