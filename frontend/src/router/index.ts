import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Nearest from "../views/Nearest.vue";

// TODO: 404 or fallback
const routes = [
  {
    path: "/",
    name: "index",
    component: Home,
  },
  {
    path: "/nearest1k/:puzzle_number_input",
    name: "nearest1k",
    component: Nearest,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

