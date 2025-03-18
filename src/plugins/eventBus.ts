import { EventBus } from "@/libs/eventBus/eventBus.ts";
import { getLogger } from "@/plugins/logger.ts";
import type { App } from "vue";

const logger = getLogger(import.meta.filePath);

export const eventBus = new EventBus((error, event) => {
    logger.set(import.meta.codeLineNum).error(`Event(${event}) listener execution error`, error);
});

export default {
    install(app: App) {
        app.config.globalProperties.$eventBus = eventBus;
    },
};

declare module "vue" {
    interface ComponentCustomProperties {
        $eventBus: EventBus;
    }
}
