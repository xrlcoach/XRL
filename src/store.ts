import { InjectionKey } from 'vue';
import { ActionTree, createStore, GetterTree, MutationTree, Store, useStore as baseUseStore } from 'vuex';
import { NrlClub, Player, PlayerLineupEntry, PlayerNews, TradeOffer, TradeOfferBuilder, Transfer, WaiverPreference, WaiverReport, XrlRoundWithFixtures, XrlTeam, XrlUser } from './global';
import { SortLeageTable } from './services/users';
import { ActionTypes, MutationTypes } from './store-types';
import type { Getters, Mutations, State, Actions, XrlStore } from './store-types';
import { DropPlayers, GetActiveUserInfo, GetAllFixtures, GetAllPlayers, GetAllUsers, GetIdToken, GetLineup, GetLineupByTeamAndRound, GetPlayerNews, GetTransferHistory, GetUserTradeOffers, GetWaiverReports, ProcessTradeOffer, ScoopPlayers, SendTradeOffer, SetLineup, UpdateUserWaiverPreferences, WithdrawTradeOffer } from './services/xrlApi';
import { GetActiveRoundInfo, GetNextRoundNotInProgress, GetUserActiveFixture, GetUserLastFixture } from './services/rounds';

const state = {
  loggedIn: false,
  user: null,
  allUsers: null,
  allRounds: null,
  lineup: null,
  allPlayers: null,
  waiverReports: null,
  transfers: null,
  tradeOffers: null,
  news: null,
  selectedPlayer: null,
  playerProfileVisible: false,
  isMobile: false
};

const getters: GetterTree<State, State> & Getters = {
  currentRound: state => GetActiveRoundInfo(state.allRounds ?? []),
  activeRoundNumber(state, getters) {
    return getters.currentRound?.round_number ?? 0;
  },
  nextRoundNotInProgress: state => GetNextRoundNotInProgress(state.allRounds ?? []),
  activeUserTeamShort: state => state.user?.team_short ?? 'None',
  xrlLadder: state => state.allUsers ? SortLeageTable(state.allUsers) : [],
  squad(state, getters) {
    return state.allPlayers?.filter(p => p.xrl_team === getters.activeUserTeamShort) ?? [];
  },
  nextMatch: (state, getters) => state.user ? GetUserActiveFixture(getters.currentRound, state.user) : null,
  lastMatch: (state, getters) => state.user ? GetUserLastFixture(state.allRounds ?? [], getters.activeRoundNumber, state.user) : null,
  getNrlSquad: (state) => (club: NrlClub) => state.allPlayers?.filter(p => p.nrl_club === club) ?? [],
  getXrlSquad: (state) => (team: XrlTeam) => state.allPlayers?.filter(p => p.xrl_team === team) ?? [],
  getPlayerById: state => (playerId: string) => state.allPlayers?.find(p => p.player_id === playerId) ?? null,
  getRoundInfo: (state) => (roundNumber: number) => state.allRounds?.find(r => r.round_number === roundNumber) ?? null,
  getUserByTeamShort: (state) => (teamShort: XrlTeam) => state.allUsers?.find(u => u.team_short === teamShort) ?? null,
};

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_LOGGED_IN](state) {
    const idToken = GetIdToken();
    if (idToken) state.loggedIn = true;
    else state.loggedIn = false;
  },
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
  [MutationTypes.SET_WAIVER_REPORTS](state, reports) {
    state.waiverReports = reports;
  },
  [MutationTypes.SET_TRANSFERS](state, transfers) {
    state.transfers = transfers;
  },
  [MutationTypes.SET_TRADE_OFFERS](state, offers) {
    state.tradeOffers = offers;
  },
  [MutationTypes.SET_NEWS](state, news) {
    state.news = news;
  },
  [MutationTypes.CLEAR_SESSION_DATA](state) {
    state.user = null;
    state.allUsers = null;
    state.allPlayers = null;
    state.allRounds = null;
    state.lineup = null;
    state.loggedIn = false;
  },
  [MutationTypes.UPDATE_PLAYERS_XRL_TEAM](state, { players, team }) {
    for (let player of players) {
      player.xrl_team = team;
    }
  },
  [MutationTypes.UPDATE_WAIVER_PREFERENCES](state, { preferences }) {
    if (!state.user) return;
    state.user.waiver_preferences = preferences;
  },
  [MutationTypes.UPSERT_TRADE_OFFER](state, { offer }) {
    if (!state.user) return;
    const tradeOffers = [ ...(state.tradeOffers || []) ];
    const existingOffer = tradeOffers.find(o => o.pk === offer.pk);
    if (existingOffer) {
      existingOffer.offer_status = offer.offer_status;
    } else {
      tradeOffers.unshift(offer);
    }
    state.tradeOffers = tradeOffers;
  },
  [MutationTypes.SHOW_SELECTED_PLAYER] (state, player) {
    state.selectedPlayer = player;
    state.playerProfileVisible = true;
  },
  [MutationTypes.HIDE_PLAYER_TAB] (state) {
    state.playerProfileVisible = false;
    state.selectedPlayer = null;
  },
  [MutationTypes.SET_IS_MOBILE] (state, value) {
    state.isMobile = value;
  }
};

