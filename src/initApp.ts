import type { App } from "vue";
import eventBus from "@/plugins/eventBus.ts";
import router from "@/routers";
import pinia from "@/stores";
import logger from "@/plugins/logger.ts";

export function initApp(app:App<Element>){
    app.use(router);
    app.use(pinia);
    app.use(logger);
    app.use(eventBus);
}