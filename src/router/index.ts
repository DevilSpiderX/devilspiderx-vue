import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        name: "NotFound",
        path: "/:pathMatch(.*)*",
        component: () => import("@/components/error/NotFound.vue"),
        meta: { title: "Not Found - DevilSpiderX" }
    },
    {
        name: "welcome",
        path: "/",
        component: () => import("@/components/welcome/WelcomeRoute.vue")
    },
    {
        name: "login",
        path: "/login",
        component: () => import("@/components/login/LoginRoute.vue"),
        meta: { title: "登录 - DevilSpiderX" }
    },
    {
        name: "register",
        path: "/register",
        component: () => import("@/components/register/RegisterRoute.vue"),
        meta: { title: "注册 - DevilSpiderX" }
    },
    {
        name: "index",
        path: "/index",
        component: () => import("@/components/index/IndexRoute.vue"),
        meta: { title: "主页 - DevilSpiderX" }
    },
    {
        name: "controller",
        path: "/controller",
        component: () => import("@/components/controller/ControllerRoute.vue"),
        meta: { title: "控制中心 - DevilSpiderX" },
        props: (to: RouteLocationNormalized) => ({
            cd: to.query.cd ? Number(to.query.cd) : undefined
        })
    },
    {
        name: "query",
        path: "/query",
        component: () => import("@/components/query/QueryRoute.vue"),
        meta: { title: "查询 - DevilSpiderX" }
    },
    {
        name: "v2ray",
        path: "/v2ray",
        component: () => import("@/components/v2ray/V2rayRoute.vue"),
        meta: { title: "V2ray - DevilSpiderX" }
    },
    {
        name: "log",
        path: "/log",
        component: () => import("@/components/log/LogRoute.vue"),
        meta: { title: "日志 - DevilSpiderX" }
    },
    {
        name: "fjrc",
        path: "/fjrc",
        component: () => import("@/components/fjrc/Fjrc.vue"),
        meta: { title: "农商行试题 - DevilSpiderX" }
    },
    {
        name: "fjrc_topic",
        path: "/fjrc/:bank/:id",
        component: () => import("@/components/fjrc/FjrcTopicRoute.vue"),
        meta: { title: "农商行试题 - DevilSpiderX" },
        props: route => ({
            bank: route.params.bank,
            id: Number(route.params.id)
        })
    },
]

if (Object.hasOwn === undefined) {
    Object.hasOwn = (obj, p) => {
        return obj.hasOwnProperty(p);
    }
}

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

router.beforeEach(function (to, from, next) {
    const title = to.meta.title;
    if (title && typeof title === "string") {
        document.title = title;
    } else {
        document.title = "DevilSpiderX";
    }
    next();
})

export default router;