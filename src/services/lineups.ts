import { PlayerLineupEntry } from "../global";
import { store } from "../store";
import { MutationTypes } from "../store-types";
import { GetActiveRoundNumber } from "./rounds";
import { GetData, SetData } from "./session";
import { GetActiveUserTeamShort, GetLineup, GetLineupByTeamAndRound } from "./xrlApi";

export async function GetUserLineup(): Promise<void> {
  if (!store.state.lineup) {
    let lineup = await GetLineup();
    if (lineup.length === 0 && store.getters.activeRoundNumber > 1) {
      lineup = await GetLineupByTeamAndRound(store.getters.activeRoundNumber - 1, store.getters.activeUserTeamShort);
    }
    store.commit(MutationTypes.SET_LINEUP, lineup);
  }
  // const sessionData = GetData('userLineup');
  // if (sessionData) return JSON.parse(sessionData) as PlayerLineupEntry[];
  // let apiData = await GetLineup();
  // if (apiData.length === 0) {
  //   apiData = await GetLineupByTeamAndRound(GetActiveRoundNumber() - 1, GetActiveUserTeamShort());
  // } 
  // SetData('userLineup', JSON.stringify(apiData));
  // return apiData;
}

export function GetLineupScore(lineup: PlayerLineupEntry[]) {
  return lineup.reduce(function(totalScore, player) {
      if (player.played_xrl && player.score) {
          return totalScore + player.score;
      } else {
          return totalScore;
      }
  }, 0);
}