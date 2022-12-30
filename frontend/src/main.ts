import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

import "./assets/css/style.css";
import "./assets/css/modern-normalize.min.css";

createApp(App).use(router).mount("#app");

