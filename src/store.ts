import { InjectionKey } from 'vue';
import { ActionTree, createStore, GetterTree, MutationTree, Store, useStore as baseUseStore } from 'vuex';
import { NrlClub, Player, PlayerLineupEntry, XrlRoundWithFixtures, XrlUser } from './global';
import { SortLeageTable } from './services/users';
import { ActionTypes, MutationTypes } from './vuexTypes';
import type { Getters, Mutations, State, Actions, XrlStore } from './vuexTypes';
import { GetActiveUserInfo, GetAllFixtures, GetAllPlayers, GetAllUsers, GetLineup, GetLineupByTeamAndRound } from './services/xrlApi';
import { GetActiveRoundInfo, GetUserActiveFixture, GetUserLastFixture } from './services/rounds';

const state = {
  user: null,
  allUsers: null,
  allRounds: null,
  lineup: null,
  allPlayers: null,
};

const getters: GetterTree<State, State> & Getters = {
  currentRound: state => GetActiveRoundInfo(state.allRounds ?? []),
  activeRoundNumber(state, getters) {
    return getters['currentRound']?.round_number ?? 0;
  },
  activeUserTeamShort: state => state.user?.team_short ?? '',
  xrlLadder: state => state.allUsers ? SortLeageTable(state.allUsers) : [],
  squad(state, getters) {
    return state.allPlayers?.filter(p => p.xrl_team === getters['activeUserTeamShort']) ?? [];
  },
  nextMatch: (state, getters) => state.user ? GetUserActiveFixture(getters['currentRound'], state.user) : null,
  lastMatch: (state, getters) => state.user ? GetUserLastFixture(state.allRounds ?? [], getters['activeRoundNumber'], state.user) : null,
  getNrlSquad: (state) => (club: NrlClub) => state.allPlayers?.filter(p => p.nrl_club === club) ?? [],
};

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_ACTIVE_USER](state, user) {
    state.user = user;
  },
  [MutationTypes.SET_ALL_ROUNDS](state, rounds) {
    state.allRounds = rounds;
  },
  [MutationTypes.SET_ALL_USERS](state, users) {
    state.allUsers = users;
  },
  [MutationTypes.SET_LINEUP](state, lineup) {
    state.lineup = lineup;
  },
  [MutationTypes.SET_ALL_PLAYERS](state, players) {
    state.allPlayers = players;
  },
  [MutationTypes.CLEAR_SESSION_DATA](state) {
    state.user = null;
    state.allUsers = null;
    state.lineup = null;
  }
};

const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.GetActiveUser]({ commit, state }): Promise<XrlUser> {
    if (state.user) {
      return state.user;
    } else {
      const user = await GetActiveUserInfo();
      commit(MutationTypes.SET_ACTIVE_USER, user);
      return user;
    }
  },
  async [ActionTypes.GetAllUsers]({ commit, state }): Promise<XrlUser[]> {
    if (state.allUsers) {
      return state.allUsers;
    } else {
      const users = await GetAllUsers();
      commit(MutationTypes.SET_ALL_USERS, users);
      return users;
    }
  },
  async [ActionTypes.GetAllFixtures]({ commit, state }): Promise<XrlRoundWithFixtures[]> {
    if (state.allRounds) {
      return state.allRounds;
    } else {
      const rounds = await GetAllFixtures();
      commit(MutationTypes.SET_ALL_ROUNDS, rounds);
      return rounds;
    }
  },
  async [ActionTypes.GetAllPlayers]({ commit, state }): Promise<Player[]> {
    if (state.allPlayers) {
      return state.allPlayers;
    } else {
      const players = await GetAllPlayers();
      commit(MutationTypes.SET_ALL_PLAYERS, players);
      return players;
    }
  },
  async [ActionTypes.GetLineup]({ commit, state, getters }): Promise<PlayerLineupEntry[]> {
    if (state.lineup) {
      return state.lineup;
    } else {
      let lineup = await GetLineup();
      if (lineup.length === 0 && getters.activeRoundNumber > 1) {
        lineup = await GetLineupByTeamAndRound(getters.activeRoundNumber, getters.activeUserTeamShort);
      }
      commit(MutationTypes.SET_LINEUP, lineup);
      return lineup;
    }
  },
};

export const key: InjectionKey<XrlStore> = Symbol();

export const store = createStore<State>({
  state,
  getters,
  mutations,
  actions
});

export const useXrlStore = (): XrlStore => {
  return baseUseStore(key);
}