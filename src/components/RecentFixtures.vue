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
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue'
import { XrlFixture } from '../global';
import { GetUserActiveFixture, GetUserLastFixture } from '../services/rounds';
import FixturePreview from './FixturePreview.vue';

export default defineComponent({
  setup () {
    const loading = ref(false);
    const error = ref('');

    const lastMatch = ref<XrlFixture>();
    const nextMatch = ref<XrlFixture>();

    const loadData = async () => {
      loading.value = true;
      try {
        lastMatch.value = await GetUserLastFixture();
        nextMatch.value = await GetUserActiveFixture();
      } catch (err) {
        error.value = err;
      } finally {
        loading.value = false;
      }
    }

    onBeforeMount(() => {
      loadData()
    });

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