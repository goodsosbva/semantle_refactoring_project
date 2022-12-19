import { createWebHistory, createRouter } from "vue-router";
import Words from "../components/Words.vue";
import Home from "../App.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
