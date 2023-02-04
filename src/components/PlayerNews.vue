<template>
  <div>
    <Card>
      <template #title>
        <div
          style="
            display: flex;
            justify-content: space-evenly;
            align-items: center;
          "
        >
          <div>
            <h3>News</h3>
          </div>
          <div>
            <div class="p-inputgroup">
              <span
                class="p-inputgroup-addon"
                style="font-size: 1rem; font-weight: normal"
                >Round</span
              >
              <Dropdown
                id="roundSelect"
                :options="roundOptions"
                optionLabel="label"
                optionValue="value"
                v-model="roundNumber"
              />
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <transition name="grow" mode="out-in">
          <div v-if="loaded && news.length > 0" style="overflow: hidden">
            <DataTable :value="news">
              <Column field="datetime" style="width: 25%"></Column>
              <Column field="log"></Column>
            </DataTable>
          </div>
        </transition>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref, watch } from 'vue';
  import { PlayerNews } from '../global';
  import { GetActiveRoundNumber } from '../services/rounds';
  import { GetPlayerNews } from '../services/xrlApi';
import { useXrlStore } from '../store';
import { ActionTypes } from '../store-types';

  export default defineComponent({
    setup() {
      const store = useXrlStore();
      const loaded = ref(false);

      store.dispatch(ActionTypes.GetPlayerNews).finally(() => loaded.value = true);

      const latestNews = computed(() => store.state.news);
      const news = ref(latestNews.value ?? []);
      const roundNumber = ref(store.getters.activeRoundNumber);

      const roundOptions: { label: string; value: number }[] = [];
      for (let i = store.getters.activeRoundNumber; i > 0; i--) {
        roundOptions.push({ label: String(i), value: i });
      }

      watch(latestNews, (value) => {
        news.value = value ?? [];
      });

      watch(roundNumber, async newNumber => {
        if (newNumber === store.getters.activeRoundNumber) {
          news.value = latestNews.value ?? [];
        } else {
          console.log('Getting news');
          news.value = await GetPlayerNews(newNumber);
          console.log(news.value.length);
        }
      });

      return {
        loaded,
        roundNumber,
        roundOptions,
        news,
      };
    },
  });
</script>

<style scoped></style>
