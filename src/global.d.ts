import { NrlClubs, XrlTeams } from './services/players';
import { LineupPositions } from './services/utils';

export type XrlPosition = 'Back' | 'Forward' | 'Playmaker';
export type LineupPositionType = typeof LineupPositions[number];
export type NrlClub = typeof NrlClubs[number];
export type XrlTeam = typeof XrlTeams[number];

export type Player = {
  pk: string; // PLAYER#{{player_id}}
  sk: string; // PROFILE
  data: string; // TEAM#{{xrl_team}}
  player_id: string;
  player_name: string;
  nrl_club: NrlClub;
  xrl_team: XrlTeam;
  position: XrlPosition;
  position2: XrlPosition | null;
  position3: XrlPosition | null;
  search_name: string;
  stats: PlayerProfileStats;
  scoring_stats: PlayerScoringStats;
  new_position_appearances: {
    Back?: number;
    Playmaker?: number;
    Forward?: number;
  };
  times_as_captain: number;
  year?: Number | null;
};

export type PlayerRawStats = {
  '1 Point Field Goals': number;
  '2 Point Field Goals': number;
  '20/40': number;
  '40/20': number;
  'All Run Metres': number;
  'All Runs': number;
  'Bomb Kicks': number;
  'Conversion Attempts': number;
  Conversions: number;
  'Cross Field Kicks': number;
  'Dummy Half Run Metres': number;
  'Dummy Half Runs': number;
  'Dummy Passes': number;
  Errors: number;
  'Forced Drop Outs': number;
  'Goal Conversion Rate': number;
  Grubbers: number;
  'Handling Errors': number;
  'Hit Ups': number;
  'Ineffective Tackles': number;
  'Inside 10 Metres': number;
  Intercepts: number;
  'Kick Return Metres': number;
  'Kicked Dead': number;
  'Kicking Metres': number;
  Kicks: number;
  'Kicks Defused': number;
  'Line Break Assists': number;
  'Line Breaks': number;
  'Line Engaged Runs': number;
  'Mins Played': number;
  'Missed Tackles': number;
  Number: number;
  Offloads: number;
  'On Report': number;
  'One on One Lost': number;
  'One on One Steal': number;
  Passes: number;
  'Passes To Run Ratio': number;
  Penalties: number;
  'Penalty Goals': number;
  'Play The Ball': number;
  Points: number;
  Position: string;
  'Post Contact Metres': number;
  Receipts: number;
  'Ruck Infringements': number;
  'Send Offs': number;
  'Sin Bins': number;
  'Stint One': number;
  'Stint Two': number;
  'Tackle Breaks': number;
  'Tackles Made': number;
  'Total Points': number;
  Tries: number;
  'Try Assists': number;
};

export type PlayerProfileStats = {
  appearances: string;
} & PlayerRawStats;

type ScoringStats = {
  '2point_field_goals': number;
  concede: number;
  field_goals: number;
  involvement_try: number;
  mia: number;
  points: number;
  positional_try: number;
  send_off_deduction: number;
  send_offs: number;
  sin_bins: number;
  tries: number;
};

type KickingStats = {
  goals: number;
  points: number;
};

export type PlayerScoringStats = {
  Back?: ScoringStats;
  Playmaker?: ScoringStats;
  Forward?: ScoringStats;
  kicker: KickingStats;
};

export type PlayerExportData = {
  'Name': string;
  'Position': string;
  'Position 2': string | null;
  'Position 3': string | null;
  'Appearances': number;
  'Tries': number;
  'Goals': number;
  'Field Goals': number;
  '2pt Field Goals': number;
  'IT': number;
  'PT': number;
  'MIA': number;
  'Concede': number;
  'Sin Bins': number;
  'Send Offs': number;
  'Points (NK)': number;
  'Points (K)': number;
  'Points Per Game': number;
}

export type AppearanceExportData = {
  'Name': string;
  'Club': NrlClub,
  'Opponent': NrlClub,
  'Position Played': string,
  'Mins': number,
  'Tries': number;
  'Goals': number;
  'Field Goals': number;
  '2pt Field Goals': number;
  'IT': number;
  'PT': number;
  'MIA': number;
  'Concede': number;
  'Sin Bin': number;
  'Sent Off': number;
  'Points (NK)': number;
  'Points (K)': number;
}

export type PlayerLineupEntry = {
  pk: string; // PLAYER#{{player_id}}
  sk: string; // LINEUP#{{round_number}}
  data: string; // TEAM#{{team_short}}
  backup_kicker: boolean;
  captain: boolean;
  captain2: boolean;
  kicker: boolean;
  kicking_score?: number;
  nrl_club: string;
  played_nrl: boolean;
  played_xrl: boolean;
  player_id: string;
  player_name: string;
  playing_score?: number;
  position_general: string;
  position_number: number;
  position_specific: string;
  round_number: string;
  score?: number;
  second_position: string | null;
  vice: boolean;
  xrl_team: string;
  year: number;
};

