import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import ResultsView from '../views/GameResults.vue';
import CreateView from '../views/Create.vue';
import LoginView from '../views/Login.vue';
import RegisterView from '../views/Register.vue';
import LogoutView from '../views/Logout.vue';
import { authenticated, currentUser } from '@/data/auth';
import PublicLeagueView from '../views/PublicLeague.vue';
import AdminView from '../views/AdminView.vue';
import StatisticsView from '@/views/StatisticsView.vue';

/*
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: LoginView,
    beforeEnter: (_to, _from, next) => {
      if (authenticated.value) {
        next('/results');
      } else {
        next();
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: (_to, _from, next) => {
      if (authenticated.value) {
        next('/results');
      } else {
        next();
      }
    },
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    beforeEnter: (_to, _from, next) => {
      if (authenticated.value) {
        next('/results');
      } else {
        next();
      }
    },
  },
  {
    path: '/results',
    name: 'Results',
    component: ResultsView,
    beforeEnter: (_to, _from, next) => {
      if (authenticated.value) {
        next();
      } else {
        next('/login');
      }
    },
    children: [
      {
        path: 'create',
        name: 'Create',
        component: CreateView,
      },
    ],
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsView,
    beforeEnter: (_to, _from, next) => {
      if (!authenticated.value) {
        next('/login'); 
      } else {
        next(); 
      }
    },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsView,
    beforeEnter: () => !authenticated.value ? '/login' : true,
  },
  { path: '/create', redirect: '/results/create' },
  {
    path: '/public-league',
    name: 'PublicLeague',
    component: PublicLeagueView,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    beforeEnter: (_to, _from, next) => {
      if (!authenticated.value) {
        next('/login');
        return;
      }

      if (currentUser.value?.role !== 'admin') {
        next('/results');
        return;
      }

      next();
    },
  },
];
*/
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Root',
    component: LoginView,
    beforeEnter: () => authenticated.value ? '/results' : true,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    beforeEnter: () => authenticated.value ? '/results' : true,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: LogoutView,
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    beforeEnter: () => authenticated.value ? '/results' : true,
  },
  {
    path: '/results',
    name: 'Results',
    component: ResultsView,
    beforeEnter: () => !authenticated.value ? '/login' : true,
    children: [
      {
        path: 'create',
        name: 'Create',
        component: CreateView,
      },
    ],
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsView,
    beforeEnter: () => !authenticated.value ? '/login' : true,
  },
  { path: '/create', redirect: '/results/create' },
  {
    path: '/public-league',
    name: 'PublicLeague',
    component: PublicLeagueView,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    beforeEnter: () => {
      if (!authenticated.value) return '/login';
      if (currentUser.value?.role !== 'admin') return '/results';
      return true;
    },
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
