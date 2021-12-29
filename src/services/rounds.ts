import { XrlRound, XrlRoundWithFixtures } from '../global';
import { GetData, SetData } from './session';
import { GetUserInfo } from './users';
import { GetAllFixtures, getCookie, GetNextRoundStatus } from './xrlApi';

export function GetActiveRoundNumber() {
  return Number(getCookie('round'));
}

export async function GetAllRounds() {
  const sessionData = GetData('allRounds');
  if (sessionData) {
    return JSON.parse(sessionData) as XrlRoundWithFixtures[];
  }
  const apiData = await GetAllFixtures();
  SetData('allRounds', JSON.stringify(apiData));
  return apiData;
}

export async function GetActiveRoundInfo() {
  const sessionData = GetData('currentRound');
  if (sessionData) {
    return JSON.parse(sessionData) as XrlRoundWithFixtures;
  }

  const allRounds = await GetAllRounds();
  const activeRounds = allRounds.filter(r => r.active);
  const roundNumbers = activeRounds.map(r => r.round_number);
  const currentRoundNumber = Math.max(...roundNumbers);
  const currentRound = allRounds.find(
    r => r.round_number == currentRoundNumber
  );
  if (!currentRound) throw "Couldn't find active round info";
  SetData('currentRound', JSON.stringify(currentRound));
  return currentRound;
}

export async function GetRoundInfo(roundNumber: number) {
  const allRounds = await GetAllRounds();
  const specifiedRound = allRounds.find(r => r.round_number === roundNumber);
  if (!specifiedRound) throw "Couldn't find info for round " + roundNumber;
  return specifiedRound;
}

export async function GetUserFixtures() {
  const allRounds = await GetAllRounds();
  const user = await GetUserInfo();
  const fixtures = allRounds.map(r =>
    r.fixtures.find(
      f => f.away === user.team_short || f.home === user.team_short
    )
  );
  return fixtures;
}

export async function GetUserActiveFixture() {
  const activeRound = await GetActiveRoundInfo();
  const user = await GetUserInfo();
  const fixture = activeRound?.fixtures.find(
    f => f.away === user.team_short || f.home === user.team_short
  );
  return fixture;
}

export async function GetUserLastFixture() {
  const roundInfo = await GetRoundInfo(GetActiveRoundNumber() - 1);
  const user = await GetUserInfo();
  const fixture = roundInfo?.fixtures.find(
    f => f.away === user.team_short || f.home === user.team_short
  );
  return fixture;
}

export async function GetFixture(roundNumber: number, teamShort: string) {
  const roundInfo = await GetRoundInfo(roundNumber);
  const fixture = roundInfo?.fixtures.find(
    f => f.away === teamShort || f.home === teamShort
  );
  return fixture;
}

export async function GetNextRoundNotInProgress() {
  const allRounds = await GetAllRounds();
  const notInProgressRounds = allRounds.filter(r => !r.in_progress);
  const roundNumbers = notInProgressRounds.map(r => r.round_number);
  if (roundNumbers.length === 0) {
    return allRounds[allRounds.length - 1];
  }
  const nextRoundNumber = Math.min(...roundNumbers);
  const nextRound = allRounds.find(r => r.round_number == nextRoundNumber);
  return nextRound;
}

export function GetTeamFixtureFromRound(
  roundInfo: XrlRoundWithFixtures,
  teamShort: string
) {
  return roundInfo?.fixtures.find(
    f => f.away === teamShort || f.home === teamShort
  );
}
