<template>
  <section id="lineupSelection">
    <div
      id="lineupContainer"
      :style="
        powerplay
          ? `border-radius: 5px; border: 1px solid var(--pink-500); box-shadow: 0px 0px 20px var(--pink-500);`
          : ''
      "
    >
      <transition name="fade" mode="out-in">
        <Message v-if="error">{{ error }}</Message>
        <Splitter v-else layout="vertical">
          <SplitterPanel>
            <div id="fixtureTitle">
              <h4>Round {{ roundNumber }}</h4>
              <h3>{{ user?.team_name }} v {{ opponent }}</h3>
              <h4>at {{ venue }}</h4>
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div id="pitch">
              <div>
                <div class="playerRow" id="forwards">
                  <h4>Front Row</h4>
                  <PlayerSelection
                    :number="8"
                    pos="Prop"
                    :options="forwards"
                    v-model:selectedPlayerId="selections.starters.prop1"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'prop1')"
                    @drop="onPositionDrop($event, 'prop1')"
                  />
                  <PlayerSelection
                    :number="9"
                    pos="Hooker"
                    :options="playmakers"
                    v-model:selectedPlayerId="selections.starters.hooker"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'hooker')"
                    @drop="onPositionDrop($event, 'hooker')"
                  />
                  <PlayerSelection
                    :number="10"
                    pos="Prop"
                    :options="forwards"
                    v-model:selectedPlayerId="selections.starters.prop2"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'prop2')"
                    @drop="onPositionDrop($event, 'prop2')"
                  />
                </div>
                <div class="playerRow" id="lockHooker">
                  <h4>Back Row</h4>
                  <PlayerSelection
                    :number="11"
                    pos="2nd Row"
                    :options="forwards"
                    v-model:selectedPlayerId="selections.starters.row1"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'row1')"
                    @drop="onPositionDrop($event, 'row1')"
                  />
                  <PlayerSelection
                    :number="13"
                    pos="Lock"
                    :options="forwards"
                    v-model:selectedPlayerId="selections.starters.lock"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'lock')"
                    @drop="onPositionDrop($event, 'lock')"
                  />
                  <PlayerSelection
                    :number="12"
                    pos="2nd Row"
                    :options="forwards"
                    v-model:selectedPlayerId="selections.starters.row2"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'row2')"
                    @drop="onPositionDrop($event, 'row2')"
                  />
                </div>
                <div class="playerRow" id="halves">
                  <h4>Halves</h4>
                  <PlayerSelection
                    :number="6"
                    pos="Five-Eighth"
                    :options="playmakers"
                    v-model:selectedPlayerId="selections.starters.five_eighth"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'five_eighth')"
                    @drop="onPositionDrop($event, 'five_eighth')"
                  />
                  <PlayerSelection
                    :number="7"
                    pos="Halfback"
                    :options="playmakers"
                    v-model:selectedPlayerId="selections.starters.halfback"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'halfback')"
                    @drop="onPositionDrop($event, 'halfback')"
                  />
                </div>
                <div class="playerRow" id="backs">
                  <h4>Backs</h4>
                  <PlayerSelection
                    :number="2"
                    pos="Winger"
                    :options="backs"
                    v-model:selectedPlayerId="selections.starters.winger1"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'winger1')"
                    @drop="onPositionDrop($event, 'winger1')"
                  />
                  <PlayerSelection
                    :number="3"
                    pos="Centre"
                    :options="backs"
                    v-model:selectedPlayerId="selections.starters.centre1"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'centre1')"
                    @drop="onPositionDrop($event, 'centre1')"
                  />
                  <PlayerSelection
                    :number="4"
                    pos="Centre"
                    :options="backs"
                    v-model:selectedPlayerId="selections.starters.centre2"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'centre2')"
                    @drop="onPositionDrop($event, 'centre2')"
                  />
                  <PlayerSelection
                    :number="5"
                    pos="Winger"
                    :options="backs"
                    v-model:selectedPlayerId="selections.starters.winger2"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'winger2')"
                    @drop="onPositionDrop($event, 'winger2')"
                  />
                </div>
                <div class="playerRow" id="fullBack">
                  <PlayerSelection
                    :number="1"
                    pos="Fullback"
                    :options="backs"
                    v-model:selectedPlayerId="selections.starters.fullback"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                    @dragover="onPositionDragOver($event, 'fullback')"
                    @drop="onPositionDrop($event, 'fullback')"
                  />
                </div>
              </div>
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div id="bench">
              <div class="playerRow" id="interchange">
                <PlayerSelection
                  :number="14"
                  :options="benchOptions"
                  v-model:selectedPlayerId="selections.bench.int1"
                  v-model:position="benchPositions.int1"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                  @dragover="onPositionDragOver($event, 'int1')"
                  @drop="onPositionDrop($event, 'int1')"
                />
                <PlayerSelection
                  :number="15"
                  :options="benchOptions"
                  v-model:selectedPlayerId="selections.bench.int2"
                  v-model:position="benchPositions.int2"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                  @dragover="onPositionDragOver($event, 'int2')"
                  @drop="onPositionDrop($event, 'int2')"
                />
                <PlayerSelection
                  :number="16"
                  :options="benchOptions"
                  v-model:selectedPlayerId="selections.bench.int3"
                  v-model:position="benchPositions.int3"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                  @dragover="onPositionDragOver($event, 'int3')"
                  @drop="onPositionDrop($event, 'int3')"
                />
                <PlayerSelection
                  :number="17"
                  :options="benchOptions"
                  v-model:selectedPlayerId="selections.bench.int4"
                  v-model:position="benchPositions.int4"
                    @dragstart="onSelectedPlayerDragStart"
                    @dragend="onPlayerDragEnd"
                  @dragover="onPositionDragOver($event, 'int4')"
                  @drop="onPositionDrop($event, 'int4')"
                />
              </div>
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div id="roles">
              <div
                v-if="canPowerplay"
                style="
                  padding: 20px 0px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 10px;
                "
              >
                <label>Powerplay</label>
                <InputSwitch v-model="powerplay" />
              </div>
              <div class="playerRow">
                <div>
                  <p>Captain</p>
                  <Dropdown
                    v-model="selections.roles.captain"
                    :options="squad"
                    optionLabel="player_name"
                    optionValue="player_id"
                  />
                </div>
                <div v-if="powerplay">
                  <p>Co-Captain</p>
                  <Dropdown
                    v-model="selections.roles.captain2"
                    :options="squad"
                    optionLabel="player_name"
                    optionValue="player_id"
                  />
                </div>
                <div v-else>
                  <p>Vice-Captain</p>
                  <Dropdown
                    v-model="selections.roles.vice"
                    :options="squad"
                    optionLabel="player_name"
                    optionValue="player_id"
                  />
                </div>
                <div>
                  <p>Kicker</p>
                  <Dropdown
                    v-model="selections.roles.kicker"
                    :options="squad"
                    optionLabel="player_name"
                    optionValue="player_id"
                  />
                </div>
                <div>
                  <p>Backup Kicker</p>
                  <Dropdown
                    v-model="selections.roles.backup_kicker"
                    :options="squad"
                    optionLabel="player_name"
                    optionValue="player_id"
                  />
                </div>
              </div>
            </div>
          </SplitterPanel>
          <SplitterPanel>
            <div style="padding: 10px 0px">
              <Button
                label="Submit"
                @click="submitLineup"
                loadingIcon="pi pi-spin pi-spinner"
                :loading="submitting"
              />
            </div>
          </SplitterPanel>
        </Splitter>
      </transition>
    </div>
    <Card v-if="!isMobile" id="lineupRoster" @dragover="onListDragOver" @drop="onListDrop">
      <template #header>
        <h3>Squad</h3>
      </template>
      <template #content>
        <section class="rosterListSection">
          <h4>Forwards</h4>
          <ul>
            <transition-group name="list">
              <li
                v-for="player in forwards"
                :key="player.player_id"
                class="rosterPlayer"
                :class="getRosterListPlayerClass(player)"
                draggable="true"
                @dragstart="onPlayerDragStart(player)"
                @dragend="onPlayerDragEnd"
              >
                <img
                  :src="getJerseyUrl(player.nrl_club)"
                  class="rosterPlayerJersey"
                />
                <span>{{ player.player_name }}</span>
                <span class="rosterCaptainRole" v-if="playerCaptainRole(player)">
                  {{ playerCaptainRole(player) }}
                </span>
                <span class="rosterKickerRole" v-if="playerKickerRole(player)">
                  {{ playerKickerRole(player) }}
                </span>
              </li>
            </transition-group>
          </ul>
        </section>
        <section class="rosterListSection">
          <h4>Playmakers</h4>
          <ul>
            <transition-group name="list">
              <li
                v-for="player in playmakers"
                :key="player.player_id"
                class="rosterPlayer"
                :class="getRosterListPlayerClass(player)"
                draggable="true"
                @dragstart="onPlayerDragStart(player)"
                @dragend="onPlayerDragEnd"
              >
                <img
                  :src="getJerseyUrl(player.nrl_club)"
                  class="rosterPlayerJersey"
                />
                <span>{{ player.player_name }}</span>
                <span class="rosterCaptainRole" v-if="playerCaptainRole(player)">
                  {{ playerCaptainRole(player) }}
                </span>
                <span class="rosterKickerRole" v-if="playerKickerRole(player)">
                  {{ playerKickerRole(player) }}
                </span>
              </li>
            </transition-group>
          </ul>
        </section>
        <section class="rosterListSection">
          <h4>Backs</h4>
          <ul>
            <transition-group name="list">
              <li
                v-for="player in backs"
                :key="player.player_id"
                class="rosterPlayer"
                :class="getRosterListPlayerClass(player)"
                draggable="true"
                @dragstart="onPlayerDragStart(player)"
                @dragend="onPlayerDragEnd"
              >
                <img
                  :src="getJerseyUrl(player.nrl_club)"
                  class="rosterPlayerJersey"
                />
                <span>{{ player.player_name }}</span>
                <span class="rosterCaptainRole" v-if="playerCaptainRole(player)">
                  {{ playerCaptainRole(player) }}
                </span>
                <span class="rosterKickerRole" v-if="playerKickerRole(player)">
                  {{ playerKickerRole(player) }}
                </span>
              </li>
            </transition-group>
          </ul>
        </section>
      </template>
    </Card>
    <Dialog
      header="Confirmation"
      v-model:visible="confirmationRequired"
      :style="{ width: '500px' }"
      :modal="true"
    >
      <div>
        <ul>
          <li v-for="issue of issues" :key="issue">
            <i
              class="pi pi-info-circle"
              style="font-size: 1rem; margin-right: 5px"
            />
            {{ issue }}
          </li>
        </ul>
        <div class="confirmation-content">
          <span>Are you sure you want to proceed?</span>
        </div>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          @click="confirmationRequired = false"
          class="p-button-text"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          @click="confirmLineup"
          class="p-button-text"
          autofocus
        />
      </template>
    </Dialog>
  </section>
