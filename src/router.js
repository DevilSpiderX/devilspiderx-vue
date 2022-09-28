import {createRouter, createWebHashHistory} from "vue-router";
import welcome from "@/components/welcome";
import login from '@/components/login';
import register from '@/components/register';
import index from '@/components/index';
import controller from "@/components/controller";
import query from "@/components/query";
import v2ray from "@/components/v2ray";
import log from "@/components/log";
import updatePwd from "@/components/updatePwd";

const routes = [
    {name: "welcome", path: "/", component: welcome},
    {name: "login", path: "/login", component: login, meta: {title: "登录 - DevilSpiderX"}},
    {name: "register", path: "/register", component: register, meta: {title: "注册 - DevilSpiderX"}},
    {name: "index", path: "/index", component: index, meta: {title: "主页 - DevilSpiderX"}},
    {name: "controller", path: "/controller", component: controller, meta: {title: "控制中心 - DevilSpiderX"}},
    {name: "query", path: "/query", component: query, meta: {title: "查询 - DevilSpiderX"}},
    {name: "v2ray", path: "/v2ray", component: v2ray, meta: {title: "V2ray - DevilSpiderX"}},
    {name: "log", path: "/log", component: log, meta: {title: "日志 - DevilSpiderX"}},
    {name: "updatePwd", path: "/updatePwd", component: updatePwd, meta: {title: "修改密码 - DevilSpiderX"}}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});

router.beforeEach(function (to, from, next) {
    if (to.meta.hasOwnProperty("title")) {
        document.title = to.meta.title;
    } else {
        document.title = "DevilSpiderX";
    }
    next();
})

export default router;