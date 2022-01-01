import {
  NrlClub,
  Player,
  PlayerLineupEntry,
  PlayerNews,
  Transfer,
  WaiverReport,
  XrlFixture,
  XrlRound,
  XrlRoundWithFixtures,
  XrlTeam,
  XrlUser,
} from './global';
import {
  ActionContext,
  CommitOptions,
  DispatchOptions,
  GetterTree,
  Store as VuexStore,
} from 'vuex';

export interface State {
  user: XrlUser | null;
  allUsers: XrlUser[] | null;
  allRounds: XrlRoundWithFixtures[] | null;
  lineup: PlayerLineupEntry[] | null;
  allPlayers: Player[] | null;
  waiverReports: WaiverReport[] | null;
  transfers: Transfer[] | null;
  news: PlayerNews[] | null;
}

export type Getters = {
  activeUserTeamShort(state: State): XrlTeam;
  currentRound(state: State): XrlRoundWithFixtures | null;
  activeRoundNumber(state: State, getters: any): number;
  nextRoundNotInProgress(state: State): XrlRoundWithFixtures | null;
  squad(state: State, getters: any): Player[];
  lastMatch(state: State, getters: any): XrlFixture | null;
  nextMatch(state: State, getters: any): XrlFixture | null;
  xrlLadder(state: State): XrlUser[];
  getNrlSquad(state: State): (club: NrlClub) => Player[];
  getXrlSquad(state: State): (team: XrlTeam) => Player[];
  getPlayerById(state: State): (playerId: string) => Player | null;
  getRoundInfo(state: State): (roundNumber: number) => XrlRoundWithFixtures | null;
  getUserByTeamShort(state: State): (teamShort: XrlTeam) => XrlUser | null;
};

export enum MutationTypes {
  SET_ACTIVE_USER = 'SET_ACTIVE_USER',
  SET_ALL_ROUNDS = 'SET_ALL_ROUNDS',
  SET_ALL_USERS = 'SET_ALL_USERS',
  SET_LINEUP = 'SET_LINEUP',
  SET_ALL_PLAYERS = 'SET_ALL_PLAYERS',
  SET_WAIVER_REPORTS = 'SET_WAIVER_REPORTS',
  SET_TRANSFERS = 'SET_TRANSFERS',
  SET_NEWS = 'SET_NEWS',
  UPDATE_PLAYERS_XRL_TEAM = 'UPDATE_PLAYERS_XRL_TEAM',
  CLEAR_SESSION_DATA = 'CLEAR_SESSION_DATA',
}

export type Mutations<S = State> = {
  [MutationTypes.SET_ACTIVE_USER](state: S, user: XrlUser): void;
  [MutationTypes.SET_ALL_ROUNDS](
    state: S,
    rounds: XrlRoundWithFixtures[]
  ): void;
  [MutationTypes.SET_ALL_USERS](state: S, users: XrlUser[]): void;
  [MutationTypes.SET_LINEUP](state: S, lineup: PlayerLineupEntry[]): void;
  [MutationTypes.SET_ALL_PLAYERS](state: S, players: Player[]): void;
  [MutationTypes.SET_WAIVER_REPORTS](state: S, reports: WaiverReport[]): void;
  [MutationTypes.SET_TRANSFERS](state: S, transfers: Transfer[]): void;
  [MutationTypes.SET_NEWS](state: S, news: PlayerNews[]): void;
  [MutationTypes.CLEAR_SESSION_DATA](state: S): void;
  [MutationTypes.UPDATE_PLAYERS_XRL_TEAM](state: S, { players, team }: { players: Player[], team: XrlTeam }): void;
};

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
} & Omit<ActionContext<State, State>, 'commit' | 'getters'>;

export enum ActionTypes {
  LoadAppData = 'LoadAppData',
  GetActiveUser = 'GetActiveUser',
  GetAllUsers = 'GetAllUsers',
  GetAllPlayers = 'GetAllPlayers',
  GetAllFixtures = 'GetAllFixtures',
  GetUserLineup = 'GetUserLineup',
  GetTransferHistory = 'GetTransferHistory',
  GetWaiverReports = 'GetWaiverReports',
  GetPlayerNews = 'GetPlayerNews',
  SetLineup = 'SetLineup',
  UpdateUserWaiverPreferences = 'UpdateUserWaiverPreferences',
  UpdatePlayerXrlTeam = 'UpdatePlayerXrlTeam',
  ScoopPlayers = 'ScoopPlayers',
  DropPlayers = 'DropPlayers',
}

export interface Actions {
  // #region DATA
  [ActionTypes.LoadAppData]({
    commit,
  }: AugmentedActionContext): void;
  [ActionTypes.GetActiveUser]({
    commit,
  }: AugmentedActionContext): Promise<XrlUser>;
  [ActionTypes.GetAllUsers]({
    commit,
  }: AugmentedActionContext): Promise<XrlUser[]>;
  [ActionTypes.GetAllFixtures]({
    commit,
  }: AugmentedActionContext): Promise<XrlRoundWithFixtures[]>;
  [ActionTypes.GetAllPlayers]({
    commit,
  }: AugmentedActionContext): Promise<Player[]>;
  [ActionTypes.GetUserLineup]({
    commit,
  }: AugmentedActionContext): Promise<PlayerLineupEntry[]>;
  [ActionTypes.GetWaiverReports]({
    commit,
  }: AugmentedActionContext): Promise<WaiverReport[]>;
  [ActionTypes.GetTransferHistory]({
    commit,
  }: AugmentedActionContext): Promise<Transfer[]>;
  [ActionTypes.GetPlayerNews]({
    commit,
  }: AugmentedActionContext): Promise<PlayerNews[]>;
  // #endregion

  // #region UPDATES
  [ActionTypes.SetLineup]({
    commit,
  }: AugmentedActionContext, lineup: PlayerLineupEntry[]): Promise<boolean>;
  [ActionTypes.ScoopPlayers]({
    commit,
  }: AugmentedActionContext, players: Player[]): Promise<boolean>;
  [ActionTypes.DropPlayers]({
    commit,
  }: AugmentedActionContext, players: Player[]): Promise<boolean>;
  [ActionTypes.UpdateUserWaiverPreferences]({
    commit,
  }: AugmentedActionContext): void;
  // #endregion
}

export type XrlStore = Omit<
  VuexStore<State>,
  'getters' | 'commit' | 'dispatch'
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>,
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>,
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  };
};
