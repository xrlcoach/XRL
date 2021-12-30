import { store } from '../store';
import { MutationTypes } from '../vuexTypes';
import { SetData } from './session';
import { GetActiveUserInfo, GetCurrentRoundInfo, GetCurrentRoundStatus, Login } from './xrlApi';

export async function LoginUser(username: string, password: string) {
  //Login user and get ID token
  const idToken = await Login(username, password);
  let expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  //Set id cookie
  document.cookie = `id=${idToken}; expiry=${expiry.toUTCString()}; Secure`;
  await LoadSessionData();
}

export function LogoutUser() {
  document.cookie = 'id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'round=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'team=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  sessionStorage.clear();
  store.commit(MutationTypes.CLEAR_SESSION_DATA);
}

export async function LoadSessionData() {
  let expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  //Get round info and set cookie
  const roundInfo = await GetCurrentRoundInfo();
  SetData('currentRound', JSON.stringify(roundInfo));
  document.cookie = `round=${
    roundInfo?.round_number
  }; expires=${expiry.toUTCString()}; Secure`;
  //Get user's data and set team acronym as team cookie
  const userInfo = await GetActiveUserInfo();
  SetData('activeUser', JSON.stringify(userInfo));
  document.cookie = `team=${
    userInfo.team_short
  }; expires=${expiry.toUTCString()}; Secure`;
  // Save in Vuex Store
  store.commit(MutationTypes.SET_ACTIVE_USER, userInfo);
  if (roundInfo) {
    store.commit(MutationTypes.SET_CURRENT_ROUND, roundInfo);
  }
}
