import { createWebHistory, createRouter } from "vue-router";
import Words from "@/views/words.vue";
import Main from "@/views/Main.vue";

const routes = [
  {
    path: "/",
    name: "Main Page",
    component: Main,
  },
  {
    path: "/words",
    name: "words 1000",
    component: Words,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
