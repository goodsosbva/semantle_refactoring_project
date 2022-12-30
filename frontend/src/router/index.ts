import { createWebHistory, createRouter } from "vue-router";
import Words from "../views/Words.vue";
import Home from "../views/Home.vue";
import TodayWords from "../views/TodayWords.vue";

const routes = [
  {
    path: "/",
    name: "index",
    component: Home,
  },
  {
    path: "/nearest1k",
    name: "nearest1k",
    component: Words,
  },
  {
    path: "/nearest1kNow",
    name: "nearest1kNow",
    component: TodayWords,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
