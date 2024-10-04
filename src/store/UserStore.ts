import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
    "userStore",
    () => {
        //setup

        const uid = ref<string>();
        const admin = ref<boolean>(false);
        const login = ref<boolean>(false);
        const checkIntervalTime = ref<number>(600 * 1000); //ms
        const avatar = ref<string>();
        const permissions = ref<string[]>([]);

        return {
            uid,
            admin,
            login,
            checkIntervalTime,
            avatar,
            permissions,
        };
    },
    {
        persist: {
            storage: localStorage,
            paths: ["uid"],
        },
    },
);
