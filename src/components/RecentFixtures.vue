<template>
  <div>
    <Splitter style="height: 350px">
      <SplitterPanel :size="50">
        <h4>Last Match</h4>
        <FixturePreview :fixture="lastMatch" />
      </SplitterPanel>
      <SplitterPanel :size="50">
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

    const loading = ref(false);
    const error = ref('');

    const lastMatch = computed(() => store.getters.lastMatch);
    const nextMatch = computed(() => store.getters.nextMatch);

    return {
      loading,
      error,
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
  
</style>