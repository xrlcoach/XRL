<template>
  <div v-if="player" id="profileContainer">
    <div id="playerInfo">
      <h1>{{ player.player_name }}</h1>
      <div class="row">
        <div class="cell">
          <h4>NRL Club</h4>
          <img
            :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${player.nrl_club}.svg`"
            :alt="player.nrl_club"
            :height="50"
            :width="50"
          />
        </div>
        <Divider layout="vertical" />
        <div class="cell">
          <h4>XRL Team</h4>
          <img
            :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${player.xrl_team}.png`"
            :alt="player.xrl_team"
            :height="50"
            :width="50"
          />
        </div>
        <Divider layout="vertical" />
        <div class="cell">
          <h4>Positions</h4>
          <p class="value">
            {{
              player.position
            }}{{ player.position2 ? `, ${player.position2}` : '' }}
          </p>
        </div>
      </div>
      <Divider />
      <div class="row">
        <div class="cell">
          <h4>Appearances</h4>
          <p class="value">{{ player.stats.appearances ?? 0 }}</p>
        </div>
        <Divider layout="vertical" />
        <div class="cell">
          <h4>Points</h4>
          <p class="value">{{ p1ScoringStats.points }}</p>
        </div>
        <Divider layout="vertical" />
        <div class="cell">
          <h4>Captained</h4>
          <p class="value">{{ player.times_as_captain }}</p>
        </div>
      </div>
    </div>
    <Divider />
    <Accordion :multiple="true" v-model:activeIndex="expandedTabs">
      <AccordionTab header="Stats">
        <div id="playerStats">
          <TabView v-model:activeIndex="activeIndex">
            <TabPanel header="Scoring">
              <ScrollPanel style="width: 100%; height: 200px">
                <ul>
                  <li>
                    <p>Tries</p>
                    <p
                      class="value"
                      :style="player.stats.Tries > 0 ? 'color: var(--primary-color);' : ''"
                    >{{ player.stats.Tries ?? 0 }}</p>
                  </li>
                  <li>
                    <p>Involvement Tries</p>
                    <p
                      class="value"
                      :style="p1ScoringStats.involvement_try > 0 ? 'color: var(--primary-color);' : ''"
                    >{{ p1ScoringStats.involvement_try ?? 0 }}</p>
                  </li>
                  <li>
                    <p>Positional Tries</p>
                    <p
                      class="value"
                      :style="p1ScoringStats.positional_try > 0 ? 'color: var(--primary-color);' : ''"
                    >{{ p1ScoringStats.positional_try ?? 0 }}</p>
                  </li>
                  <li>
                    <p>Goals</p>
                    <p
                      class="value"
                      :style="kickingStats.goals > 0 ? 'color: var(--primary-color);' : ''"
                    >{{ kickingStats.goals ?? 0 }}</p>
                  </li>
                  <li>
                    <p>1pt Field Goals</p>
                    <p
                      class="value"
                      :style="p1ScoringStats.field_goals > 0 ? 'color: var(--primary-color);' : ''"
                    >{{ p1ScoringStats.field_goals ?? 0 }}</p>
                  </li>
                  <li>
                    <p>2pt Field Goals</p>
                    <p
                      class="value"
                      :style="p1ScoringStats['2point_field_goals'] > 0 ? 'color: var(--primary-color);' : ''"
                    >{{ p1ScoringStats['2point_field_goals'] ?? 0 }}</p>
                  </li>
                  <li>
                    <p>MIAs</p>
                    <p
                      class="value"
                      :style="p1ScoringStats.mia > 0 ? 'color: var(--pink-300);' : 'color: var(--primary-color);'"
                    >{{ p1ScoringStats.mia ?? 0 }}</p>
                  </li>
                  <li>
                    <p>Concedes</p>
                    <p
                      class="value"
                      :style="p1ScoringStats.concede > 0 ? 'color: var(--pink-300);' : 'color: var(--primary-color);'"
                    >{{ p1ScoringStats.concede ?? 0 }}</p>
                  </li>
                  <li>
                    <p>Sin Bins</p>
                    <p
                      class="value"
                      :style="p1ScoringStats.sin_bins > 0 ? 'color: var(--yellow-500);' : 'color: var(--primary-color);'"
                    >{{ p1ScoringStats.sin_bins ?? 0 }}</p>
                  </li>
                  <li>
                    <p>Send Offs</p>
                    <p
                      class="value"
                      :style="p1ScoringStats.send_offs > 0 ? 'color: var(--pink-300);' : 'color: var(--primary-color);'"
                    >{{ p1ScoringStats.send_offs ?? 0 }}</p>
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
      </AccordionTab>
      <AccordionTab header="Actions">
        <div class="player-actions">
          <Button
            v-if="player.xrl_team === user?.team_short"
            label="Drop"
            class="p-button-danger"
            @click="confirmDropPlayer"
          />
          <Button
            v-else-if="player.xrl_team === 'None' && roundInfo?.scooping"
            label="Scoop"
            class="p-button-primary"
            @click="confirmScoopPlayer"
          />
          <Button
            v-else-if="player.xrl_team === 'None' && !roundInfo?.scooping && !user?.waiver_preferences.includes(player.player_id)"
            label="Make Claim"
            class="p-button-success"
            @click="confirmMakeClaim"
          />
          <Button
            v-else-if="player.xrl_team === 'None' && user?.waiver_preferences.includes(player.player_id)"
            label="Drop Claim"
            class="p-button-warning"
            @click="confirmDropClaim"
          />
          <Button
            v-else-if="player.xrl_team !== 'None'"
            label="Offer Trade"
            class="p-button-warning"
            @click="openTradeForm"
          />
        </div>
      </AccordionTab>
    </Accordion>
    <Dialog v-model:visible="tradeFormVisible" header="Trade Offer" :breakpoints="{'960px': '100vw'}" :style="{width: '80vw'}">
      <TradeOfferBuilder :player="player" />
    </Dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import { Player, ScoringStats, XrlRound, XrlUser } from '../global';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import ScrollPanel from 'primevue/scrollpanel';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { XrlRelevantStats } from '../services/utils';