export type PlayerAppearanceStats = {
  pk: string; // PLAYER#{{player_id}}
  sk: string; // STATS#{{round_number}}
  data: string; // CLUB#{{nrl_club}}
  nrl_club: NrlClub;
  opponent: NrlClub;
  player_id: string;
  player_name: string;
  round_number: string;
  scoring_stats: PlayerScoringStats;
  stats: PlayerRawStats;
};

export type PlayerLineupEntryWithStats = {
  appearanceStats: PlayerAppearanceStats | undefined;
} & PlayerLineupEntry;

export type XrlUser = {
  pk: string; // USER#{{username}}
  sk: string; // DETAILS
  data: string; // NAME#{{team_short}}
  homeground: string;
  inbox: UserMessage[];
  players_picked: number;
  powerplays: number;
  provisional_drop: string[] | null;
  stats: XrlUserStats;
  team_name: string;
  team_short: XrlTeam;
  username: string;
  waiver_preferences: WaiverPreference[];
  waiver_rank: number;
};

export type XrlUserStats = {
  against: number;
  draws: number;
  for: number;
  losses: number;
  points: number;
  wins: number;
}

export type XrlRound = {
  pk: string; // ROUND#{{round_number}
  sk: string; // STATUS
  data: string; // ACTIVE#{{true|false}}
  active: boolean;
  completed: boolean;
  in_progress: boolean;
  round_number: number;
  scooping: boolean;
};

export type XrlFixture = {
  pk: string; // ROUND#{{round_number}}
  sk: string; // FIXTURE#{{team_short}}#{{team_short}}
  data: string; // COMPLETED#{{true|false}}
  away: XrlTeam;
  away_score: number;
  home: XrlTeam;
  home_score: number;
  round_number?: number;
};

export type XrlMatchLineup = {
  starters: {
    fullback: string;
    winger1: string;
    centre1: string;
    centre2: string;
    winger2: string;
    five_eighth: string;
    halfback: string;
    prop1: string;
    hooker: string;
    prop2: string;
    row1: string;
    row2: string;
    lock: string;
  },
  bench: {
    int1: string;
    int2: string;
    int3: string;
    int4: string;
  },
  roles: {
    captain: string;
    captain2: string;
    vice: string;
    kicker: string;
    backup_kicker: string;
  },
}

export type XrlRoundWithFixtures = {
  fixtures: XrlFixture[];
} & XrlRound;

export type UserMessage = {
  sender: string;
  datetime: string | Date;
  subject: string;
  message: string;
};

export type WaiverPreference = {
  pick: string;
  drop: string[]
}

export type LoadedWaiverPreference = {
  pick: Player,
  drop: Player[]
}

export type WaiverReport = {
  pk: string; // WAIVER
  sk: string; // REPORT#{{round_number}}_{{Tuesday|Wednesday}}
  data: string; // WAIVER_REPORT
  waiver_round: string;
  report: string;
};

export type Transfer = {
  pk: string; // TRANSFER#{{username}}{{datetime}}
  sk: string; // TRANSFER
  data: string; // ROUND#{{round_number}}
  player_id: string;
  round_number: number;
  datetime: string;
  type: 'Drop' | 'Waiver' | 'Scoop';
  user: string;
  seller?: string;
};

export type TradeOfferBuilder = {
  sendingUser: XrlUser,
  targetUser: XrlUser | null,
  playersWanted: Player[],
  playersOffered: Player[],
  powerplaysWanted: number,
  powerplaysOffered: number,  
}

export type TradeOffer = {
  pk: string;
  sk: string;
  data: string;
  offer_id: string;
  datetime: string;
  offered_by: string;
  offered_to: string;
  players_offered: string[];
  players_wanted: string[];
  powerplays_offered: number;
  powerplays_wanted: number;
  offer_status: string;
  year: number;
}

export type MappedTradeOffer = {
  pk: string,
  offeredBy: XrlUser | undefined;
  userOffer: boolean;
  offeredTo: XrlUser | undefined;
  playersOffered: (Player | undefined)[];
  playersWanted: (Player | undefined)[];
  powerplaysOffered: number;
  powerplaysWanted: number;
  date: string;
  status: string;
}



export type PlayerNews = {
  pk: string, //NEWS
  sk: string, //PLAYER#...
  data: string, //ROUND#...,
  player_id: string,
  round_number: number,
  nrl_club: NrlClub,
  player_name: string,
  datetime: string | Date,
  log: string
}

export type UserYearStats = {
  pk: string; // USER#{{username}}
  sk: string; // YEARSTATS#{{year}}
  data: string; // TEAM#{{team_short}}
  username: string;
  year: number;
  stats: XrlUserStats;
}

export type PlayerYearStats = {
  pk: string; // PLAYER#{{player_id}}
  sk: string; // YEARSTATS#{{year}}
  data: string; // PLAYER_NAME#{{player_name}}
  player_name: string;
  search_name: string;
  year: number;
  stats: PlayerRawStats;
  scoring_stats: PlayerScoringStats;
}
