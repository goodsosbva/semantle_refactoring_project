import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Nearest from "../views/Nearest.vue";
import page404 from "../views/page404.vue";

// TODO: 404 or fallback check ready
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
  { path: "/:pathMatch(.*)*", component: page404 },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
