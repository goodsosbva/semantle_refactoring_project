import { createWebHistory, createRouter } from "vue-router";
import Words from "../views/Words.vue";
import Home from "../views/Home.vue";

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
    // 바꾼곳
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
