<template>
  <div
    id="lineupContainer"
    :style="powerplay ? `border-radius: 5px; border: 1px solid var(--pink-500); box-shadow: 0px 0px 20px var(--pink-500);` : ''"
  >
    <transition name="fade" mode="out-in">
      <Message v-if="error">{{error}}</Message>
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
                <PlayerSelection
                  :number="8"
                  :options="forwards"
                  v-model:selectedPlayerId="selections.starters.prop1"
                />
                <PlayerSelection
                  :number="9"
                  :options="playmakers"
                  v-model:selectedPlayerId="selections.starters.hooker"
                />
                <PlayerSelection
                  :number="10"
                  :options="forwards"
                  v-model:selectedPlayerId="selections.starters.prop2"
                />
              </div>
              <div class="playerRow" id="lockHooker">
                <PlayerSelection
                  :number="11"
                  :options="forwards"
                  v-model:selectedPlayerId="selections.starters.row1"
                />
                <PlayerSelection
                  :number="13"
                  :options="forwards"
                  v-model:selectedPlayerId="selections.starters.lock"
                />
                <PlayerSelection
                  :number="12"
                  :options="forwards"
                  v-model:selectedPlayerId="selections.starters.row2"
                />
              </div>
              <div class="playerRow" id="halves">
                <PlayerSelection
                  :number="6"
                  :options="playmakers"
                  v-model:selectedPlayerId="selections.starters.five_eighth"
                />
                <PlayerSelection
                  :number="7"
                  :options="playmakers"
                  v-model:selectedPlayerId="selections.starters.halfback"
                />
              </div>
              <div class="playerRow" id="backs">
                <PlayerSelection
                  :number="2"
                  :options="backs"
                  v-model:selectedPlayerId="selections.starters.winger1"
                />
                <PlayerSelection
                  :number="3"
                  :options="backs"
                  v-model:selectedPlayerId="selections.starters.centre1"
                />
                <PlayerSelection
                  :number="4"
                  :options="backs"
                  v-model:selectedPlayerId="selections.starters.centre2"
                />
                <PlayerSelection
                  :number="5"
                  :options="backs"
                  v-model:selectedPlayerId="selections.starters.winger2"
                />
              </div>
              <div class="playerRow" id="fullBack">
                <PlayerSelection
                  :number="1"
                  :options="backs"
                  v-model:selectedPlayerId="selections.starters.fullback"
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
              />
              <PlayerSelection
                :number="15"
                :options="benchOptions"
                v-model:selectedPlayerId="selections.bench.int2"
                v-model:position="benchPositions.int2"
              />
              <PlayerSelection
                :number="16"
                :options="benchOptions"
                v-model:selectedPlayerId="selections.bench.int3"
                v-model:position="benchPositions.int3"
              />
              <PlayerSelection
                :number="17"
                :options="benchOptions"
                v-model:selectedPlayerId="selections.bench.int4"
                v-model:position="benchPositions.int4"
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
  <Dialog
    header="Confirmation"
    v-model:visible="confirmationRequired"
    :style="{ width: '500px' }"
    :modal="true"
  >
    <div>
      <ul>
        <li v-for="issue of issues" :key="issue">
          <i class="pi pi-info-circle" style="font-size: 1rem; margin-right: 5px" />
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
</template>

<script lang="ts">
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { Player, PlayerLineupEntry, XrlFixture, XrlMatchLineup, XrlUser } from '../global';
import { GetUserLineup } from '../services/lineups';
import { GetUserSquad } from '../services/players';
import {
  GetNextRoundNotInProgress,
  GetTeamFixtureFromRound,
} from '../services/rounds';
import { GetUserInfo, GetUserInfoByTeamShort } from '../services/users';
import { CURRENT_YEAR, PositionMap, PositionNumbers } from '../services/utils';
import { useXrlStore } from '../store';
import { ActionTypes } from '../store-types';
import PlayerSelection from './PlayerSelection.vue';

