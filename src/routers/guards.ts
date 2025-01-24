import { useUserStore } from "@/stores/UserStore.ts";
import { isString } from "@/utils/validate.ts";
import type { RouteLocationNormalizedGeneric } from "vue-router";
import router from "./index.ts";

function checkUserStatus(to: RouteLocationNormalizedGeneric) {
    if (to.name === "welcome" || to.name === "login") {
        return;
    }

    const userStore = useUserStore();
    if (userStore.login) {
        return;
    }

    userStore.checkUserStatus();
}

router.beforeEach(function (to, from) {
    const title = to.meta.title;
    if (isString(title)) {
        document.title = `${title} - DevilSpiderX`;
    } else {
        document.title = "DevilSpiderX";
    }

    checkUserStatus(to);
});
