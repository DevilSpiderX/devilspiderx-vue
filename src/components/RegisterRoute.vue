<template>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <a href="javascript:void(0)" @click="this.$router.back()" class="nav-back-button">
            <i class="fas fa-arrow-left" style="font-size: 1.2rem;"></i>
        </a>
        <!-- 导航栏LOGO -->
        <a class="navbar-brand font-weight-bold">DevilSpiderX</a>

        <!-- 自适应弹出按钮 -->
        <button class="navbar-toggler" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 导航栏菜单 -->
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
                <li class="nav-item"></li>
            </ul>
        </div>
    </nav>

    <!-- 主体 -->
    <div class="container">
        <div class="row justify-content-center">
            <div id="center-fa" class="col-sm-10 col-md-7 col-lg-5">
                <form @submit.prevent="form_submit">
                    <h1 class="text-center">注&nbsp;&nbsp;册</h1>
                    <div class="input-group shadow">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-user fa-fw"></i></span>
                        </div>
                        <input class="form-control" type="text" placeholder="账号"
                               ref="user" v-model="form.uid">
                    </div>
                    <div class="input-group shadow">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-key fa-fw"></i></span>
                        </div>
                        <input class="form-control" type="password" placeholder="密码"
                               ref="password" v-model="form.pwd">
                    </div>
                    <div class="input-group shadow">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-key fa-fw"></i></span>
                        </div>
                        <input class="form-control" type="password" placeholder="再次输入密码"
                               ref="password_again" v-model="form.pwd_a">
                    </div>
                    <div class="row justify-content-around">
                        <button type="submit" class="btn btn-success btn-lg shadow">
                            注 册
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {setThemeColor} from "@/js/global";
import {register} from "@/js/server-api";
import router from "@/router";

export default {
    name: "RegisterRoute",
    data() {
        return {
            form: {
                uid: "",
                pwd: "",
                pwd_a: ""
            }
        }
    },
    methods: {
        form_submit() {
            let uid = this.form.uid;
            let pwd = this.form.pwd;
            let pwd_a = this.form.pwd_a;
            if (uid === "") {
                this.$refs.user.focus();
                return;
            }
            if (pwd === "") {
                this.$refs.password.focus();
                return;
            }
            if (pwd_a === "") {
                this.$refs.password_again.focus();
                return;
            }
            if (pwd !== pwd_a) {
                alert("两次输入的密码不相同");
                return;
            }
            register(uid, pwd, function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        router.push({name: "login"});
                        break;
                    }
                    case 1: {
                        alert("注册失败");
                        break;
                    }
                    case 4: {
                        alert("用户名已存在，请换一个用户名");
                        break;
                    }
                }
            });
        }
    },
    beforeMount() {
        setThemeColor("#343A40");
    }
}
</script>

<style scoped src="../css/nav-back-button.css"></style>

<style scoped>
div#center-fa {
    border: #6c757d 5px solid;
    border-radius: 2ex;
    margin-top: 100px;
}

form > h1,
form > div {
    margin: 10px 0;
}

form > div.row > button,
form > div.row > a {
    margin: 10px 0;
    width: 100px;
}
</style>