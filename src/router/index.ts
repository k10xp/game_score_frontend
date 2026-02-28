import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import ResultsView from '@/views/GameResults.vue';
import CreateView from '@/components/ui/Create.vue';
import LoginView from '@/components/ui/Login.vue';
import RegisterView from '@/components/ui/Register.vue';
import LogoutView from '@/components/ui/Logout.vue';
import { authenticated } from '@/data/auth';
import PublicLeagueView from '@/views/PublicLeague.vue';

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
  { path: '/create', redirect: '/results/create' },
  {
    path: '/public-league',
    name: 'PublicLeague',
    component: PublicLeagueView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
