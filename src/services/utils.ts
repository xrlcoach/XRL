import { AppearanceExportData, Player, PlayerAppearanceStats, PlayerExportData, PlayerScoringStats, ScoringStats, XrlPosition } from '../global';
import { LoadSessionData } from './auth';
import { DomHandler } from 'primevue/utils';

export const CURRENT_YEAR = 2022;

export const LineupPositions = ['Back', 'Forward', 'Playmaker', 'Interchange'] as const;

export const PositionMap = {
  fullback: LineupPositions[0],
  winger1: LineupPositions[0],
  winger2: LineupPositions[0],
  centre1: LineupPositions[0],
  centre2: LineupPositions[0],
  five_eighth: LineupPositions[2],
  halfback: LineupPositions[2],
  hooker: LineupPositions[2],
  prop1: LineupPositions[1],
  prop2: LineupPositions[1],
  row1: LineupPositions[1],
  row2: LineupPositions[1],
  lock: LineupPositions[1],
  int1: LineupPositions[3],
  int2: LineupPositions[3],
  int3: LineupPositions[3],
  int4: LineupPositions[3],
};

export const PositionNumbers = {
  fullback: 1,
  winger1: 2,
  winger2: 5,
  centre1: 3,
  centre2: 4,
  five_eighth: 6,
  halfback: 7,
  hooker: 9,
  prop1: 8,
  prop2: 10,
  row1: 11,
  row2: 12,
  lock: 13,
  int1: 14,
  int2: 15,
  int3: 16,
  int4: 17,
};

export const PositionNames = {
  fullback: 'Fullback',
  winger1: 'Winger',
  winger2: 'Winger',
  centre1: 'Centre',
  centre2: 'Centre',
  five_eighth: 'Five-Eighth',
  halfback: 'Halfback',
  hooker: 'Hooker',
  prop1: 'Prop',
  prop2: 'Prop',
  row1: '2nd Row',
  row2: '2nd Row',
  lock: 'Lock',
  int1: 'Interchange',
  int2: 'Interchange',
  int3: 'Interchange',
  int4: 'Interchange',
};

export const PositionOrder = ['Back', 'Playmaker', 'Forward'];

export const XrlRelevantStats = [
  'All Runs',
  'Line Breaks',
  'Line Break Assists',
  'Try Assists',
  'Tackle Breaks',
  'Offloads',
  'Tackles Made',
  'Kicks',
  '40/20',
  '20/40',
  'All Runs',
  'All Run Metres',
  'Kicking Metres',
  'One on One Steal',
  'Conversions',
  'Penalty Goals',
  'Errors',
  'Missed Tackles',
];

export function GetOrdinal(num: number | string) {
  let str = String(num);
  let lastNum = str.charAt(str.length - 1);
  let secondLastNum = str.charAt(str.length - 2);
  if (lastNum == '1' && secondLastNum != '1') {
    return str + 'st';
  } else if (lastNum == '2' && secondLastNum != '1') {
    return str + 'nd';
  } else if (lastNum == '3') {
    return str + 'rd';
  } else {
    return str + 'th';
  }
}

export function GetPlayerXrlScores(
  scoringPosition: XrlPosition,
  appearance: PlayerAppearanceStats,
  scoreAsKicker = true
) {
  let score = 0;
  let stats = appearance.scoring_stats;
  //Iterate through the position keys in the scoring_stats object
  for (let position of Object.keys(stats)) {
    //Score kicking stats by default, but can be turned off
    if (position === 'kicker' && scoreAsKicker) {
      //2 points for each goal (conversion or penalty goal)
      score += stats[position].goals * 2;
      //Score stats for the provided position
    } else if (position === scoringPosition) {
      //4 points for each try
      score += (stats[position]?.tries ?? 0) * 4;
      //1 point for each field goal
      score += stats[position]?.field_goals ?? 0;
      //2 points for each 2pt field goal
      score += (stats[position]?.['2point_field_goals'] ?? 0) * 2;
      //-2 points for a sin bin
      score -= (stats[position]?.sin_bins ?? 0) * 2;
      //-4 points for a red card and -1 for every 10 mins off field
      if (stats[position] && stats[position]?.send_offs !== 0) {
        let sendOffMinute = stats[position]?.send_offs ?? 0;
        let minutes = 80 - sendOffMinute;
        let deduction = Math.floor(minutes / 10) + 4;
        score -= deduction;
      }
      //4 points for involvement and positional tries
      if (stats[position]?.involvement_try) score += 4;
      if (stats[position]?.positional_try) score += 4;
      //-4 points for conceding and missing-in-action
      if (stats[position]?.mia) score -= 4;
      if (stats[position]?.concede) score -= 4;
    }
  }
  return score;
}

