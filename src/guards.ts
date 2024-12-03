import type { RouteLocationNormalizedGeneric } from "vue-router";
import router from "./router";
import { useUserStore } from "./store/UserStore";
import { isString } from "./util/validate";

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
