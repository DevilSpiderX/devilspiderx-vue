import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        name: "NotFound",
        path: "/:pathMatch(.*)*",
        component: () => import("@/views/error/NotFound.vue"),
        meta: { title: "Not Found" },
    },
    {
        name: "login",
        path: "/login",
        component: () => import("@/views/login/LoginPage.vue"),
        meta: { title: "登录" },
        props: to => {
            const from = decodeURIComponent(to.query.from as string);
            return {
                from,
            };
        },
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
