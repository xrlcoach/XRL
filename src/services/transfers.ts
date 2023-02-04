import { PlayerNews, WaiverReport } from "../global";
import { GetData, SetData } from "./session";
import { GetPlayerNews, GetWaiverReports } from "./xrlApi";

const sortWaivers = (r1: WaiverReport, r2: WaiverReport) => {
  let r1_round = Number(r1.waiver_round.split('_')[0]);
  let r1_day = r1.waiver_round.split('_')[1];
  let r2_round = Number(r2.waiver_round.split('_')[0]);
  let r2_day = r2.waiver_round.split('_')[1];
  if (r1_round === r2_round) {
    return r1_day === 'Tuesday' ? 1 : -1;
  }
  return r2_round - r1_round
}

export async function GetWaivers() {
  const sessionData = GetData('waivers');
  if (sessionData) {
    let data = JSON.parse(sessionData) as WaiverReport[];
    return data.sort(sortWaivers);
  }
  const apiData = await GetWaiverReports();
  SetData('waivers', JSON.stringify(apiData));
  return apiData.sort(sortWaivers);
}
