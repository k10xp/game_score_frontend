import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';

import HomeView from '../views/Home.vue';
import ResultsView from '../views/GameResults.vue';
import CreateView from '../views/Create.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/results',
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    props: {
      welcomeText: 'Hello, World!',
      descriptionText: 'Create and view game scores',
    },
  },
  {
    path: '/results',
    name: 'Results',
    component: ResultsView,
    children: [
      {
        path: 'create',
        name: 'Create',
        component: CreateView,
      },
    ],
  },
  { path: '/create', redirect: '/results/create' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
