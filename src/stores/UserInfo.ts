import { loginApi, statusApi } from "@/api/user";
import { BaseException } from "@/error/baseException";
import { eventBus } from "@/plugins/eventBus";
import { getLogger } from "@/plugins/logger";
import { isDefined } from "@/utils/validate";
import { ElMessage } from "element-plus";
import lodash from "lodash";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type { UserInfo } from "./types/UserInfo";

const logger = getLogger(import.meta.filePath);

const defaultInfo: UserInfo = {
    uid: "-1",
    login: false,
    admin: false,
    roles: [],
    permissions: [],
} as const;

export const useUserInfoStore = defineStore(
    "userInfoStore",
    () => {
        const uid = ref<string>();
        const token = ref<string>();

        async function login(username: string, password: string) {
            const resp = await loginApi(username, password);
            uid.value = resp.uid;
            token.value = resp.token;
            info.value.lastLoginAddr = resp.lastLoginAddr;
        }

        const tokenExport = {
            uid,
            token,
            login,
        };

        const info = ref<UserInfo>(lodash.cloneDeep(defaultInfo));

        async function getInfo() {
            try {
                const resp = await statusApi();
                Object.assign(info.value, resp);
            } catch (error) {
                logger.error("获取用户信息失败", error);
                if (error instanceof BaseException) {
                    ElMessage.error(error.message);
                }
            }
        }

        watch(token, async value => {
            if (isDefined(value)) {
                await getInfo();
            } else {
                info.value = lodash.cloneDeep(defaultInfo);
            }
        });

        const infoExport = {
            info,
            getInfo,
        };

        const checkRegexList = computed(() => {
            const result: RegExp[] = [];
            for (const item of info.value.permissions) {
                const _item = item.replaceAll(".", "\\.").replaceAll("*", ".+");
                result.push(new RegExp(`^${_item}$`));
            }
            return result;
        });

        function checkPermission(checkList: string[]) {
            return checkList.every(item => checkRegexList.value.some(regex => regex.test(item)));
        }

        function checkPermissionOr(checkList: string[]) {
            return checkList.some(item => checkRegexList.value.some(regex => regex.test(item)));
        }

        function $reset() {
            uid.value = undefined;
            token.value = undefined;
            info.value = lodash.cloneDeep(defaultInfo);
        }

        return {
            ...tokenExport,
            ...infoExport,
            checkPermission,
            checkPermissionOr,
            $reset,
        };
    },
    {
        persist: [
            {
                storage: localStorage,
                pick: ["uid", "token"],
            },
            {
                storage: sessionStorage,
                pick: ["info"],
            },
        ],
    },
);

eventBus.on("InvalidToken", () => {
    const userInfoStore = useUserInfoStore();
    userInfoStore.$reset();
});
