import { eventBus } from "@/plugins/eventBus.ts";
import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        name: "NotFound",
        path: "/:pathMatch(.*)*",
        component: () => import("@/views/error/NotFound.vue"),
        meta: { title: "Not Found" },
    },
    {
        name: "welcome",
        path: "/",
        component: () => import("@/views/welcome/WelcomeRoute.vue"),
    },
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/login/LoginRoute.vue"),
        meta: { title: "登录" },
        props: to => ({
            from: to.query.from,
        }),
    },
    {
        name: "register",
        path: "/register",
        component: () => import("@/views/register/RegisterRoute.vue"),
        meta: { title: "注册" },
    },
    {
        name: "index",
        path: "/index",
        component: () => import("@/views/index/IndexRoute.vue"),
        meta: { title: "主页" },
    },
    {
        name: "controller",
        path: "/controller",
        component: () => import("@/views/controller/ControllerRoute.vue"),
        meta: { title: "控制中心" },
        props: (to: RouteLocationNormalized) => ({
            cd: to.query.cd ? Number(to.query.cd) : undefined,
        }),
    },
    {
        name: "query",
        path: "/query",
        component: () => import("@/views/query/QueryRoute.vue"),
        meta: { title: "查询" },
    },
    {
        name: "v2ray",
        path: "/v2ray",
        component: () => import("@/views/v2ray/V2rayRoute.vue"),
        meta: { title: "V2ray" },
    },
    {
        name: "log",
        path: "/log",
        component: () => import("@/views/log/LogRoute.vue"),
        meta: { title: "日志" },
    },
    {
        name: "fjrc",
        path: "/fjrc",
        component: () => import("@/views/fjrc/Fjrc.vue"),
        meta: { title: "农商行试题" },
        children: [
            {
                name: "fjrc_index",
                path: "",
                component: () => import("@/views/fjrc/FjrcIndex.vue"),
            },
            {
                name: "fjrc_topic",
                path: ":bank/:id",
                component: () => import("@/views/fjrc/FjrcTopicRoute.vue"),
                props: route => ({
                    bank: route.params.bank,
                    id: Number(route.params.id),
                }),
            },
        ],
    },
    {
        name: "fjrc_fee_calculator",
        path: "/fjrc/fee_calculator",
        component: () => import("@/views/fjrc/FeeCalculator.vue"),
        meta: { title: "转账手续费计算器" },
    },
    {
        name: "ANi",
        path: "/ani",
        component: () => import("@/views/ANi/AniRoute.vue"),
        meta: { title: "ANi番剧更新" },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;

export function toLogin() {
    const route = router.currentRoute.value;
    if (route.name !== "login") {
        const from = encodeURIComponent(route.fullPath);
        router.push({
            name: "login",
            query: { from },
        });
    }
}

eventBus.on("InvalidToken", () => {
    toLogin();
});
