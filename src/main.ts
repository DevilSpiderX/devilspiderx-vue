import App from "@/App.vue";
import logger from "@/plugins/logger.ts";
import "@/router/guards.ts";
import router from "@/router/index.ts";
import pinia from "@/store/index.ts";
import "@/styles/index.ts";
import { createApp } from "vue";

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(logger);

app.mount("#app");
