import { PlayerAppearanceStats, XrlPosition } from "../global";
import { LoadSessionData } from "./auth";

export const PositionMap = {
  fullback: 'Back',
  winger1: 'Back',
  winger2: 'Back',
  centre1: 'Back',
  centre2: 'Back',
  five_eighth: 'Playmaker',
  halfback: 'Playmaker',
  hooker: 'Playmaker',
  prop1: 'Forward',
  prop2: 'Forward',
  row1: 'Forward',
  row2: 'Forward',
  lock: 'Forward',
  int1: 'Interchange',
  int2: 'Interchange',
  int3: 'Interchange',
  int4: 'Interchange',
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
    int4: 17
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

export function GetPlayerXrlScores(scoringPosition: XrlPosition, appearance: PlayerAppearanceStats, scoreAsKicker = true) {
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
          score += (stats[position]?.["2point_field_goals"] ?? 0) * 2;
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
