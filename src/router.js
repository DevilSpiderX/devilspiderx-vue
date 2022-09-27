import {createRouter, createWebHashHistory} from "vue-router";
import login from './components/login';

const routes = [
    {path: "/login", component: login, meta: {title: "登录 - DevilSpiderX"}}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
});

router.beforeEach(function (to, from, next) {
    if (to.meta.title) {
        document.title = to.meta.title;
    } else {
        document.title = "DevilSpiderX";
    }
    next();
})

export default router;