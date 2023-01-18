import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { createPinia } from "pinia";

import "./assets/css/style.css";
import "./assets/css/modern-normalize.min.css";

const pinia = createPinia();

createApp(App).use(pinia).use(router).mount("#app");
