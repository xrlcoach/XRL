import { Player, PlayerScoringStats, XrlPosition } from "../global";
import { GetData, SetData } from "./session";
import { GetActiveUserTeamShort, GetPlayersFromXrlTeam } from "./xrlApi";

export const NrlClubs = [
  'Broncos',
  'Bulldogs',
  'Cowboys',
  'Dragons',
  'Eels',
  'Knights',
  'Panthers',
  'Rabbitohs',
  'Raiders',
  'Roosters',
  'Sea Eagles',
  'Sharks',
  'Storm',
  'Titans',
  'Warriors',
  'Wests Tigers',
] as const;

export const XrlTeams = [
  'BOX',
  'BWS', 
  'CBT',
  'COU',
  'DRU',
  'GUN',
  'MCD',
  'MON',
  'PUN',
  'RAM',
  'ROX',
  'WOL',
  'XIII',
  'None'
] as const;

export async function GetUserSquad() {
  const sessionData = GetData('userSquad');
  if (sessionData) return JSON.parse(sessionData) as Player[];
  const userTeam = GetActiveUserTeamShort();
  const apiData = await GetPlayersFromXrlTeam(userTeam);
  SetData('userSquad', JSON.stringify(apiData));
  return apiData;
}

export const PositionOrder = ['Back', 'Playmaker', 'Forward'];

export function DefaultPlayerSort(p1: Player, p2: Player) {
  if (p1.position == p2.position) {
      return p1.player_name.split(' ')[1] > p2.player_name.split(' ')[1] ? 1 : -1;
  }
  return PositionOrder.indexOf(p1.position) - PositionOrder.indexOf(p2.position);
}

export function SortByTotalXrlScore<T extends { scoring_stats: PlayerScoringStats, position: XrlPosition }>(p1: T, p2: T) {    
  return ((p2.scoring_stats[p2.position]?.points || 0) + (p2.scoring_stats.kicker.points || 0)) - ((p1.scoring_stats[p1.position]?.points || 0) + (p1.scoring_stats.kicker.points || 0));
}