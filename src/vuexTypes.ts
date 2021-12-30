import {
  NrlClub,
  Player,
  PlayerLineupEntry,
  XrlFixture,
  XrlRound,
  XrlRoundWithFixtures,
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
}

export type Getters = {
  activeUserTeamShort(state: State): string;
  currentRound(state: State): XrlRoundWithFixtures | null;
  activeRoundNumber(state: State, getters: any): number;
  squad(state: State, getters: any): Player[];
  lastMatch(state: State, getters: any): XrlFixture | null;
  nextMatch(state: State, getters: any): XrlFixture | null;
  xrlLadder(state: State): XrlUser[];
  getNrlSquad(state: State): (club: NrlClub) => Player[];
};

export enum MutationTypes {
  SET_ACTIVE_USER = 'SET_ACTIVE_USER',
  SET_ALL_ROUNDS = 'SET_ALL_ROUNDS',
  SET_ALL_USERS = 'SET_ALL_USERS',
  SET_LINEUP = 'SET_LINEUP',
  SET_ALL_PLAYERS = 'SET_ALL_PLAYERS',
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
  [MutationTypes.CLEAR_SESSION_DATA](state: S): void;
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
  GetActiveUser = 'GetActiveUser',
  GetAllUsers = 'GetAllUsers',
  GetAllPlayers = 'GetAllPlayers',
  UpdatePlayerXrlTeam = 'UpdatePlayerXrlTeam',
  ScoopPlayers = 'ScoopPlayers',
  DropPlayers = 'DropPlayers',
  GetLineup = 'GetLineup',
  GetLineupByTeamAndRound = 'GetLineupByTeamAndRound',
  SetLineup = 'SetLineup',
  GetAllFixtures = 'GetAllFixtures',
  GetAllStats = 'GetAllStats',
  UpdateUserWaiverPreferences = 'UpdateUserWaiverPreferences',
  GetTransferHistory = 'GetTransferHistory',
  GetTransferHistoryByRound = 'GetTransferHistoryByRound',
  GetWaiverReports = 'GetWaiverReports',
  GetPlayerNews = 'GetPlayerNews',
}

export interface Actions {
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
  [ActionTypes.GetLineup]({
    commit,
  }: AugmentedActionContext): Promise<PlayerLineupEntry[]>;
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
