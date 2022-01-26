<template>
  <div v-if="appearance" id="profileContainer">
    <div id="playerInfo">
      <div style="display: flex; align-items: center; justify-content: start; gap: 20px; margin-bottom: 20px;">
        <h1>{{ appearance.player_name }}</h1>
        <div style="display: flex; gap: 20px;">
          <Tag
            v-if="appearance.captain || appearance.captain2"
            value="Captain"
            severity="success"
          />
          <Tag v-if="appearance.vice" value="Vice-Captain" severity="success" />
          <Tag v-if="appearance.kicker" value="Kicker" severity="info" />
          <Tag
            v-if="appearance.backup_kicker"
            value="Backup Kicker"
            severity="warning"
          />
        </div>
      </div>
      <div class="row">
        <div class="cell">
          <h4>NRL Club</h4>
          <img
            :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${appearance.nrl_club}.svg`"
            :alt="appearance.nrl_club"
            :height="50"
            :width="50"
          />
        </div>
        <Divider layout="vertical" />
        <div class="cell">
          <h4>XRL Team</h4>
          <img
            :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${appearance.xrl_team}.png`"
            :alt="appearance.xrl_team"
            :height="50"
            :width="50"
          />
        </div>
        <Divider layout="vertical" />
        <div class="cell">
          <h4>Positions</h4>
          <p class="value">
            {{ appearance.position_general
            }}{{
              appearance.second_position
                ? `, ${appearance.second_position}`
                : ''
            }}
          </p>
        </div>
      </div>
    </div>
    <Divider />
    <Accordion :multiple="true">
      <AccordionTab header="NRL">
        <div class="row">
          <p
            :style="{
              'font-size': '20px',
              color: appearance.played_nrl
                ? 'var(--primary-color)'
                : 'var(--pink-300)',
            }"
          >
            {{ appearance.played_nrl ? 'PLAYED' : 'DID NOT PLAY' }}
          </p>
        </div>
        <Divider />
        <div class="row" v-if="appearance.played_nrl">
          <div class="cell">
            <h4>Opponent</h4>
            <img
              :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${appearance.appearanceStats?.opponent}.svg`"
              :alt="appearance.appearanceStats?.opponent"
              :height="50"
              :width="50"
            />
          </div>
          <Divider layout="vertical" />
          <div class="cell">
            <h4>Minutes</h4>
            <p class="value">
              {{ appearance.appearanceStats?.stats['Mins Played'] ?? 0 }}
            </p>
          </div>
          <Divider layout="vertical" />
          <div class="cell">
            <h4>Position</h4>
            <p class="value">
              {{ appearance.appearanceStats?.stats.Position ?? 'N/A' }}
            </p>
          </div>
        </div>
      </AccordionTab>
      <AccordionTab header="XRL">
        <div class="row">
          <p
            :style="{
              'font-size': '20px',
              color: appearance.played_xrl
                ? 'var(--primary-color)'
                : 'var(--pink-300)',
            }"
          >
            {{ appearance.played_xrl ? 'PLAYED' : 'DID NOT PLAY' }}
          </p>
        </div>
        <Divider />
        <div class="row">
          <div class="cell">
            <h4>Points</h4>
            <p
              class="value"
              :style="
                appearance.score && appearance.score > 0
                  ? 'color: var(--primary-color);'
                  : appearance.score && appearance.score < 0
                  ? 'color: var(--pink-300)'
                  : ''
              "
            >
              {{ appearance.score ?? 0 }}
            </p>
          </div>
          <Divider layout="vertical" />
          <div class="cell">
            <h4>Played As</h4>
            <p class="value">{{ xrlPosition }}</p>
          </div>
          <Divider layout="vertical" />
          <div class="cell">
            <h4>Scored As</h4>
            <p class="value">
              {{ appearance.position_general }}
            </p>
          </div>
        </div>
      </AccordionTab>
      <AccordionTab header="Stats">
        <div id="playerStats" v-if="appearance.appearanceStats">
          <TabView v-model:activeIndex="activeIndex">
            <TabPanel header="Scoring">
              <ScrollPanel style="width: 100%; height: 200px">
                <ul>
                  <li>
                    <p>Tries</p>
                    <p
                      class="value"
                      :style="
                        appearance.appearanceStats?.stats.Tries
                          ? 'color: var(--primary-color);'
                          : ''
                      "
                    >
                      {{ appearance.appearanceStats?.stats.Tries }}
                    </p>
                  </li>
                  <li>
                    <p>Involvement Tries</p>
                    <p
                      class="value"
                      :style="
                        p1ScoringStats.involvement_try > 0
                          ? 'color: var(--primary-color);'
                          : ''
                      "
                    >
                      {{ p1ScoringStats.involvement_try ? 1 : 0 }}
                    </p>
                  </li>
                  <li>
                    <p>Positional Tries</p>
                    <p
                      class="value"
                      :style="
                        p1ScoringStats.positional_try > 0
                          ? 'color: var(--primary-color);'
                          : ''
                      "
                    >
                      {{ p1ScoringStats.positional_try ? 1 : 0 }}
                    </p>
                  </li>
                  <li>
                    <p>Goals</p>
                    <p
                      class="value"
                      :style="
                        kickingStats?.goals
                          ? 'color: var(--primary-color);'
                          : ''
                      "
                    >
                      {{ kickingStats?.goals }}
                    </p>
                  </li>
                  <li>
                    <p>1pt Field Goals</p>
                    <p
                      class="value"
                      :style="
                        p1ScoringStats.field_goals > 0
                          ? 'color: var(--primary-color);'
                          : ''
                      "
                    >
                      {{ p1ScoringStats.field_goals }}
                    </p>
                  </li>
                  <li>
                    <p>2pt Field Goals</p>
                    <p
                      class="value"
                      :style="
                        p1ScoringStats['2point_field_goals'] > 0
                          ? 'color: var(--primary-color);'
                          : ''
                      "
                    >
                      {{ p1ScoringStats['2point_field_goals'] }}
                    </p>
                  </li>
                  <li>
                    <p>MIAs</p>
                    <p
                      class="value"
                      :style="
                        p1ScoringStats.mia > 0
                          ? 'color: var(--pink-300);'
                          : 'color: var(--primary-color);'
                      "
                    >
                      {{ p1ScoringStats.mia ? 1 : 0 }}
                    </p>
                  </li>
                  <li>
                    <p>Concedes</p>
                    <p
                      class="value"
                      :style="
                        p1ScoringStats.concede > 0
                          ? 'color: var(--pink-300);'
                          : 'color: var(--primary-color);'
                      "
                    >
                      {{ p1ScoringStats.concede ? 1 : 0 }}
                    </p>
                  </li>
                  <li>
                    <p>Sin Bins</p>
                    <p
                      class="value"
                      :style="
                        p1ScoringStats.sin_bins > 0
                          ? 'color: var(--yellow-500);'
                          : 'color: var(--primary-color);'
                      "
                    >
                      {{ p1ScoringStats.sin_bins }}
                    </p>
                  </li>
                  <li>
                    <p>Send Offs</p>
                    <p
                      class="value"
                      :style="
                        p1ScoringStats.send_offs > 0
                          ? 'color: var(--pink-300);'
                          : 'color: var(--primary-color);'
                      "
                    >
                      {{ p1ScoringStats.send_offs }}
                    </p>
                  </li>
                </ul>
              </ScrollPanel>
            </TabPanel>
            <TabPanel header="Key">
              <ScrollPanel style="width: 100%; height: 200px">
                <ul>
                  <li v-for="stat of keyStats" :key="stat.stat">
                    <p>{{ stat.stat }}</p>
                    <p class="value">{{ stat.value }}</p>
                  </li>
                </ul>
              </ScrollPanel>
            </TabPanel>
            <TabPanel header="All">
              <ScrollPanel style="width: 100%; height: 200px">
                <ul>
                  <li v-for="stat of allStats" :key="stat.stat">
                    <p>{{ stat.stat }}</p>
                    <p class="value">{{ stat.value }}</p>
                  </li>
                </ul>
              </ScrollPanel>
            </TabPanel>
          </TabView>
        </div>
        <div v-else>
          <p>None</p>
        </div>
      </AccordionTab>
    </Accordion>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref } from 'vue';
  import {
    Player,
    PlayerLineupEntryWithStats,
    PlayerRawStats,
    PlayerScoringStats,
    ScoringStats,
  } from '../global';
  import TabView from 'primevue/tabview';
  import TabPanel from 'primevue/tabpanel';
  import ScrollPanel from 'primevue/scrollpanel';
  import Accordion from 'primevue/accordion';
  import AccordionTab from 'primevue/accordiontab';
  import Tag from 'primevue/tag';
  import { XrlRelevantStats, PositionMap } from '../services/utils';

  export default defineComponent({
    props: {
      appearance: {
        type: Object as PropType<PlayerLineupEntryWithStats>,
        required: true,
      },
    },
    setup({ appearance }) {
      const loaded = ref(false);

      const xrlPosition =
        PositionMap[appearance.position_specific as keyof typeof PositionMap];
      const position1 = appearance.position_general;
      const p1ScoringStats = appearance.appearanceStats?.scoring_stats[
        position1 as keyof PlayerScoringStats
      ] as ScoringStats;
      let p2ScoringStats;
      if (appearance.second_position) {
        p2ScoringStats = appearance.appearanceStats?.scoring_stats[
          appearance.second_position as keyof PlayerScoringStats
        ] as ScoringStats;
      }
      const kickingStats = appearance.appearanceStats?.scoring_stats.kicker;
      const allStats = Object.keys(appearance.appearanceStats?.stats ?? {}).map(
        statName => {
          return {
            stat: statName,
            value:
              appearance.appearanceStats?.stats[
                statName as keyof PlayerRawStats
              ],
          };
        }
      );
      const keyStats = allStats.filter(stat =>
        XrlRelevantStats.includes(stat.stat)
      );
      const activeIndex = ref(0);

      onMounted(async () => {
        loaded.value = true;
      });

      return {
        activeIndex,
        xrlPosition,
        p1ScoringStats,
        p2ScoringStats,
        kickingStats,
        allStats,
        keyStats,
        loaded,
      };
    },
    components: {
      TabView,
      TabPanel,
      ScrollPanel,
      Accordion,
      AccordionTab,
      Tag,
    },
  });
</script>

<style scoped>
  h1 {
    margin-bottom: 20px;
  }
  #profileContainer {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  #playerStats {
    width: 100%;
  }
  .row {
    display: flex;
    gap: 10px;
    justify-content: space-evenly;
    align-items: center;
  }
  .cell {
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    text-align: center;
  }
  ul {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    width: 100%;
  }
  li {
    display: flex;
    width: 200px;
    justify-content: space-between;
    align-items: center;
    background-color: var(--surface-b);
    border-radius: 5px;
    padding: 5px 10px;
  }
  .value {
    font-size: 20px;
    font-weight: 350;
  }
  h1 {
    margin-bottom: 0px;
  }
</style>
