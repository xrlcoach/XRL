<template>
  <Dialog header="Player Appearance" v-model:visible="showPlayer" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}" >
      <PlayerAppearance v-if="selectedAppearance" :appearance="selectedAppearance"  />
  </Dialog>
    <Card class="matchLineupCard">
      <template #title>
        <div class="teamScoreHeader">
          <div>
            <img
              :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${team.team_short}.png`"
              :alt="team.team_name"
              :height="50"
              :width="50"
            />
          </div>
          <h3>{{ team.team_name }}</h3>
        </div>
      </template>
      <template #content>
      <transition name="grow" mode="out-in">
        <div id="tableContainer" v-if="loaded" style="overflow: hidden;">
          <div class="lineupScore">
            <div>
              <span>Total</span>
            </div>
            <div>
              <span>{{ teamScore }}</span>
            </div>
          </div>
          <Divider />
          <DataTable
            :value="lineupWithStats.filter(p => p.position_number < 14)"
            dataKey="player_id"
            v-model:selection="selectedAppearance"
            selectionMode="single"
            @rowSelect="onSelectPlayer"
            :scrollable="true"
            scrollDirection="both"
          >
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '25px',
              }"
              field="position_number"
            ></Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '60px',
              }"
            >
              <template #body="slotProps">
                <img
                  :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data?.nrl_club}.svg`"
                  :alt="slotProps.data?.nrl_club"
                  :height="50"
                  :width="50"
                />
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '150px',
              }"
              header="Player"
            >
              <template #body="slotProps">
                <div
                  :style="
                    slotProps.data.played_xrl
                      ? { color: 'var(--primary-color)' }
                      : ''
                  "
                >
                  {{ slotProps.data.player_name }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
              header="T"
            >
              <template #body="slotProps">
                <div>
                  {{ slotProps.data.appearanceStats?.stats?.Tries || 0 }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
              header="G"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.kicker
                      ?.goals || 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
              header="FG"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.field_goals +
                      slotProps.data.appearanceStats?.scoring_stats?.[
                        slotProps.data.position_general
                      ]?.['2point_field_goals'] *
                        2 || 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
              header="IT"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.involvement_try
                      ? 1
                      : 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
              header="PT"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.positional_try
                      ? 1
                      : 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
              header="MIA"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.mia
                      ? 1
                      : 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
              header="C"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.concede
                      ? 1
                      : 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '60px',
              }"
              header="Roles"
            >
              <template #body="slotProps">
                <div>
                  {{
                    (slotProps.data.captain || slotProps.data.captain2
                      ? 'C'
                      : slotProps.data.vice
                      ? 'VC'
                      : '') +
                    ' ' +
                    (slotProps.data.kicker
                      ? 'K'
                      : slotProps.data.backup_kicker
                      ? 'BK'
                      : '')
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '50px',
              }"
              header="Score"
              field="score"
            >
            </Column>
          </DataTable>
          <Divider />
          <h3>Interchange</h3>
          <DataTable
            :value="lineupWithStats.filter(p => p.position_number >= 14)"
            dataKey="player_id"
            v-model:selection="selectedAppearance"
            selectionMode="single"
            @rowSelect="onSelectPlayer"
            :scrollable="true"
            scrollDirection="both"
          >
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '25px',
              }"
              field="position_number"
            ></Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '60px',
              }"
            >
              <template #body="slotProps">
                <img
                  :src="`https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/${slotProps.data?.nrl_club}.svg`"
                  :alt="slotProps.data?.nrl_club"
                  :height="50"
                  :width="50"
                />
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '150px',
              }"
            >
              <template #body="slotProps">
                <div
                  :style="
                    slotProps.data.played_xrl
                      ? { color: 'var(--primary-color)' }
                      : ''"
                >
                  {{ slotProps.data.player_name }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
            >
              <template #body="slotProps">
                <div>
                  {{ slotProps.data.appearanceStats?.stats?.Tries || 0 }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.kicker
                      ?.goals || 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.field_goals +
                      slotProps.data.appearanceStats?.scoring_stats?.[
                        slotProps.data.position_general
                      ]?.['2point_field_goals'] *
                        2 || 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.involvement_try
                      ? 1
                      : 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.positional_try
                      ? 1
                      : 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.mia
                      ? 1
                      : 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '40px',
              }"
            >
              <template #body="slotProps">
                <div>
                  {{
                    slotProps.data.appearanceStats?.scoring_stats?.[
                      slotProps.data.position_general
                    ]?.concede
                      ? 1
                      : 0
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '60px',
              }"
            >
              <template #body="slotProps">
                <div>
                  {{
                    (slotProps.data.captain || slotProps.data.captain2
                      ? 'C'
                      : slotProps.data.vice
                      ? 'VC'
                      : '') +
                    ' ' +
                    (slotProps.data.kicker
                      ? 'K'
                      : slotProps.data.backup_kicker
                      ? 'BK'
                      : '')
                  }}
                </div>
              </template>
            </Column>
            <Column
              :style="{
                'align-items': 'center',
                'justify-content': 'center',
                padding: '5px',
                width: '50px',
              }"
              field="score"
            >
            </Column>
          </DataTable>
        </div>
        <!-- <div v-else style="width: 627px">
          <div class="custom-skeleton p-p-4">
            <ul class="p-m-0 p-p-0">
              <li class="p-mb-3">
                <div class="p-d-flex">
                  <Skeleton
                    shape="circle"
                    size="4rem"
                    class="p-mr-2"
                  ></Skeleton>
                  <div style="flex: 1">
                    <Skeleton width="100%" class="p-mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li class="p-mb-3">
                <div class="p-d-flex">
                  <Skeleton
                    shape="circle"
                    size="4rem"
                    class="p-mr-2"
                  ></Skeleton>
                  <div style="flex: 1">
                    <Skeleton width="100%" class="p-mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li class="p-mb-3">
                <div class="p-d-flex">
                  <Skeleton
                    shape="circle"
                    size="4rem"
                    class="p-mr-2"
                  ></Skeleton>
                  <div style="flex: 1">
                    <Skeleton width="100%" class="p-mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
              <li>
                <div class="p-d-flex">
                  <Skeleton
                    shape="circle"
                    size="4rem"
                    class="p-mr-2"
                  ></Skeleton>
                  <div style="flex: 1">
                    <Skeleton width="100%" class="p-mb-2"></Skeleton>
                    <Skeleton width="75%"></Skeleton>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div> -->
  </transition>
      </template>
    </Card>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue';
  import {
    Player,
    PlayerAppearanceStats,
    PlayerLineupEntry,
    PlayerLineupEntryWithStats,
    XrlUser,
  } from '../global';
  import {
    GetLineupByTeamAndRound,
    GetPlayerById,
    GetStatsByTeamAndRound,
  } from '../services/xrlApi';
  import Skeleton from 'primevue/skeleton';
  import { GetLineupScore } from '../services/lineups';
  import PlayerAppearance from './PlayerAppearance.vue';

  export default defineComponent({
    props: {
      team: {
        type: Object as PropType<XrlUser>,
        required: true,
      },
      roundNumber: {
        type: Number,
        required: true
      },
    },
    setup(props) {
      const loaded = ref(false);
      const team = computed(() => props.team);
      const roundNumber = computed(() => props.roundNumber);
      
      const lineup = ref([] as PlayerLineupEntry[]);
      const stats = ref([] as PlayerAppearanceStats[]);

      const lineupWithStats = computed(() => {
        let lineupCopy = Array.from(
          lineup.value
        ) as PlayerLineupEntryWithStats[];
        lineupCopy.forEach(p => {
          p.appearanceStats = stats.value.find(
            a => a.player_id === p.player_id
          );
        });
        return lineupCopy.sort(
          (p1, p2) => p1.position_number - p2.position_number
        );
      });

      const teamScore = computed(() => {
        return GetLineupScore(lineup.value);
      });

      const showPlayer = ref(false);
      const selectedAppearance = ref<PlayerLineupEntryWithStats>();

      const onSelectPlayer = (event: any) => {
        selectedAppearance.value = event.data;
        showPlayer.value = true;
      };

      const getLineupStats = async () => {
        loaded.value = false;
        try {
          if (team && roundNumber) {
            lineup.value = await GetLineupByTeamAndRound(
              roundNumber.value,
              team.value.team_short
            );
            stats.value = await GetStatsByTeamAndRound(
              roundNumber.value,
              lineup.value.map(p => p.pk)
            );
          }
        } catch (error) {
          console.log(error);
        } finally {
          loaded.value = true;
        }
      }

      onMounted(async () => {
        getLineupStats();
      });

      watch(() => roundNumber.value, () => getLineupStats());
      watch(() => team.value, () => getLineupStats());

      return {
        loaded,
        lineupWithStats,
        selectedAppearance,
        showPlayer,
        onSelectPlayer,
        teamScore,
      };
    },
    components: {
      Skeleton,
      PlayerAppearance
    },
  });
</script>

<style scoped>
  #tableContainer {
    text-align: center;
  }
  li {
    list-style: none;
  }
  .lineupScore {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    font-size: 24px;
  }
</style>
