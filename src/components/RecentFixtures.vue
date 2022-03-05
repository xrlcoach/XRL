<template>
  <div>
    <Splitter id="recentFixturesContainer" :layout="isMobile ? 'vertical' : 'horizontal'">
      <SplitterPanel class="fixture-container" :size="50">
        <h4>Last Match</h4>
        <FixturePreview :fixture="lastMatch" />
      </SplitterPanel>
      <SplitterPanel class="fixture-container" :size="50">
        <h4>Next Match</h4>
        <FixturePreview :fixture="nextMatch" />
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onMounted, ref } from 'vue'
import { XrlFixture } from '../global';
import { GetUserActiveFixture, GetUserLastFixture } from '../services/rounds';
import { useXrlStore } from '../store';
import { XrlStore } from '../store-types';
import FixturePreview from './FixturePreview.vue';

export default defineComponent({
  setup () {
    const store = useXrlStore() as XrlStore;

    const isMobile = computed(() => store.state.isMobile);

    const loading = ref(false);
    const error = ref('');

    const lastMatch = computed(() => store.getters.lastMatch);
    const nextMatch = computed(() => store.getters.nextMatch);

    return {
      loading,
      error,
      isMobile,
      lastMatch,
      nextMatch
    }
  },
  components: {
    FixturePreview
  }
})
</script>

<style scoped>
  #recentFixturesContainer {
    min-height: 350px;
  }
  .fixture-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>