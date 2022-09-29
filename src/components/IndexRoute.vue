<template>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <!-- 导航栏LOGO -->
        <a class="navbar-brand font-weight-bold">DevilSpiderX</a>
    </nav>

    <!-- 主体 -->
    <div class="container">
        <div class="row justify-content-center" style="margin-top: 10px">
            <router-link class="btn btn-outline-dark my-button col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 shadow"
                         to="/controller" @contextmenu.prevent.stop>
                <i class="fas fa-sliders-h fa-fw"></i>
                控制中心
            </router-link>
            <router-link class="btn btn-outline-dark my-button col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 shadow"
                         to="/query" @contextmenu.prevent.stop>
                <i class="fas fa-search fa-fw"></i>
                查&nbsp;&nbsp;询
            </router-link>
            <router-link class="btn btn-outline-dark my-button col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 shadow"
                         to="/v2ray" @contextmenu.prevent.stop>
                <!--suppress CheckImageSize -->
                <img src="@/assets/v2rayN.png" alt="v2ray" width="27" height="27">
                V2Ray
            </router-link>
            <router-link class="btn btn-outline-dark my-button col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 shadow"
                         to="/log" @contextmenu.prevent.stop>
                <i class="fas fa-file-alt fa-fw"></i>
                日&nbsp;&nbsp;志
            </router-link>
            <router-link class="btn btn-outline-dark my-button col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 shadow"
                         to="/updatePwd" @contextmenu.prevent.stop>
                <i class="fas fa-edit fa-fw"></i>
                修改密码
            </router-link>
            <button class="btn btn-outline-dark my-button col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 shadow"
                    @click="on_logoutButton_clicked" @contextmenu.prevent.stop>
                <i class="fas fa-sign-out-alt fa-fw"></i>
                退出登录
            </button>
            <button class="btn btn-danger my-button col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7 shadow"
                    @click="on_exit_clicked" @contextmenu.prevent.stop>
                <i class="fas fa-power-off fa-fw"></i>
                退&nbsp;&nbsp;出
            </button>
        </div>
    </div>
</template>

<script>
import {setThemeColor} from "@/js/global";
import {logout} from "@/js/server-api";
import router from "@/router";

export default {
    name: "IndexRoute",
    methods: {
        on_logoutButton_clicked() {
            logout(function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        sessionStorage.setItem("user_status", "0");
                        break;
                    }
                    case 1: {
                        alert("您还未登录过");
                        break;
                    }
                }
                router.push({name: "login"});
            });
        },
        on_exit_clicked() {
            window.open("about:blank", "_self").close();
        }
    },
    beforeMount() {
        setThemeColor("#343A40");
    },
    mounted() {
    }
}
</script>

<style scoped>
@media (max-width: 768px) {
    .navbar {
        justify-content: center;
    }
}

.my-button {
    padding: 0.7rem 1.2rem;
    font-size: 1.5rem;
    line-height: 1.5;
    border-radius: 0.4rem;
    margin: 12px;
    background-color: #f8f9fa;
    border-color: white;
}

.my-button:hover {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40;
}

.my-button:last-child {
    background-color: #dc3545;
    border-color: #dc3545;
}

.my-button:last-child:hover {
    background-color: #c82333;
    border-color: #c82333;
}

.my-button:last-child:focus {
    background-color: #c82333;
    border-color: #c82333;
}

.my-button:hover img {
    filter: invert(100%);
}
</style>