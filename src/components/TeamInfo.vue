<template>
  <div>
    <section>
      <Splitter style="height: 350px">
        <SplitterPanel id="logoContainer" :size="20" :minSize="10">
          <div v-if="imgSrc">
            <img :src="imgSrc" alt="Club Logo" :width="200" :height="200" />
          </div>
        </SplitterPanel>
        <SplitterPanel :size="80">
          <Splitter layout="vertical">
            <SplitterPanel id="teamNameContainer" :size="15">
              <h3>{{ activeUser?.team_name }}</h3>
            </SplitterPanel>
            <SplitterPanel :size="85">
              <Splitter>
                <SplitterPanel id="positionContainer" :size="20">
                  <div style="font-size: 62px">
                    <p>{{ position }}</p>
                    <p>{{ activeUser?.stats.points }}pts</p>
                  </div>
                </SplitterPanel>
                <SplitterPanel id="statsContainer" :size="80">
                  <div>
                    <Chart
                      type="pie"
                      :data="resultData"
                      :options="pieChartOptions"
                      :width="300"
                      :height="250"
                    />
                  </div>
                  <div>
                    <Chart
                      type="bar"
                      :data="pointsData"
                      :options="barChartOptions"
                      :width="300"
                      :height="250"
                    />
                  </div>
                </SplitterPanel>
              </Splitter>
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>
    </section>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from "vue";
  import { GetOrdinal } from "../services/utils";
  import Chart from "primevue/chart";
import { useXrlStore } from "../store";

  export default defineComponent({
    setup() {
      const store = useXrlStore();
      const activeUser = computed(() => store.state.user);
      const ladder = computed(() => store.getters.xrlLadder);
      const loading = computed(() => !activeUser.value || !ladder.value);

      const position = computed(() => {
        return GetOrdinal(
          (ladder?.value?.findIndex(
            (u) => u.username == activeUser?.value?.username
          ) ?? 0) + 1
        );
      });

      const imgSrc = computed(() => {
        return activeUser.value
          ? `src/assets/${activeUser?.value?.team_short}.png`
          : null;
      });

      const resultData = computed(() => {
        return {
          labels: ["Wins", "Draws", "Losses"],
          datasets: [
            {
              data: [
                activeUser?.value?.stats.wins,
                activeUser?.value?.stats.draws,
                activeUser?.value?.stats.losses,
              ],
              backgroundColor: ["#81C784", "#fdd87d", "#F48FB1"],
            },
          ],
        };
      });
      const pieChartOptions = {
        responsive: false,
      };
      const diff = computed(
        () =>
          (activeUser?.value?.stats.for ?? 0) -
          (activeUser?.value?.stats.against ?? 0)
      );
      const pointsData = computed(() => {
        return {
          labels: ["Points"],
          datasets: [
            {
              label: "For",
              backgroundColor: "#81C784",
              data: [activeUser?.value?.stats.for],
            },
            {
              label: "Against",
              backgroundColor: "#F48FB1",
              data: [activeUser?.value?.stats.against],
            },
            {
              label: "Diff",
              backgroundColor: diff.value > 0 ? "#81C784" : "#F48FB1",
              data: [diff.value],
            },
          ],
        };
      });
      const barChartOptions = {
        responsive: false,
        scales: {
          yAxes: [
            {
              type: "linear",
              display: true,
              position: "left",
              id: "y-axis-1",
              ticks: {
                min: Math.min(0, diff.value),
              },
            },
          ],
        },
      };
      return {
        loading,
        activeUser,
        ladder,
        position,
        imgSrc,
        resultData,
        pieChartOptions,
        pointsData,
        barChartOptions,
      };
    },
    components: {
      Chart,
    },
  });
</script>

<style scoped>
  #logoContainer,
  #teamNameContainer,
  #positionContainer,
  #statsContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  #statsContainer {
    justify-content: space-evenly;
  }
</style>
