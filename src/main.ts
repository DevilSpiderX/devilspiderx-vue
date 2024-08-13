import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./store";
import "./style.css";
import "./styles/box-shadow.css";

const app = createApp(App);
app.use(router).use(pinia).mount("#app");

if (import.meta.env.DEV) {
    import("./styles/style-dev.css");
} else {
    import("./styles/style-pro.css");
}
