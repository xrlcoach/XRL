<template>
  <div class="player">
    <div
      class="jersey"
      :class="selectedPlayerId === 'None' ? '' : 'jerseyFilled'"
      :style="`background: url(${jerseyUrl}) no-repeat center; background-size: contain;`"
      draggable="true"
      @dragstart.stop="onPlayerDragStart"
      @dragend.stop="onPlayerDragEnd"
    ></div>
    <div class="position-info">
      <p>{{ number }}</p>
      <p>{{ pos }}</p>
    </div>
    <div class="player-dropdowns">
      <Dropdown
        :options="options"
        optionValue="player_id"
        optionLabel="player_name"
        v-model="selectedPlayerId"
        @change="onSelectionChange"
        placeholder="--"
      />
      <Dropdown 
        v-if="number > 13"
        :options="positionOptions"
        v-model="position"
        @change="onPositionChange"
        placeholder="--"
        style="margin-top: 5px;"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { Player } from '../global';
  import { DropdownChangeEvent } from 'primevue/dropdown/Dropdown';
import { getJerseyUrl } from '../services/utils';

  export default defineComponent({
    props: {
      number: {
        type: Number,
        required: true,
      },
      pos: String,
      options: Array,
      selectedPlayerId: String,
      position: String,
    },
    emits: ['update:selectedPlayerId', 'update:position', 'dragstart', 'dragend'],
    setup(props, { emit }) {
      // if (props.number === 1) console.log(props);
      const selectedPlayerId = computed(() => props.selectedPlayerId || 'None');

      const options = Array.from(props.options || []) as Player[];
      options.push({
        player_id: '',
        player_name: 'None'
      } as Player);

      const selectedPlayer = computed(() => {
        return options.find(p => p.player_id === selectedPlayerId.value);
      });
      
      const position = ref(props.position || ''); 

      watch(selectedPlayerId, (newValue) => {
        position.value = selectedPlayer.value?.position || '';
      })

      const positionOptions = computed(() => {
        if (selectedPlayer.value) {
          if (position.value) {
            return [position.value, selectedPlayer.value?.position === position.value ? selectedPlayer.value?.position2 : selectedPlayer.value?.position];
          } else {
            position.value = selectedPlayer.value?.position;
            return [selectedPlayer.value?.position, selectedPlayer.value?.position2]
          }
        }
      });

      const jerseyUrl = computed(() => {
        return getJerseyUrl(options.find(p => p.player_id == selectedPlayerId.value)?.nrl_club);
      });

      const onSelectionChange = (event: any) => {
        const { value } = event as DropdownChangeEvent;
        emit('update:selectedPlayerId', value);
      }

      const onPositionChange = (event: any) => {
        const { value } = event as DropdownChangeEvent;
        emit('update:position', value);
      }

      const onPlayerDragStart = () => {
        emit('dragstart', selectedPlayerId.value);
      }
      const onPlayerDragEnd = () => {
        emit('dragend');
      }

      return {
        selectedPlayerId,
        number: props.number,
        pos: props.pos,
        options,
        jerseyUrl,
        position,
        positionOptions,
        onSelectionChange,
        onPositionChange,
        onPlayerDragStart,
        onPlayerDragEnd
      };
    },
  });
</script>

<style scoped lang="scss">
  .player {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .jersey {
    height: 80px;
    width: 100px;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
  }
  .position-info {
    display: flex;
    gap: 1rem;
  }
  .player-dropdowns {
    display: flex;
    flex-direction: column;
    .p-dropdown {
      min-width: 150px;
    }
  }
  .jerseyFilled {
    cursor: grab;
  }
  p {
    font-size: 18;
    font-weight: bold;
  }
  @media screen and (max-width: 960px) {
    .jersey {
      display: none;
    }
    .player {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }
    .position-info {
      flex-direction: column;
      justify-content: flex-start;
      p {
        text-align: left;
      }
    }
    .player-dropdowns {
      width: 70%;
    }
  }
</style>
