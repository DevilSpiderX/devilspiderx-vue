import { defineStore } from "pinia";
import { ref } from "vue";

export const useControllerStore = defineStore(
    "controllerStore",
    () => {
        const networkSelection = ref("");

        return {
            networkSelection,
        };
    },
    {
        persist: {
            storage: localStorage,
            pick: ["networkSelection"],
        },
    },
);
