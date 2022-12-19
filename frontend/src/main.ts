import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

import "./assets/css/style.css";
import "./assets/css/modern-normalize.min.css";

// Import Bootstrap and BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// createApp(App).mount("#app");
createApp(App).use(router).mount("#app");
