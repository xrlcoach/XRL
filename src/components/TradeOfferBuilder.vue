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
            v-model="offeredPlayers[0]"
            :options="userSquad"
            optionLabel="player_name"
          />
        </div>
        <div>
          <Button class="p-button-link" label="Add Player" icon="pi pi-plus" @click="desiredPlayers.push(null)" />
        </div>
        <div>
          <Button
            label="Powerplay"
            @click="addPowerplayToOffer"
            icon="pi pi-plus"
          />
        </div>
      </section>
      <section id="for">
        <div>
          <label for="desiredPlayersSelect">For</label>
          <Dropdown
            id="desiredPlayersSelect"
            v-model="desiredPlayers[0]"
            :options="targetUserSquad"
            optionLabel="player_name"
          />
        </div>
        <div>
          <Button
            label="Powerplay"
            @click="addPowerplayToRequest"
            icon="pi pi-plus"
          />
        </div>
      </section>
    </section>
    <section id="tradePowerplays"></section>
  </div>
</template>

<script lang="ts">
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import { computed, defineComponent, PropType, ref, watch } from "vue";
  import { Player, XrlTeam, XrlUser } from "../global";
  import { XrlTeams } from "../services/players";
  import { useXrlStore } from "../store";

  export default defineComponent({
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

      const desiredPlayers = ref(player ? [player] : [] as Player[]);
      if (player) desiredPlayers.value.push(player);
      const offeredPlayers = ref([] as Player[]);
      const selectedPlayer = ref<Player>();

      watch(selectedPlayer, (p) => {
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
      const sendOffer = () => {
        confirm.require({
          header: "Confirm",
          message: `Send trade offer to ${targetUser.value?.team_name}?`,
          icon: "pi pi-send",
          accept: () => {
            toast.add({
              severity: "info",
              summary: "Success",
              detail: "Trade offer sent",
              life: 3000,
            });
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