export async function RefreshSession() {
  sessionStorage.clear();
  await LoadSessionData();
}

export function isPlayer(object: any): object is Player {
  if (object?.player_id) return true;
  return false;
}

export function createPlayerExportData(players: Player[]) {
  const data = players.map(p => {
    const scoring = p.scoring_stats[
      p.position as keyof PlayerScoringStats
    ] as ScoringStats | undefined;
    const appearances = Number(p.stats?.appearances);
    const pointsAsKicker = (scoring?.points ?? 0) + (p.scoring_stats?.kicker?.points ?? 0);
    const pointsPerGame = appearances ? +(pointsAsKicker / appearances).toFixed(2) : 0;
    const playerData: PlayerExportData = {
      'Name': p.player_name,
      'Position': p.position,
      'Position 2': p.position2,
      'Position 3': p.position3,
      'Appearances': appearances,
      'Tries': p.stats.Tries ?? 0,
      'Goals': p.scoring_stats?.kicker?.goals ?? 0,
      'Field Goals': p.stats['1 Point Field Goals'] ?? 0,
      '2pt Field Goals': p.stats['2 Point Field Goals'] ?? 0,
      'IT': scoring?.involvement_try ?? 0,
      'PT': scoring?.positional_try ?? 0,
      'MIA': scoring?.mia ?? 0,
      'Concede': scoring?.concede ?? 0,
      'Sin Bins': p.stats?.['Sin Bins'] ?? 0,
      'Send Offs': p.stats?.['Send Offs'] ?? 0,
      'Points (NK)': scoring?.points ?? 0,
      'Points (K)': pointsAsKicker,
      'Points Per Game': pointsPerGame
    };
    return playerData;
  });
  return data;
}

export function createAppearanceExportData(appearances: (PlayerAppearanceStats & Player)[]) {
  const data = appearances.map(p => {
    const scoring = p.scoring_stats[
      p.position as keyof PlayerScoringStats
    ] as ScoringStats | undefined;
    const appearances = Number(p.stats?.appearances);
    const pointsAsKicker = (scoring?.points ?? 0) + (p.scoring_stats?.kicker?.points ?? 0);
    const pointsPerGame = appearances ? +(pointsAsKicker / appearances).toFixed(2) : 0;
    const playerData: AppearanceExportData = {
      'Name': p.player_name,
      'Position Played': p.stats.Position,
      'Club': p.nrl_club,
      'Opponent': p.opponent,
      'Mins': p.stats['Mins Played'],
      'Tries': p.stats.Tries ?? 0,
      'Goals': p.scoring_stats?.kicker?.goals ?? 0,
      'Field Goals': p.stats['1 Point Field Goals'] ?? 0,
      '2pt Field Goals': p.stats['2 Point Field Goals'] ?? 0,
      'IT': Number(scoring?.involvement_try ?? 0),
      'PT': Number(scoring?.positional_try ?? 0),
      'MIA': Number(scoring?.mia ?? 0),
      'Concede': Number(scoring?.concede ?? 0),
      'Sin Bin': p.stats['Sin Bins'],
      'Sent Off': p.stats['Send Offs'],
      'Points (NK)': GetPlayerXrlScores(p.position, p, false),
      'Points (K)': GetPlayerXrlScores(p.position, p, true),
    };
    return playerData;
  });
  return data;
}

export function exportStatsAsCSV(data: any[], fileName: string) {
  if (!data.length) return;
  let csv = '\ufeff';
  const columns: string[] = Object.keys(data[0]);
  //headers
  let headerInitiated = false;
  for (let i = 0; i < columns.length; i++) {
    let column = columns[i];
    if (headerInitiated) {
      csv += ',';
    } else {
      headerInitiated = true;
    }
    csv += '"' + column + '"';
  }

  //body
  if (data) {
    data.forEach(record => {
      csv += '\n';
      let rowInitiated = false;
      for (let i = 0; i < columns.length; i++) {
        let column = columns[i];
        if (rowInitiated) csv += ",";
        else rowInitiated = true;
        let cellData = record[column as keyof typeof record];

        if (cellData != null) {
          cellData = String(cellData).replace(/"/g, '""');
        } else cellData = '';
        csv += '"' + cellData + '"';
      }
    });
  }
  DomHandler.exportCSV(csv, fileName ?? 'xrlstats');
}

export function getJerseyUrl(club: string | undefined): string {
  return encodeURI(
    `https://raw.githubusercontent.com/xrlcoach/XRL/main/src/assets/jerseys/${
      club || 'default'
    }_jersey.png`
  ); 
}