const actions: ActionTree<State, State> & Actions = {
  // #region DATA
  [ActionTypes.LoadAppData]({ dispatch }): void {
    dispatch(ActionTypes.GetActiveUser);
    dispatch(ActionTypes.GetAllUsers);
    dispatch(ActionTypes.GetAllFixtures);
    dispatch(ActionTypes.GetAllPlayers);
  },
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
  async [ActionTypes.GetUserLineup]({ commit, state, getters }): Promise<PlayerLineupEntry[]> {
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
  async [ActionTypes.GetWaiverReports]({ commit, state, getters}): Promise<WaiverReport[]> {
    if (state.waiverReports) {
      return state.waiverReports;
    } else {
      let reports = await GetWaiverReports();
      commit(MutationTypes.SET_WAIVER_REPORTS, reports);
      return reports;
    }
  },
  async [ActionTypes.GetTransferHistory]({ commit, state, getters}): Promise<Transfer[]> {
    if (state.transfers) {
      return state.transfers;
    } else {
      let transfers = await GetTransferHistory();
      commit(MutationTypes.SET_TRANSFERS, transfers);
      return transfers;
    }
  },
  async [ActionTypes.GetTradeOffers]({ commit, state, getters}): Promise<TradeOffer[]> {
    if (state.tradeOffers) {
      return state.tradeOffers;
    } else {
      let offers = await GetUserTradeOffers(state.user?.username ?? '');
      commit(MutationTypes.SET_TRADE_OFFERS, offers);
      return offers;
    }
  },
  async [ActionTypes.GetPlayerNews]({ commit, state, getters}): Promise<PlayerNews[]> {
    if (state.news) {
      return state.news;
    } else {
      let news = await GetPlayerNews(getters.activeRoundNumber);
      commit(MutationTypes.SET_NEWS, news);
      return news;
    }
  },
  // #endregion

  // #region UPDATES
  async [ActionTypes.SetLineup]({ commit, state, getters }, lineup: PlayerLineupEntry[]): Promise<boolean> {
    try {
      await SetLineup(GetIdToken(), lineup);
      commit(MutationTypes.SET_LINEUP, lineup);
      return true;
    } catch (err) {
      throw err;
    }
  },
  async [ActionTypes.ScoopPlayers]({ commit, state, getters }, players: Player[]): Promise<boolean> {
    try {
      await ScoopPlayers(getters.activeUserTeamShort, players);
      commit(MutationTypes.UPDATE_PLAYERS_XRL_TEAM, { players, team: getters.activeUserTeamShort });
      return true;
    } catch (err) {
      throw err;
    }
  },
  async [ActionTypes.DropPlayers]({ commit, state, getters }, players: Player[]): Promise<boolean> {
    try {
      await DropPlayers(getters.activeUserTeamShort, players);
      const newTeam = getters.activeRoundNumber === 1 ? 'None' : 'On Waivers';
      commit(MutationTypes.UPDATE_PLAYERS_XRL_TEAM, { players, team: newTeam });
      return true;
    } catch (err) {
      throw err;
    }
  },
  async [ActionTypes.UpdateUserWaiverPreferences]({ commit, state, getters }, { preferences }: { preferences: WaiverPreference[], provisionalDrop: string[] }): Promise<boolean> {
    try {
      if (!state.user) throw 'User data not found';
      await UpdateUserWaiverPreferences(state.user.username, preferences);
      commit(MutationTypes.UPDATE_WAIVER_PREFERENCES, { preferences });
      return true;
    } catch (err) {
      throw err;
    }
  },
  async [ActionTypes.SendTradeOffer]({ commit, state, getters}, offer: TradeOfferBuilder): Promise<boolean> {
    try {
      if (!offer.targetUser) throw 'No target team for offer';
      const offerRecord = await SendTradeOffer(offer.sendingUser.username, offer.targetUser?.username, offer.playersOffered.map(p => p.player_id), offer.playersWanted.map(p => p.player_id), offer.powerplaysOffered, offer.powerplaysOffered);
      commit(MutationTypes.UPSERT_TRADE_OFFER, { offer: offerRecord });
      return true;
    } catch (err) {
      throw err;
    }
  },
  async [ActionTypes.WithdrawTradeOffer]({ commit, state, getters}, offer: TradeOffer): Promise<boolean> {
    try {
      await WithdrawTradeOffer(offer.pk);
      const updatedOffer = { ...offer };
      updatedOffer.offer_status = 'Withdrawn';
      commit(MutationTypes.UPSERT_TRADE_OFFER, { offer: updatedOffer });
      return true;
    } catch (err) {
      throw err;
    }
  },
  async [ActionTypes.ProcessTradeOffer]({ commit, state, getters}, { offer, accepted = false }): Promise<boolean> {
    try {
      await ProcessTradeOffer(offer.pk, accepted);
      const updatedOffer = { ...offer };
      updatedOffer.offer_status = accepted ? 'Accepted' : 'Rejected';
      commit(MutationTypes.UPSERT_TRADE_OFFER, { offer: updatedOffer });
      return true;
    } catch (err) {
      throw err;
    }
  },
  // #endregion
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