import { XrlUser } from "../global";
import { store } from "../store";
import { MutationTypes } from "../vuexTypes";
import { GetData, SetData } from "./session";
import { GetActiveUserInfo, GetAllUsers } from "./xrlApi";

export async function GetUserInfo(): Promise<void> {
  if (!store.state.user) {
    const user = await GetActiveUserInfo();
    store.commit(MutationTypes.SET_ACTIVE_USER, user);
  }
  // const userFromStorage = GetData('activeUser')
  // if (userFromStorage) {
  //   return JSON.parse(userFromStorage) as XrlUser;
  // } 
  // const userInfoFromApi = await GetActiveUserInfo();
  // SetData('activeUser', JSON.stringify(userInfoFromApi));
  // return userInfoFromApi;
}

export async function GetAllUsersInfo(): Promise<void> {
  if (!store.state.allUsers) {
    const users = await GetAllUsers();
    store.commit(MutationTypes.SET_ALL_USERS, users);
  }
}

export async function GetAllUserInfoSorted(): Promise<XrlUser[]> {
  const dataFromStorage = GetData('allUsers');
  if (dataFromStorage) {
    return SortLeageTable(JSON.parse(dataFromStorage)) as XrlUser[];
  }
  const dataFromApi = await GetAllUsers();
  SetData('allUsers', JSON.stringify(dataFromApi));
  return SortLeageTable(dataFromApi);
}

export async function GetUserInfoByTeamShort(teamShort: string): Promise<XrlUser> {
  const allUsers = await GetAllUserInfoSorted();
  const user = allUsers.find(u => u.team_short === teamShort);
  if (!user) throw "Couldn't find user info";
  return user;
}

export function SortLeageTable(users: XrlUser[]): XrlUser[] {
  const usersSorted = Array.from(users);
  usersSorted.sort(function(u1, u2) {
      if (u2.stats.points != u1.stats.points) {
          return u2.stats.points - u1.stats.points;
      } if ((u2.stats.for - u2.stats.against) != (u1.stats.for - u1.stats.against)) {
          return (u2.stats.for - u2.stats.against) - (u1.stats.for - u1.stats.against);
      }
      return u2.stats.for - u1.stats.for;
  });
  return usersSorted;
}