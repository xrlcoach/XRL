<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    style="width: 500px"
    header="Update Player"
  >
    <form class="p-grid p-formgrid p-fluid" @submit="updatePlayer">
      <Message v-if="error" severity="error">{{ error }}</Message>
      <div class="p-col-12 p-field">
        <label>Player Name</label>
        <TextInput v-model="playerUpdate.player_name" />
      </div>
      <div class="p-col-12 p-field">
        <label>NRL Club</label>
        <Dropdown v-model="playerUpdate.nrl_club" :options="clubOptions" />
      </div>
      <div class="p-col-12 p-field">
        <label>Position</label>
        <Dropdown v-model="playerUpdate.position" :options="positionOptions" />
      </div>
      <div class="p-col-12 p-field">
        <label>Position 2</label>
        <Dropdown v-model="playerUpdate.position2" :options="positionOptions" showClear />
      </div>
      <div class="p-col-12 p-field">
        <label>Position 3</label>
        <Dropdown v-model="playerUpdate.position3" :options="positionOptions" showClear />
      </div>
      <div class="p-col-12 p-d-flex p-jc-between">
        <div>
          <Button type="button" class="p-button-secondary" label="Cancel" @click="cancel" />
        </div>
        <div>
          <Button type="submit" label="Confirm" :loading="loading" />
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script lang="ts">
  import type { UpdatePlayerInput, Player, NrlClub } from '../global';
  import { CreateNewPlayer } from '../services/xrlApi';
  import { NrlClubs, PositionOrder } from '../services/players';
  import { ref } from 'vue';
  import type { Ref, PropType } from 'vue';
import { useToast } from 'primevue/usetoast';
import { store, useXrlStore } from '../store';
import { ActionTypes } from '../store-types';
  export default {
    props: {
      visible: {
        type: Boolean,
      },
      player: {
        type: Object as PropType<Player>,
        required: true
      }
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
      const { visible, player } = props;

      const store = useXrlStore();

      const playerUpdate: Ref<UpdatePlayerInput> = ref({
        player_id: player.player_id,
        player_name: player.player_name,
        nrl_club: player.nrl_club,
        position: player.position,
        position2: player.position2,
        position3: player.position3,
      });

      const loading = ref(false),
        error = ref('');

      const clubOptions = [...NrlClubs];
      const positionOptions = [...PositionOrder];

      const toast = useToast();

      const updatePlayer = async (e: Event) => {
        e.preventDefault();
        (loading.value = true), (error.value = '');
        try {
          const updatedPlayer = await store.dispatch(ActionTypes.UpdatePlayer, playerUpdate.value);
          console.log({ updatedPlayer });
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: "Player updated successfully",
            life: 3000,
          });
          emit('update:visible', false);
        } catch (err) {
          error.value = String(err);
        } finally {
          loading.value = false;
        }
      };
      const cancel = () => emit('update:visible', false);
      return {
        playerUpdate,
        updatePlayer,
        clubOptions,
        positionOptions,
        cancel,
        loading,
        error,
      };
    },
  };
</script>

<style scoped></style>
