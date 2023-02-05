<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    style="width: 500px"
    header="Add New Player"
  >
    <form class="p-grid p-formgrid p-fluid" @submit="createPlayer">
      <Message v-if="error" severity="error">{{ error }}</Message>
      <div class="p-col-12 p-field">
        <label>Player Name</label>
        <TextInput v-model="newPlayer.player_name" />
      </div>
      <div class="p-col-12 p-field">
        <label>NRL Club</label>
        <Dropdown v-model="newPlayer.nrl_club" :options="clubOptions" />
      </div>
      <div class="p-col-12 p-field">
        <label>Position</label>
        <Dropdown v-model="newPlayer.position" :options="positionOptions" />
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
  import { NewPlayerInput } from '../global';
  import { CreateNewPlayer } from '../services/xrlApi';
  import { NrlClubs, PositionOrder } from '../services/players';
  import { ref } from 'vue';
  import type { Ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { store, useXrlStore } from '../store';
import { ActionTypes } from '../store-types';
  export default {
    props: {
      visible: Boolean,
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
      const { visible } = props;

      const store = useXrlStore();

      const newPlayer: Ref<NewPlayerInput> = ref({
        player_name: '',
        nrl_club: null,
        position: null,
        position2: null,
        position3: null,
      });

      const loading = ref(false),
        error = ref('');

      const clubOptions = [...NrlClubs];
      const positionOptions = [...PositionOrder];

      const toast = useToast();

      const createPlayer = async (e: Event) => {
        e.preventDefault();
        (loading.value = true), (error.value = '');
        try {
          const player = await store.dispatch(ActionTypes.CreatePlayer, newPlayer.value);
          console.log({ createdPlayer: player });
          toast.add({
            severity: 'success',
            summary: 'Success',
            detail: "Player added successfully",
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
        newPlayer,
        createPlayer,
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