import { GetUserInfo } from '../services/users';
import { GetActiveRoundInfo } from '../services/rounds';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { UpdateUserWaiverPreferences } from '../services/xrlApi';
import { useXrlStore } from '../store';
import { ActionTypes } from '../store-types';
import TradeOfferBuilder from './TradeOfferBuilder.vue';

export default defineComponent({
  props: {
    player: {
      type: Object as PropType<Player>,
      required: true,
    },
  },
  setup({ player }) {
    const store = useXrlStore();

    const user = computed(() => store.state.user);
    const roundInfo = computed(() => store.getters.currentRound);

    const position1 = player.position;
    const p1ScoringStats = player.scoring_stats[
      position1 as keyof typeof player.scoring_stats
    ] as ScoringStats;
    let p2ScoringStats;
    if (player.position2) {
      p2ScoringStats = player.scoring_stats[
        player.position2 as keyof typeof player.scoring_stats
      ] as ScoringStats;
    }
    const kickingStats = player.scoring_stats.kicker;
    const allStats = Object.keys(player.stats).map(statName => {
      return {
        stat: statName,
        value: player.stats[statName as keyof typeof player.stats],
      };
    });
    const keyStats = allStats.filter(stat =>
      XrlRelevantStats.includes(stat.stat)
    );
    const activeIndex = ref(0);

    const confirm = useConfirm();
    const toast = useToast();
    const tradeFormVisible = ref(false);
    const expandedTabs = ref([0, 1]);

    const confirmDropPlayer = () => {
      confirm.require({
        header: 'Confirm',
        message: `Are you sure you want to drop ${player.player_name} from your squad?`,
        icon: 'pi pi-trash',
        accept: dropPlayer,
      });
    };

    const dropPlayer = async () => {
      await store.dispatch(ActionTypes.DropPlayers, [player]);
      toast.add({
        severity: 'info',
        summary: 'Confirmed',
        detail: `${player.player_name} has been dropped`,
        life: 3000,
      });
    }

    const confirmScoopPlayer = () => {
      confirm.require({
        header: 'Confirm',
        message: `Are you sure you want to give a lifeline to ${player.player_name}?`,
        icon: 'pi pi-user',
        accept: scoopPlayer,
      })
    }

    const scoopPlayer = async () => {
      await store.dispatch(ActionTypes.ScoopPlayers, [player]);
      toast.add({
        severity: 'success',
        summary: 'Confirmed',
        detail: `${player.player_name} has been added to your squad`,
        life: 3000,
      });
    }

    const confirmMakeClaim = () => {
      confirm.require({
        header: 'Confirm',
        message: `Are you sure you want to make a claim for ${player.player_name}?`,
        icon: 'pi pi-volume-up',
        accept: async () => {
          const prefs = [...(user.value?.waiver_preferences ?? [])];
          prefs.push(player.player_id);
          try {
            if (!user.value) throw "User data unavailable";
            await UpdateUserWaiverPreferences(user.value?.username, prefs, user.value?.provisional_drop ?? 'None');
            toast.add({
              severity: 'success',
              summary: 'Confirmed',
              detail: `${player.player_name} has been added to your waiver claims. You can change your claim priorities in the transfer centre.`,
              life: 3000,
            });
          } catch (err) {
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: String(err),
            });
          }
        }
      })
    }

    const confirmDropClaim = () => {
      confirm.require({
        header: 'Confirm',
        message: `Are you sure you want to remove your claim for ${player.player_name}?`,
        icon: 'pi pi-undo',
        accept: () => {
          toast.add({
            severity: 'info',
            summary: 'Confirmed',
            detail: `Your claim for ${player.player_name} has been rescinded`,
            life: 3000,
          });
        }
      })
    }

    const openTradeForm = () => {
      tradeFormVisible.value = true;
    }

    return {
      activeIndex,
      p1ScoringStats,
      p2ScoringStats,
      kickingStats,
      allStats,
      keyStats,
      user,
      confirmDropPlayer,
      confirmScoopPlayer,
      confirmMakeClaim,
      confirmDropClaim,
      roundInfo,
      openTradeForm,
      tradeFormVisible,
      expandedTabs
    };
  },
  components: {
    TabView,
    TabPanel,
    ScrollPanel,
    Accordion,
    AccordionTab,
    TradeOfferBuilder,
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
.player-actions {
  display: flex;
  gap: 1rem;
}
.row {
  display: flex;
  gap: 10px;
  justify-content: space-evenly;
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
</style>
