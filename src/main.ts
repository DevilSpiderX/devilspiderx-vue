import App from "@/App.vue";
import "@/routers/guards.ts";
import "@/styles/index.ts";
import { createApp } from "vue";
import { initApp } from "@/initApp.ts";

const app = createApp(App);
initApp(app);

app.mount("#app");
