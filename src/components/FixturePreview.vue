<template>
  <article>
    <router-link v-if="fixture" :to="fixtureLink" class="fixture-preview">
      <div>
        <p>
          <img :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${fixture?.home}.png`" :height="100" :width="100" />
        </p>
        <p>{{ fixture?.home }}&nbsp;{{ fixture?.home_score }}</p>
      </div>
      <div>
        <p>vs</p>
      </div>
      <div>
        <p>
          <img :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${fixture?.away}.png`" :height="100" :width="100" />
        </p>
        <p>{{ fixture?.away_score }}&nbsp;{{ fixture?.away }}</p>
      </div>
    </router-link>
    <small v-else>No match last week</small>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { XrlFixture } from '../global';

export default defineComponent({
  props: {
    fixture: {
      type: Object as PropType<XrlFixture | null>,
      default: null,
    }
  },
  setup(props) {
    const { fixture } = props;
    const fixtureLink = computed(() => {
      return {
        name: 'MatchCentre',
        query: {
          round: fixture?.round_number ?? fixture?.pk.split('#')[2],
          fixture: fixture?.home + '-v-' + fixture?.away
        }
      }
    });
    return {
      fixtureLink
    }
  }
});
</script>

<style scoped lang="scss">
article {
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.fixture-preview {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 50px;
  font-size: 42px;
  text-decoration: none;
  color: inherit;
}
</style>
