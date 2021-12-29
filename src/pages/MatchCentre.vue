<template>
  <div>
    <section v-if="loaded">
      <div v-if="roundInfo" id="roundHeader">
        <div v-if="isUserMatch && roundInfo.round_number > 1">
          <Button
            @click="goToLastMatch"
            class="p-button-primary"
            icon="pi pi-backward"
          />
        </div>
        <div>
          <h3>Round {{ roundInfo?.round_number }}</h3>
          <h2>{{ homeTeam?.team_name }} v {{ awayTeam?.team_name }}</h2>
          <h3>at {{ homeTeam?.homeground }}</h3>
        </div>
        <div v-if="isUserMatch && roundInfo.round_number < 21">
          <Button
            @click="goToNextMatch"
            class="p-button-primary"
            icon="pi pi-forward"
          />
        </div>
      </div>
      <div id="fixtureContainer">
        <TeamScore
          :team="homeTeam"
          :roundNumber="roundInfo?.round_number"
          :key="homeTeam"
        />
        <TeamScore
          :team="awayTeam"
          :roundNumber="roundInfo?.round_number"
          :key="awayTeam"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue';
  import { XrlFixture, XrlRoundWithFixtures, XrlUser } from '../global';
  import {
    GetActiveRoundInfo,
    GetRoundInfo,
    GetTeamFixtureFromRound,
  } from '../services/rounds';
  import { GetUserInfo, GetUserInfoByTeamShort } from '../services/users';
  import { TeamScore } from '../components';
  import { useRoute, RouterLink } from 'vue-router';

  export default defineComponent({
    setup() {
      const loaded = ref(false);

      const { query } = useRoute();

      const roundInfo = ref<XrlRoundWithFixtures>();
      const fixture = ref<XrlFixture>();
      const user = ref<XrlUser>();
      const homeTeam = ref<XrlUser>();
      const awayTeam = ref<XrlUser>();
      const isUserMatch = computed(() => {
        return [fixture.value?.home, fixture.value?.away].includes(
          user.value?.team_short
        );
      });

      async function goToLastMatch() {
        if (roundInfo.value && user.value) {
          loadFixture(roundInfo.value.round_number - 1, user.value.team_short);
        }
      }

      async function goToNextMatch() {
        if (roundInfo.value && user.value) {
          loadFixture(roundInfo.value.round_number + 1, user.value.team_short);
        }
      }

      async function loadFixture(roundNumber: number | null, teamName: string) {
        try {
          roundInfo.value = roundNumber
            ? await GetRoundInfo(roundNumber)
            : await GetActiveRoundInfo();
          if (!roundInfo.value) throw "Couldn't find round info";
          let team = teamName || user.value?.team_short || '';
          fixture.value = GetTeamFixtureFromRound(roundInfo.value, team);
          if (!fixture.value) throw "Couldn't find fixture";
          homeTeam.value = await GetUserInfoByTeamShort(fixture.value.home);
          awayTeam.value = await GetUserInfoByTeamShort(fixture.value.away);
        } catch (err) {
          console.log(err);
        } finally {
          loaded.value = true;
        }
      }

      onMounted(async () => {
        user.value = await GetUserInfo();
        loadFixture(
          Number(query.round),
          (query.fixture as string)?.split('-v-')[0]
        );
      });

      return {
        loaded,
        roundInfo,
        fixture,
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
