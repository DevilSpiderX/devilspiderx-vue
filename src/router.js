import {createRouter, createWebHashHistory} from "vue-router";
import WelcomeRoute from "@/components/WelcomeRoute";
import LoginRoute from '@/components/LoginRoute';
import RegisterRoute from '@/components/RegisterRoute';
import IndexRoute from '@/components/IndexRoute';
import ControllerRoute from "@/components/ControllerRoute";
import QueryRoute from "@/components/QueryRoute";
import V2rayRoute from "@/components/V2rayRoute";
import LogRoute from "@/components/LogRoute";
import UpdatePwdRoute from "@/components/UpdatePwdRoute";

const routes = [
    {name: "welcome", path: "/", component: WelcomeRoute},
    {name: "login", path: "/login", component: LoginRoute, meta: {title: "登录 - DevilSpiderX"}},
    {name: "register", path: "/register", component: RegisterRoute, meta: {title: "注册 - DevilSpiderX"}},
    {name: "index", path: "/index", component: IndexRoute, meta: {title: "主页 - DevilSpiderX"}},
    {name: "controller", path: "/controller", component: ControllerRoute, meta: {title: "控制中心 - DevilSpiderX"}},
    {name: "query", path: "/query", component: QueryRoute, meta: {title: "查询 - DevilSpiderX"}},
    {name: "v2ray", path: "/v2ray", component: V2rayRoute, meta: {title: "V2ray - DevilSpiderX"}},
    {name: "log", path: "/log", component: LogRoute, meta: {title: "日志 - DevilSpiderX"}},
    {name: "updatePwd", path: "/updatePwd", component: UpdatePwdRoute, meta: {title: "修改密码 - DevilSpiderX"}}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});

router.beforeEach(function (to, from, next) {
    document.body.setAttribute("data-route", to.path);
    if (Object.hasOwn(to.meta, "title")) {
        document.title = String(to.meta["title"]);
    } else {
        document.title = "DevilSpiderX";
    }
    next();
})

export default router;