export default defineComponent({
  setup() {
    const store = useXrlStore();

    const loaded = ref(false);
    const error = ref('');

    const fixture = ref<XrlFixture>();
    const opponent = ref('');
    const venue = ref('');
    const roundNumber = ref(0);

    const user = computed(() => store.state.user);
    const squad = computed(() => store.getters.squad);
    const existingLineup = computed(() => store.state.lineup);
    
    const newLineup = ref<PlayerLineupEntry[]>([]);
    const powerplay = ref(false);
    const canPowerplay = computed(() => store.state.user && store.state.user.powerplays > 0);

    const backs = computed(() => {
      return squad.value.filter(
        p => p.position === 'Back' || p.position2 === 'Back'
      );
    });
    const playmakers = computed(() => {
      return squad.value.filter(
        p => p.position === 'Playmaker' || p.position2 === 'Playmaker'
      );
    });
    const forwards = computed(() => {
      return squad.value.filter(
        p => p.position === 'Forward' || p.position2 === 'Forward'
      );
    });
    const benchOptions = computed(() => {
      console.log('Computing bench options');
      return squad.value.filter(
        p =>
          !Object.keys(selections.value.starters)
            .map(
              key =>
                selections.value.starters[
                key as keyof typeof selections.value.starters
                ]
            )
            .includes(p.player_id)
      );
    });

    const selections = ref<XrlMatchLineup>({
      starters: {
        fullback: '',
        winger1: '',
        centre1: '',
        centre2: '',
        winger2: '',
        five_eighth: '',
        halfback: '',
        prop1: '',
        hooker: '',
        prop2: '',
        row1: '',
        row2: '',
        lock: '',
      },
      bench: {
        int1: '',
        int2: '',
        int3: '',
        int4: '',
      },
      roles: {
        captain: '',
        captain2: '',
        vice: '',
        kicker: '',
        backup_kicker: '',
      },
    });

    const benchPositions = ref({
      int1: '',
      int2: '',
      int3: '',
      int4: '',
    });

    function fillExistingSelections() {
      if (existingLineup.value && existingLineup.value.length) {
        existingLineup.value.forEach(player => {
          if (Object.keys(benchPositions.value).includes(player.position_specific)) {
            selections.value.bench[player.position_specific as keyof typeof selections.value.bench] = player.player_id;
          } else {
            selections.value.starters[player.position_specific as keyof typeof selections.value.starters] = player.player_id;
          }
          for (const role of Object.keys(selections.value.roles)) {
            if (player[role as keyof PlayerLineupEntry]) {
              selections.value.roles[role as keyof typeof selections.value.roles] = player.player_id;
              if (role === 'captain2') {
                powerplay.value = true;
              }
            }
          }
        })
      }
    }

    watch(selections.value.bench, newValue => {
      console.log('Change in bench');
      for (let position of Object.keys(newValue)) {
        let player = squad.value.find(
          p => p.player_id === newValue[position as keyof typeof newValue]
        );
        if (player) {
          // benchPositions.value[position as keyof typeof benchPositions.value].options.push(player.position_general, player.second_position);
          benchPositions.value[
            position as keyof typeof benchPositions.value
          ] = player.position;
        }
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
        for (let position of Object.keys(selections.value.starters)) {
          let playerInfo = squad.value.find(
            p =>
              p.player_id ===
              selections.value.starters[
              position as keyof typeof selections.value.starters
              ]
          );
          if (playerInfo) {
            newLineup.value.push({
              pk: playerInfo.pk,
              sk: `LINEUP#${CURRENT_YEAR}#` + roundNumber.value,
              data: 'TEAM#' + user.value?.team_short,
              year: CURRENT_YEAR,
              round_number: String(roundNumber.value),
              nrl_club: playerInfo.nrl_club,
              xrl_team: user.value?.team_short || '',
              player_id: playerInfo.player_id,
              position_number:
                PositionNumbers[position as keyof typeof PositionNumbers],
              player_name: playerInfo.player_name,
              position_general:
                PositionMap[position as keyof typeof PositionMap],
              second_position: '',
              position_specific: position,
              captain:
                selections.value.roles.captain === playerInfo.player_id,
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
            p =>
              p.player_id ===
              selections.value.bench[
              position as keyof typeof selections.value.bench
              ]
          );
          if (playerInfo) {
            newLineup.value.push({
              pk: playerInfo.pk,
              sk: `LINEUP#${CURRENT_YEAR}#` + roundNumber.value,
              data: 'TEAM#' + user.value?.team_short,
              round_number: String(roundNumber.value),
              year: CURRENT_YEAR,
              nrl_club: playerInfo.nrl_club,
              xrl_team: user.value?.team_short || '',
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
              captain:
                selections.value.roles.captain === playerInfo.player_id,
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
          severity: 'error',
          summary: 'Problem',
          detail: String(err),
          closable: true,
        });
        submitting.value = false;
      }
    };

    function validateLineup(selections: PlayerLineupEntry[]): string[] {
      const issues: string[] = [];
      selections.forEach(player => {
        //Unacceptable errors...
        //Check if player selected twice
        if (
          selections.filter(p => p.player_id === player.player_id).length !==
          1
        ) {
          throw `${player.player_name} has been selected more than once.`;
        }
        //Check if any captains at captaincy limit
        if (player.captain || player.captain2 || player.vice) {
          let timesAsCaptain = squad.value.find(
            p => p.player_id == player.player_id
          )?.times_as_captain;
          if (timesAsCaptain && timesAsCaptain > 5)
            throw player.player_name + ' has already been captained 6 times.';
        }
        //Acceptable errors.....
        //Check if captain is on bench
        if (
          (player.captain || player.captain2) &&
          player.position_specific.startsWith('int')
        ) {
          issues.push('Your chosen captain is starting on the bench');
        }
        //Check if kicker is on bench
        if (player.kicker && player.position_specific.startsWith('int')) {
          issues.push('Your chosen kicker is starting on the bench');
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
        if (player.vice && player.position_specific.startsWith('int')) {
          issues.push(`Your chosen vice-captain is starting on the bench`);
        }
        //Check if backup kicker is on bench
        if (
          player.backup_kicker &&
          player.position_specific.startsWith('int')
        ) {
          issues.push(`Your chosen backup kicker is starting on the bench`);
        }
      });
      if (!selections.some(p => p.captain)) issues.push("You haven't chosen a captain");
      if (!powerplay.value && !selections.some(p => p.vice)) issues.push("You haven't chosen a vice-captain");
      if (powerplay.value && !selections.some(p => p.captain2)) issues.push("You haven't chosen a co-captain");
      return issues;
    }

    const saveLineup = async () => {
      submitting.value = true;
      await store.dispatch(ActionTypes.SetLineup, newLineup.value);
      toast.add({
        severity: 'success',
        summary: 'Confirmed',
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
        error.value = 'No user data found. Please log out and in again';
        return;
      }
      const nextRound = store.getters.nextRoundNotInProgress;
      if (!nextRound) {
        error.value = 'There is no match next week';
        return;
      }
      roundNumber.value = nextRound.round_number;
      fixture.value = GetTeamFixtureFromRound(
        nextRound,
        user.value.team_short
      );
      if (!fixture.value) {
        error.value = 'You have no match this week';
        return;
      }
      let homeGame = fixture.value?.home === user.value.team_short;
      let opponentTeamShort = homeGame
        ? fixture.value?.away
        : fixture.value?.home;
      let opponentInfo = store.getters.getUserByTeamShort(
        opponentTeamShort || ''
      );
      opponent.value = opponentInfo?.team_name ?? '';
      venue.value = homeGame
        ? user.value.homeground
        : opponentInfo?.homeground || '';
      if (!existingLineup.value) {
        try {
          store.dispatch(ActionTypes.GetUserLineup);
        } catch (err) {
          console.log(err);
        }
      } else {
        fillExistingSelections();
      }
    }

    const fillExistingLineup = () => {
      for (let position of Object.keys(selections.value.starters)) {
        selections.value.starters[
          position as keyof typeof selections.value.starters
        ] =
          existingLineup.value?.find(p => p.position_specific === position)
            ?.player_id || '';
      }
      for (let position of Object.keys(selections.value.bench)) {
        let player = existingLineup.value?.find(
          p => p.position_specific === position
        );
        selections.value.bench[
          position as keyof typeof selections.value.bench
        ] = player?.player_id ?? '';
        if (player) {
          // benchPositions.value[position as keyof typeof benchPositions.value].options.push(player.position_general, player.second_position);
          benchPositions.value[
            position as keyof typeof benchPositions.value
          ] = player.position_general;
        }
      }
      for (let role of Object.keys(selections.value.roles)) {
        selections.value.roles[role as keyof typeof selections.value.roles] =
          existingLineup.value?.find(p => p[role as keyof typeof p])
            ?.player_id || '';
      }
      console.log(selections.value.roles);
      powerplay.value = existingLineup.value ? 
        existingLineup.value?.findIndex(p => p.captain2) !== -1 : false;
    }

    watch(existingLineup, newValue => {
      fillExistingSelections();
    })

    onMounted(async () => {
      loadMatchAndLineup();
    });

    return {
      loaded,
      error,
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
    };
  },
  components: {
    PlayerSelection,
  },
});
</script>

<style lang="scss" scoped>
#lineupContainer {
  margin: 20px 0px;
  transition: box-shadow 0.5s ease;
  overflow: hidden;
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
</style>
