import App from "@/App.vue";
import "@/guards";
import logger from "@/plugins/logger";
import router from "@/router";
import pinia from "@/store";
import "@/styles";
import { createApp } from "vue";

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(logger);

app.mount("#app");
