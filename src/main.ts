import App from "@/App.vue";
import eventBus from "@/plugins/eventBus.ts";
import logger from "@/plugins/logger.ts";
import "@/routers/guards.ts";
import router from "@/routers/index.ts";
import pinia from "@/stores/index.ts";
import "@/styles/index.ts";
import { createApp } from "vue";

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(logger);
app.use(eventBus);

app.mount("#app");
