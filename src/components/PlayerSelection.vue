<template>
  <div class="player">
    <div
      class="jersey"
      :style="`background: url(${jerseyUrl}) no-repeat center; background-size: contain;`"
    ></div>
    <p>{{ number }}</p>
    <Dropdown
      :options="options"
      optionValue="player_id"
      optionLabel="player_name"
      v-model="selectedPlayerId"
      @change="$emit('update:selectedPlayerId', $event.value)"
      placeholder="--"
    />
    <Dropdown 
      v-if="number > 13"
      :options="positionOptions"
      v-model="position"
      @change="$emit('update:position', $event.value)"
      placeholder="--"
      style="margin-top: 5px;"
    />
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, watch } from 'vue';
  import { Player } from '../global';

  export default defineComponent({
    props: {
      number: Number,
      options: Array,
      selectedPlayerId: String,
      position: String,
    },
    emits: ['update:selectedPlayerId', 'update:position'],
    setup(props) {
      // if (props.number === 1) console.log(props);
      const selectedPlayerId = ref(props.selectedPlayerId || 'None');

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
        return encodeURI(
          `src/assets/jerseys/${
            options.find(p => p.player_id == selectedPlayerId.value)
              ?.nrl_club || 'default'
          }_jersey.png`
        );
      });

      // watch(selectedPlayerId, newValue => {
      //   context.emit('selection-change', newValue);
      // });

      return {
        selectedPlayerId,
        number: props.number,
        options,
        jerseyUrl,
        position,
        positionOptions
      };
    },
  });
</script>

<style scoped>
  .player {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .jersey {
    height: 150px;
    width: 100px;
    background-size: contain;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  p {
    font-size: 18;
    font-weight: bold;
  }
</style>
