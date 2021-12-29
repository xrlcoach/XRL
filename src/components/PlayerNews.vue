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
            <DataTable :value="news" :key="news">
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
  import { defineComponent, onMounted, ref, watch } from 'vue';
  import { PlayerNews } from '../global';
  import { GetActiveRoundNumber } from '../services/rounds';
  import { GetPlayerNews } from '../services/xrlApi';

  export default defineComponent({
    setup() {
      const loaded = ref(false);
      const news = ref([] as PlayerNews[]);
      const roundNumber = ref(GetActiveRoundNumber());

      const roundOptions: { label: string; value: number }[] = [];
      for (let i = GetActiveRoundNumber(); i > 0; i--) {
        roundOptions.push({ label: String(i), value: i });
      }

      watch(roundNumber, async newNumber => {
        console.log('Getting news');
        news.value = await GetPlayerNews(newNumber);
        console.log(news.value.length);
      });

      onMounted(async () => {
        news.value = await GetPlayerNews(roundNumber.value);
        loaded.value = true;
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
