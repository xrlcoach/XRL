import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import {
  Dashboard,
  Login,
  Stats,
  Draw,
  Ladder,
  Lineup,
  Transfers,
  Squads,
  MatchCentre,
  Rules,
} from './pages';
import { GetIdToken } from './services/xrlApi';

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/', name: 'Home', component: Dashboard },
  { path: '/lineup', name: 'Lineup', component: Lineup },
  { 
    path: '/matchcentre',
    name: 'MatchCentre',
    component: MatchCentre,
    props: (route) => {
      return {
        roundNumber: route.query.round,
        fixture: route.query.fixture,
      }
    }
  },
  { path: '/draw', name: 'Draw', component: Draw },
  { path: '/ladder', name: 'Ladder', component: Ladder },
  { path: '/squads', name: 'Squads', component: Squads },
  { path: '/stats', name: 'Stats', component: Stats },
  { path: '/transfers', name: 'Transfers', component: Transfers },
  { path: '/rules', name: 'Rules', component: Rules },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !GetIdToken()) next({ name: 'Login' });
  else next();
});

export default router;