</template>

<script lang="ts">
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import { computed, defineComponent, onMounted, ref, watch } from "vue";
  import {
    LineupPositionType,
    Player,
    PlayerLineupEntry,
    XrlFixture,
    XrlMatchLineup,
    XrlPosition,
    XrlUser,
  } from "../global";
  import { GetUserLineup } from "../services/lineups";
  import { GetUserSquad } from "../services/players";
  import {
    GetNextRoundNotInProgress,
    GetTeamFixtureFromRound,
  } from "../services/rounds";
  import { GetUserInfo, GetUserInfoByTeamShort } from "../services/users";
  import {
    CURRENT_YEAR,
    getJerseyUrl,
    isPlayer,
    PositionMap,
    PositionNumbers,
  } from "../services/utils";
  import { useXrlStore } from "../store";
  import { ActionTypes } from "../store-types";
  import PlayerSelection from "./PlayerSelection.vue";

  export default defineComponent({
    setup() {
      const store = useXrlStore();
      const isMobile = computed(() => store.state.isMobile);

      const loaded = ref(false);
      const error = ref("");

      const fixture = ref<XrlFixture>();
      const opponent = ref("");
      const venue = ref("");
      const roundNumber = ref(0);

      const user = computed(() => store.state.user);
      const squad = computed(() => store.getters.squad);
      const existingLineup = computed(() => store.state.lineup);

      const newLineup = ref<PlayerLineupEntry[]>([]);
      const powerplay = ref(false);
      const canPowerplay = computed(
        () => store.state.user && store.state.user.powerplays > 0
      );

      const backs = computed(() => {
        return squad.value.filter(
          (p) => p.position === "Back" || p.position2 === "Back"
        );
      });
      const playmakers = computed(() => {
        return squad.value.filter(
          (p) => p.position === "Playmaker" || p.position2 === "Playmaker"
        );
      });
      const forwards = computed(() => {
        return squad.value.filter(
          (p) => p.position === "Forward" || p.position2 === "Forward"
        );
      });
      const benchOptions = computed(() => {
        console.log("Computing bench options");
        return squad.value.filter(
          (p) =>
            !Object.keys(selections.value.starters)
              .map(
                (key) =>
                  selections.value.starters[
                    key as keyof typeof selections.value.starters
                  ]
              )
              .includes(p.player_id)
        );
      });

      const draggingPlayer = ref<Player | null>();
      const draggedPlayerPositions = computed(() => {
        const positions: LineupPositionType[] = [];
        if (!draggingPlayer.value) return positions;
        if (draggingPlayer.value.position)
          positions.push(draggingPlayer.value.position);
        if (draggingPlayer.value.position2)
          positions.push(draggingPlayer.value.position2);
        if (draggingPlayer.value.position3)
          positions.push(draggingPlayer.value.position3);
        return positions;
      });

      const onPlayerDragStart = (player: Player) => {
        draggingPlayer.value = player;
      };
      const onSelectedPlayerDragStart = (playerId: string) => {
        const player = squad.value.find(p => p.player_id === playerId);
        if (isPlayer(player)) {
          draggingPlayer.value = player;
        }
      };
      const onPlayerDragEnd = () => {
        draggingPlayer.value = null;
      };
      const onPositionDragOver = (
        event: DragEvent,
        position: keyof typeof PositionMap
      ) => {
        const positionGeneral = PositionMap[position];
        if (positionGeneral === 'Interchange') {
          event.preventDefault();
        } else if (draggedPlayerPositions.value.includes(positionGeneral)) {
          event.preventDefault();
        }
      };
      const removeExistingSelection = () => {
        if (!draggingPlayer.value) return;
        for (let pos of Object.keys(selections.value.starters)) {
          if (selections.value.starters[pos as keyof typeof selections.value.starters] === draggingPlayer.value.player_id) {
            selections.value.starters[pos as keyof typeof selections.value.starters] = "";
          }
        }
        for (let pos of Object.keys(selections.value.bench)) {
          if (selections.value.bench[pos as keyof typeof selections.value.bench] === draggingPlayer.value.player_id) {
            selections.value.bench[pos as keyof typeof selections.value.bench] = "";
          }
        }
      };
      const onPositionDrop = (event: Event, position: string) => {
        event.preventDefault();
        if (!draggingPlayer.value) return;
        removeExistingSelection();
        const positionGeneral = PositionMap[position as keyof typeof PositionMap];
        if (positionGeneral === 'Interchange') {
          selections.value.bench[position as keyof typeof selections.value.bench] = draggingPlayer.value?.player_id ?? "";
        } else {
          selections.value.starters[position as keyof typeof selections.value.starters] = draggingPlayer.value?.player_id ?? "";
        }
        onPlayerDragEnd();
      }

      const onListDragOver = (event: DragEvent) => {
        event.preventDefault();
      }
      const onListDrop = () => {
        removeExistingSelection();
        onPlayerDragEnd();
      }

      const getRosterListPlayerClass = (player: Player) => {
        const starterIds = Object.values(selections.value.starters).concat(Object.values(selections.value.bench));
        const benchIds = Object.values(selections.value.bench);
        return {
          'rosterListSelected': starterIds.includes(player.player_id),
          'rosterListBenched': benchIds.includes(player.player_id),
          'rosterCaptain': selections.value.roles.captain === player.player_id || selections.value.roles.captain2 === player.player_id,
          'rosterKicker': selections.value.roles.kicker === player.player_id,
        }
      }

      const selections = ref<XrlMatchLineup>({
        starters: {
          fullback: "",
          winger1: "",
          centre1: "",
          centre2: "",
          winger2: "",
          five_eighth: "",
          halfback: "",
          prop1: "",
          hooker: "",
          prop2: "",
          row1: "",
          row2: "",
          lock: "",
        },
        bench: {
          int1: "",
          int2: "",
          int3: "",
          int4: "",
        },
        roles: {
          captain: "",
          captain2: "",
          vice: "",
          kicker: "",
          backup_kicker: "",
        },
      });

      const playerCaptainRole = (player: Player) => {
        if (selections.value.roles.captain === player.player_id) return 'C';
        if (selections.value.roles.captain2 === player.player_id) return 'C';
        if (selections.value.roles.vice === player.player_id) return 'VC';
        return null;
      }
      const playerKickerRole = (player: Player) => {
        if (selections.value.roles.kicker === player.player_id) return 'K';
        if (selections.value.roles.backup_kicker === player.player_id) return 'BK';
        return null;
      }

      const benchPositions = ref({
        int1: "",
        int2: "",
        int3: "",
        int4: "",
      });

      function fillExistingSelections() {
        if (existingLineup.value && existingLineup.value.length) {
          existingLineup.value.forEach((player) => {
            if (
              Object.keys(benchPositions.value).includes(player.position_specific)
            ) {
              selections.value.bench[
                player.position_specific as keyof typeof selections.value.bench
              ] = player.player_id;
            } else {
              selections.value.starters[
                player.position_specific as keyof typeof selections.value.starters
              ] = player.player_id;
            }
            for (const role of Object.keys(selections.value.roles)) {
              if (player[role as keyof PlayerLineupEntry]) {
                selections.value.roles[
                  role as keyof typeof selections.value.roles
                ] = player.player_id;
                if (role === "captain2") {
                  powerplay.value = true;
                }
              }
            }
          });
        }
      }

      watch(selections.value.bench, (newValue) => {
        console.log("Change in bench");
        for (let position of Object.keys(newValue)) {
          let player = squad.value.find(
            (p) => p.player_id === newValue[position as keyof typeof newValue]
          );
          if (player) {
            // benchPositions.value[position as keyof typeof benchPositions.value].options.push(player.position_general, player.second_position);
            benchPositions.value[position as keyof typeof benchPositions.value] =
              player.position;
          }
        }
      });

      watch(powerplay, value => {
        if (value && selections.value.roles.vice) {
          selections.value.roles.captain2 = selections.value.roles.vice;
          selections.value.roles.vice = "";
        } else if (selections.value.roles.captain2) {
          selections.value.roles.vice = selections.value.roles.captain2;
          selections.value.roles.captain2 = "";
        }
      });

      const confirm = useConfirm();
      const toast = useToast();

      const submitting = ref(false);
      const issues = ref([] as string[]);
      const confirmationRequired = ref(false);

      const submitLineup = () => {
        submitting.value = true;
        try {
          newLineup.value = [];
          for (let position of Object.keys(selections.value.starters)) {
            let playerInfo = squad.value.find(
              (p) =>
                p.player_id ===
                selections.value.starters[
                  position as keyof typeof selections.value.starters
                ]
            );
            if (playerInfo) {
              newLineup.value.push({
                pk: playerInfo.pk,
                sk: `LINEUP#${CURRENT_YEAR}#` + roundNumber.value,
                data: "TEAM#" + user.value?.team_short,
                year: CURRENT_YEAR,
                round_number: String(roundNumber.value),
                nrl_club: playerInfo.nrl_club,
                xrl_team: user.value?.team_short || "",
                player_id: playerInfo.player_id,
                position_number:
                  PositionNumbers[position as keyof typeof PositionNumbers],
                player_name: playerInfo.player_name,
                position_general:
                  PositionMap[position as keyof typeof PositionMap],
                second_position: "",
                position_specific: position,
                captain: selections.value.roles.captain === playerInfo.player_id,
                captain2:
                  selections.value.roles.captain2 === playerInfo.player_id &&
                  powerplay.value,
                vice:
                  selections.value.roles.vice === playerInfo.player_id &&
                  !powerplay.value,
                kicker: selections.value.roles.kicker === playerInfo.player_id,
                backup_kicker:
                  selections.value.roles.backup_kicker === playerInfo.player_id,
                score: 0,
                played_nrl: false,
                played_xrl: false,
              });
            } else {
              throw "Couldn't find one of the selected players in your squad";
            }
          }
          for (let position of Object.keys(selections.value.bench)) {
            let playerInfo = squad.value.find(
              (p) =>
                p.player_id ===
                selections.value.bench[
                  position as keyof typeof selections.value.bench
                ]
            );
            if (playerInfo) {
              newLineup.value.push({
                pk: playerInfo.pk,
                sk: `LINEUP#${CURRENT_YEAR}#` + roundNumber.value,
                data: "TEAM#" + user.value?.team_short,
                round_number: String(roundNumber.value),
                year: CURRENT_YEAR,
                nrl_club: playerInfo.nrl_club,
                xrl_team: user.value?.team_short || "",
                player_id: playerInfo.player_id,
                position_number:
                  PositionNumbers[position as keyof typeof PositionNumbers],
                player_name: playerInfo.player_name,
                position_general:
                  benchPositions.value[
                    position as keyof typeof benchPositions.value
                  ],
                second_position:
                  benchPositions.value[
                    position as keyof typeof benchPositions.value
                  ] === playerInfo.position2
                    ? playerInfo.position
                    : playerInfo.position2,
                position_specific: position,
                captain: selections.value.roles.captain === playerInfo.player_id,
                captain2:
                  selections.value.roles.captain2 === playerInfo.player_id &&
                  powerplay.value,
                vice:
                  selections.value.roles.vice === playerInfo.player_id &&
                  !powerplay.value,
                kicker: selections.value.roles.kicker === playerInfo.player_id,
                backup_kicker:
                  selections.value.roles.backup_kicker === playerInfo.player_id,
                score: 0,
                played_nrl: false,
                played_xrl: false,
              });
            }
          }
          issues.value = validateLineup(newLineup.value);
          if (issues.value.length > 0) {
            submitting.value = false;
            confirmationRequired.value = true;
          } else {
            saveLineup();
          }
        } catch (err) {
          toast.add({
            severity: "error",
            summary: "Problem",
            detail: String(err),
            closable: true,
          });
          submitting.value = false;
        }
      };

      function validateLineup(selections: PlayerLineupEntry[]): string[] {
        const issues: string[] = [];
        selections.forEach((player) => {
          //Unacceptable errors...
          //Check if player selected twice
          if (
            selections.filter((p) => p.player_id === player.player_id).length !==
            1
          ) {
            throw `${player.player_name} has been selected more than once.`;
          }
          //Check if any captains at captaincy limit
          if (player.captain || player.captain2 || player.vice) {
            let timesAsCaptain = squad.value.find(
              (p) => p.player_id == player.player_id
            )?.times_as_captain;
            if (timesAsCaptain && timesAsCaptain > 5)
              throw player.player_name + " has already been captained 6 times.";
          }
          //Acceptable errors.....
          //Check if captain is on bench
          if (
            (player.captain || player.captain2) &&
            player.position_specific.startsWith("int")
          ) {
            issues.push("Your chosen captain is starting on the bench");
          }
          //Check if kicker is on bench
          if (player.kicker && player.position_specific.startsWith("int")) {
            issues.push("Your chosen kicker is starting on the bench");
          }
          //Check if captain is also vice-captain or second captain
          if (
            (player.captain && player.captain2) ||
            (player.captain && player.vice)
          ) {
            issues.push(`${player.player_name} has two captain roles`);
          }
          //Check if kicker is also backup kicker
          if (player.kicker && player.backup_kicker) {
            issues.push(`Same player chosen as kicker and backup kicker`);
          }
          //Check if vice-captain is on bench
          if (player.vice && player.position_specific.startsWith("int")) {
            issues.push(`Your chosen vice-captain is starting on the bench`);
          }
          //Check if backup kicker is on bench
          if (
            player.backup_kicker &&
            player.position_specific.startsWith("int")
          ) {
            issues.push(`Your chosen backup kicker is starting on the bench`);
          }
        });
        if (!selections.some((p) => p.captain))
          issues.push("You haven't chosen a captain");
        if (!powerplay.value && !selections.some((p) => p.vice))
          issues.push("You haven't chosen a vice-captain");
        if (powerplay.value && !selections.some((p) => p.captain2))
          issues.push("You haven't chosen a co-captain");
        return issues;
      }

      const saveLineup = async () => {
        submitting.value = true;
        await store.dispatch(ActionTypes.SetLineup, newLineup.value);
        toast.add({
          severity: "success",
          summary: "Confirmed",
          detail: `Lineup confirmed`,
          life: 3000,
        });
        submitting.value = false;
      };

      const confirmLineup = () => {
        confirmationRequired.value = false;
        saveLineup();
      };

      const loadMatchAndLineup = async () => {
        if (!user.value) {
          error.value = "No user data found. Please log out and in again";
          return;
        }
        const nextRound = store.getters.nextRoundNotInProgress;
        if (!nextRound) {
          error.value = "There is no match next week";
          return;
        }
        roundNumber.value = nextRound.round_number;
        fixture.value = GetTeamFixtureFromRound(nextRound, user.value.team_short);
        if (!fixture.value) {
          error.value = "You have no match this week";
          return;
        }
        let homeGame = fixture.value?.home === user.value.team_short;
        let opponentTeamShort = homeGame
          ? fixture.value?.away
          : fixture.value?.home;
        let opponentInfo = store.getters.getUserByTeamShort(
          opponentTeamShort || ""
        );
        opponent.value = opponentInfo?.team_name ?? "";
        venue.value = homeGame
          ? user.value.homeground
          : opponentInfo?.homeground || "";
        if (!existingLineup.value) {
          try {
            store.dispatch(ActionTypes.GetUserLineup);
          } catch (err) {
            console.log(err);
          }
        } else {
          fillExistingSelections();
        }
      };

      const fillExistingLineup = () => {
        for (let position of Object.keys(selections.value.starters)) {
          selections.value.starters[
            position as keyof typeof selections.value.starters
          ] =
            existingLineup.value?.find((p) => p.position_specific === position)
              ?.player_id || "";
        }
        for (let position of Object.keys(selections.value.bench)) {
          let player = existingLineup.value?.find(
            (p) => p.position_specific === position
          );
          selections.value.bench[
            position as keyof typeof selections.value.bench
          ] = player?.player_id ?? "";
          if (player) {
            // benchPositions.value[position as keyof typeof benchPositions.value].options.push(player.position_general, player.second_position);
            benchPositions.value[position as keyof typeof benchPositions.value] =
              player.position_general;
          }
        }
        for (let role of Object.keys(selections.value.roles)) {
          selections.value.roles[role as keyof typeof selections.value.roles] =
            existingLineup.value?.find((p) => p[role as keyof typeof p])
              ?.player_id || "";
        }
        console.log(selections.value.roles);
        powerplay.value = existingLineup.value
          ? existingLineup.value?.findIndex((p) => p.captain2) !== -1
          : false;
      };

      watch(existingLineup, (newValue) => {
        fillExistingSelections();
      });

      onMounted(async () => {
        loadMatchAndLineup();
      });

      return {
        loaded,
        error,
        isMobile,
        fixture,
        opponent,
        roundNumber,
        venue,
        user,
        squad,
        existingLineup,
        backs,
        playmakers,
        forwards,
        benchOptions,
        benchPositions,
        selections,
        powerplay,
        canPowerplay,
        submitLineup,
        submitting,
        confirmationRequired,
        saveLineup,
        issues,
        confirmLineup,
        getJerseyUrl,
        onPlayerDragStart,
        onSelectedPlayerDragStart,
        onPlayerDragEnd,
        onPositionDragOver,
        onPositionDrop,
        onListDragOver,
        onListDrop,
        getRosterListPlayerClass,
        playerCaptainRole,
        playerKickerRole
      };
    },
    components: {
      PlayerSelection,
    },
  });
