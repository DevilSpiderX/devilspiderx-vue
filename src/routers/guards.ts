import { eventBus } from "@/plugins/eventBus.ts";
import { useUserInfoStore } from "@/stores/UserInfo.ts";
import { isBlank } from "@/utils/validate.ts";
import type { RouteLocationNormalizedGeneric } from "vue-router";
import router, { toLogin } from "./index.ts";

const whiteUrlList: string[] = ["/", "/login"];

async function checkUserStatus(to: RouteLocationNormalizedGeneric) {
    if (whiteUrlList.includes(to.path)) {
        return true;
    }

    const userInfoStore = useUserInfoStore();
    if (userInfoStore.info.login) {
        return true;
    }

    await userInfoStore.getInfo();
    if (userInfoStore.info.login) {
        return true;
    }
    toLogin();
}

function setTitle(title?: string) {
    if (isBlank(title)) {
        document.title = "DevilSpiderX";
        return;
    }
    document.title = `${title} - DevilSpiderX`;
}

router.beforeEach(async function (to, from) {
    setTitle(to.meta.title);

    return await checkUserStatus(to);
});

eventBus.on("InvalidToken", () => {
    toLogin();
});
