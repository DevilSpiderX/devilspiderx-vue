import { status as statusApi } from "@/api/user-api";
import { getLogger } from "@/plugins/logger";
import { isDefined } from "@/util/validate";
import { defineStore } from "pinia";
import { ref } from "vue";

const logger = getLogger(import.meta.filePath);

export const useUserStore = defineStore(
    "userStore",
    () => {
        //setup

        const uid = ref<string>();
        const admin = ref<boolean>(false);
        const login = ref<boolean>(false);
        const permissions = ref<string[]>([]);
        const avatar = ref<string>();

        async function checkUserStatus() {
            try {
                const resp = await statusApi();
                logger.set(import.meta.codeLineNum).info("user_status:", resp);
                if (isDefined(resp.uid)) {
                    uid.value = resp.uid;
                }
                admin.value = resp.admin;
                login.value = resp.login;
                permissions.value = resp.permissions;
            } catch (ignored) {
                admin.value = false;
                login.value = false;
            }
        }

        return {
            uid,
            admin,
            login,
            permissions,
            avatar,
            checkUserStatus,
        };
    },
    {
        persist: {
            storage: localStorage,
            pick: ["uid"],
        },
    },
);