</script>

<style lang="scss" scoped>  
  #lineupSelection {
    display: flex;
  }
  #lineupContainer {
    width: 70%;
    transition: box-shadow 0.5s ease;
    overflow: hidden;
  }
  #lineupRoster {
    width: 30%;
    margin-left: 2rem;
    border: 1px solid #304562;
    &:deep(.p-card-header) {
      padding: 1rem;
      border-bottom: 1px solid #304562;
      h3 {
        text-align: left;
      }
    }
    &:deep(.p-card-body) {
      padding: 0;
    }
    &:deep(.p-card-content) {
      padding: 0;
    }
  }
  .rosterListSection {
    h4 {
      padding: 1rem 1rem 0 1rem;
      text-align: left;
    }
    border-bottom: 1px solid #304562;
  }
  .rosterPlayer {
    display: flex;
    padding: 0.5rem 1rem;
    margin: 5px 0;
    gap: 1rem;
    align-items: center;
    cursor: grab;
    transition: background-color 0.2s ease-out;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    &.rosterListSelected {
      border: 1px solid var(--primary-color);
      background-color: rgba(129, 199, 132, 0.1);
    }
    &.rosterListBenched {
      border: 1px solid var(--yellow-500);
      background-color: rgba(129, 199, 132, 0.1);
    }
    .rosterCaptainRole, .rosterKickerRole {
      font-weight: 600;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1.5rem;
      width: 1.5rem;
      padding: 0.5rem;
      border-radius: 5px;
      color: black;
      margin-left: 1rem;
      line-height: inherit;
      background-color: var(--yellow-500);
    }
    &.rosterCaptain {
      .rosterCaptainRole {
        background-color: var(--primary-color);
      }
    }
    &.rosterKicker {
      .rosterKickerRole {
        background-color: var(--primary-color);
      }
    }
  }
  .rosterPlayerJersey {
    height: 30px;
    object-fit: cover;
  }
  #fixtureTitle {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  #pitch {
    display: flex;
    flex-direction: column;
    background-color: var(--green-700);
    object-fit: contain;
    object-position: center;
    padding: 20px 10px;
  }
  .playerRow {
    display: flex;
    justify-content: space-evenly;
  }
  #bench {
    padding: 20px 10px;
    background-color: var(--green-800);
  }
  #roles {
    padding: 50px 10px;
  }
  li {
    list-style: none;
    margin: 10px 0px;
  }
  .confirmation-content {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }
  @media screen and (max-width: 960px) {
    #lineupContainer {
      width: 100%;
    }
    .playerRow {
      flex-direction: column;
      gap: 1rem;
      &:not(:last-child) {
        margin-bottom: 1rem;
      }
    }
    #roles {
      .playerRow {
        > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          width: 100%;
        }
        p {
          text-align: left;
        }
      }
    }
  }
</style>
