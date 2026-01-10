import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import HomeView from "../views/Home.vue";
import ResultsView from "../views/GameResults.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    props: { msg: "Hello, World!" },
  },
  { path: "/results", name: "Results", component: ResultsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
