import { status as statusApi } from "@/api/user-api";
import { eventBus } from "@/plugins/eventBus.ts";
import { getLogger } from "@/plugins/logger";
import { isDefined } from "@/utils/validate";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const logger = getLogger(import.meta.filePath);

export const useUserStore = defineStore(
    "userStore",
    () => {
        const uid = ref<string>();
        const token = ref<string>();
        const admin = ref<boolean>(false);
        const login = ref<boolean>(false);
        const roles = ref<string[]>([]);
        const permissions = ref<string[]>([]);
        const avatar = ref<string>();
        const lastLoginAddr = ref<string>();

        async function checkUserStatus() {
            try {
                const resp = await statusApi();
                logger.set(import.meta.codeLineNum).info("user_status:", resp);
                if (isDefined(resp.uid)) {
                    uid.value = resp.uid;
                }
                admin.value = resp.admin;
                login.value = resp.login;
                roles.value = resp.roles;
                permissions.value = resp.permissions;
            } catch (ignored) {
                admin.value = false;
                login.value = false;
            }
        }

        const checkRegexList = computed(() => {
            const result: RegExp[] = [];
            for (const item of permissions.value) {
                const _item = item.replaceAll(".", "\\.").replaceAll("*", ".+");
                result.push(new RegExp(`^${_item}$`));
            }
            return result;
        });

        function checkPermission(checkList: string[]) {
            return checkList.every(item => checkRegexList.value.some(regex => regex.test(item)));
        }

        function $reset() {
            token.value = undefined;
            admin.value = false;
            login.value = false;
            roles.value = [];
            permissions.value = [];
            avatar.value = undefined;
            lastLoginAddr.value = undefined;
        }

        return {
            uid,
            token,
            admin,
            login,
            roles,
            permissions,
            avatar,
            lastLoginAddr,
            checkUserStatus,
            checkPermission,
            $reset,
        };
    },
    {
        persist: {
            storage: localStorage,
            pick: ["uid", "token", "roles", "permissions", "avatar"],
        },
    },
);

eventBus.on("InvalidToken", () => {
    const userStore = useUserStore();
    userStore.$reset();
});
