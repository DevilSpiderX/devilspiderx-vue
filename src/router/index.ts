import WelcomeRoute from "@/components/welcome/WelcomeRoute.vue";
import { createRouter, createWebHistory, RouteLocationNormalized, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        name: "NotFound",
        path: "/:pathMatch(.*)*",
        component: () => import("@/components/error/NotFound.vue"),
        meta: { title: "Not Found" },
    },
    {
        name: "welcome",
        path: "/",
        component: WelcomeRoute,
    },
    {
        name: "login",
        path: "/login",
        component: () => import("@/components/login/LoginRoute.vue"),
        meta: { title: "登录" },
        props: to => ({
            from: to.query.from,
        }),
    },
    {
        name: "register",
        path: "/register",
        component: () => import("@/components/register/RegisterRoute.vue"),
        meta: { title: "注册" },
    },
    {
        name: "index",
        path: "/index",
        component: () => import("@/components/index/IndexRoute.vue"),
        meta: { title: "主页" },
    },
    {
        name: "controller",
        path: "/controller",
        component: () => import("@/components/controller/ControllerRoute.vue"),
        meta: { title: "控制中心" },
        props: (to: RouteLocationNormalized) => ({
            cd: to.query.cd ? Number(to.query.cd) : undefined,
        }),
    },
    {
        name: "query",
        path: "/query",
        component: () => import("@/components/query/QueryRoute.vue"),
        meta: { title: "查询" },
    },
    {
        name: "v2ray",
        path: "/v2ray",
        component: () => import("@/components/v2ray/V2rayRoute.vue"),
        meta: { title: "V2ray" },
    },
    {
        name: "log",
        path: "/log",
        component: () => import("@/components/log/LogRoute.vue"),
        meta: { title: "日志" },
    },
    {
        name: "fjrc",
        path: "/fjrc",
        component: () => import("@/components/fjrc/Fjrc.vue"),
        meta: { title: "农商行试题" },
        children: [
            {
                name: "fjrc_index",
                path: "",
                component: () => import("@/components/fjrc/FjrcIndex.vue"),
            },
            {
                name: "fjrc_topic",
                path: ":bank/:id",
                component: () => import("@/components/fjrc/FjrcTopicRoute.vue"),
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
        component: () => import("@/components/fjrc/FeeCalculator.vue"),
        meta: { title: "转账手续费计算器" },
    },
    {
        name: "ANi",
        path: "/ani",
        component: () => import("@/components/ANi/AniRoute.vue"),
        meta: { title: "ANi番剧更新" },
    },
];

if (Object.hasOwn === undefined) {
    Object.hasOwn = (obj, p) => {
        return obj.hasOwnProperty(p);
    };
}

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

export default router;
