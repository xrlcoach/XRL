<template>
  <div>
    <section v-if="loaded">
      <div v-if="roundInfo" id="roundHeader">
        <div v-if="isUserMatch && roundInfo.round_number > 1">
          <Button @click="goToLastMatch" class="p-button-primary" icon="pi pi-backward" />
        </div>
        <div>
          <h3>Round {{ roundInfo?.round_number }}</h3>
          <h2>{{ homeTeam?.team_name }} v {{ awayTeam?.team_name }}</h2>
          <h3>at {{ homeTeam?.homeground }}</h3>
        </div>
        <div v-if="isUserMatch && roundInfo.round_number < 25">
          <Button @click="goToNextMatch" class="p-button-primary" icon="pi pi-forward" />
        </div>
      </div>
      <div v-if="homeTeam && awayTeam" id="fixtureContainer">
        <TeamScore
          v-if="roundInfo"
          :team="homeTeam"
          :roundNumber="roundInfo?.round_number"
        />
        <TeamScore
          v-if="roundInfo"
          :team="awayTeam"
          :roundNumber="roundInfo?.round_number"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { XrlFixture, XrlRoundWithFixtures, XrlUser } from '../global';
import {
  GetTeamFixtureFromRound,
} from '../services/rounds';
import { TeamScore } from '../components';
import { useRoute, RouterLink } from 'vue-router';
import { useXrlStore } from '../store';

export default defineComponent({
  setup() {
    const store = useXrlStore();
    const loaded = ref(false);

    const { query } = useRoute();

    const user = computed(() => store.state.user);
    const roundInfo = ref<XrlRoundWithFixtures | null>();
    const fixture = ref<XrlFixture>();
    const homeTeam = ref<XrlUser | null>();
    const awayTeam = ref<XrlUser | null>();
    const isUserMatch = computed(() => {
      return [fixture.value?.home, fixture.value?.away].includes(
        user.value?.team_short
      );
    });

    function goToLastMatch() {
      if (roundInfo.value && user.value) {
        try {
          loadFixture(roundInfo.value.round_number - 1, user.value.team_short);
        } catch (err) {
          if (err === "Couldn't find fixture") {
            goToLastMatch();
          } else {
            console.log(err);
          }
        }
      }
    }

    function goToNextMatch() {
      if (roundInfo.value && user.value) {
        try {
          loadFixture(roundInfo.value.round_number + 1, user.value.team_short);
        } catch (err) {
          if (err === "Couldn't find fixture") {
            goToNextMatch();
          } else {
            console.log(err);
          }
        }
      }
    }

    function loadFixture(roundNumber: number | null, teamName: string) {
      roundInfo.value = store.getters.getRoundInfo(roundNumber ?? 0);
      if (!roundInfo.value) throw "Couldn't find round info";
      let team = teamName || user.value?.team_short || '';
      fixture.value = GetTeamFixtureFromRound(roundInfo.value, team);
      if (!fixture.value) throw "Couldn't find fixture";
      homeTeam.value = store.getters.getUserByTeamShort(fixture.value.home);
      awayTeam.value = store.getters.getUserByTeamShort(fixture.value.away);
    }

    onMounted(async () => {
      try {
        const roundNumber = query.round ? Number(query.round) : store.getters.activeRoundNumber;
        const team = (query.fixture as string)?.split('-v-')[0] ?? store.getters.activeUserTeamShort;
        loadFixture(roundNumber, team);
      } catch (err) {
        console.log(err);
      } finally {
        loaded.value = true;
      }
    });

    return {
      loaded,
      roundInfo,
      homeTeam,
      awayTeam,
      isUserMatch,
      goToLastMatch,
      goToNextMatch,
    };
  },
  components: {
    TeamScore,
    RouterLink,
  },
});
</script>

<style scoped>
#fixtureContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

#roundHeader #fixtureContainer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

#roundHeader {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
}

@media screen and (min-width: 948px) {
  #fixtureContainer {
    flex-direction: row;
    justify-content: space-evenly;
  }
}

.teamScoreHeader {
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: center;
}
</style>
