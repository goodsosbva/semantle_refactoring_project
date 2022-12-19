import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import App1 from "./App1.vue";

import "./assets/css/style.css";
import "./assets/css/modern-normalize.min.css";

// Import Bootstrap and BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// createApp(App).mount("#app");
createApp(App1).use(router).mount("#app");
