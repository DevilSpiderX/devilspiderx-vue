import { defineStore } from "pinia";
import { ref } from "vue";

export const useWelcomePageStore = defineStore(
    "welcomePageStore",
    () => {
        const state = ref(false);

        return {
            state,
        };
    },
    {
        persist: {
            storage: sessionStorage,
            pick: ["state"],
        },
    },
);
