<template>
    <div class="container">
        <div class="row justify-content-center ">
            <div id="center-fa" class="col-sm-10 col-md-7 col-lg-6 col-xl-5 shadow">
                <form @submit.prevent="form_submit">
                    <h1 class="text-center">登&nbsp;&nbsp;录</h1>
                    <div class="input-group height_3rem">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-user fa-fw"></i></span>
                        </div>
                        <input class="form-control height_3rem my_form_control" type="text" placeholder="账号"
                               ref="user" v-model="form.uid">
                    </div>
                    <div class="input-group height_3rem">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="fas fa-key fa-fw"></i></span>
                        </div>
                        <input class="form-control height_3rem my_form_control" type="password" placeholder="密码"
                               ref="password" v-model="form.pwd">
                    </div>
                    <div class="row justify-content-around">
                        <button type="submit" class="btn btn-success btn-lg">登 录</button>
                        <router-link :to='{name:"register"}' class="btn btn-success btn-lg">注 册</router-link>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="running" :style="running.style">
        <i class="fas fa-spinner fa-spin"></i>
    </div>
</template>

<script>
import {setThemeColor} from "@/js/global";
import {login} from "@/js/server-api";
import router from "@/router";
import CryptoJS from 'CryptoJS';

export default {
    name: "LoginRoute",
    data() {
        return {
            form: {
                uid: "",
                pwd: ""
            },
            running: {
                style: "display:none;"
            }
        }
    },
    methods: {
        form_submit() {
            let uid = this.form.uid;
            let pwd = this.form.pwd;
            if (uid === "") {
                this.$refs.user.focus();
                return;
            }
            if (pwd === "") {
                this.$refs.password.focus();
                return;
            }
            this.storageAccount(uid, true);
            let running = this.running;

            function start_login() {
                setThemeColor("#1A1D20");
                running.style = "";
            }

            function stop_login() {
                running.style = "display:none;";
                setThemeColor("#343A40");
            }

            start_login();
            pwd = CryptoJS.SHA256(pwd).toString(CryptoJS.enc.Hex);
            login(uid, pwd, function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        router.push({name: "index"});
                        break;
                    }
                    case 1: {
                        alert("密码错误");
                        break;
                    }
                    case 2: {
                        alert("账号不存在");
                        break;
                    }
                }
                stop_login()
            }, stop_login);
        },
        storageAccount(uid, allow) {
            if (allow) {
                localStorage.loginUid = uid;
            } else {
                localStorage.removeItem("loginUid");
            }
        }
    },
    beforeMount() {
        setThemeColor("#DCDCDC");
    },
    mounted() {
        let loginUid = localStorage.loginUid;
        if (loginUid !== undefined) {
            this.form.uid = loginUid;
        }
    }
}
</script>

<style scoped>
div#center-fa {
    /*border: #6c757d 5px solid;*/
    border-radius: 2ex;
    margin-top: 100px;
    background-color: white;
}

form > h1,
form > div {
    margin: 20px 0;
}

form > div.row > button,
form > div.row > a {
    margin: 10px 0;
    width: 100px;
}

.height_3rem {
    height: 3rem;
}

.my_form_control {
    background-color: #F9F9F9;
    font-size: 1.1rem;
}

#running {
    width: 100%;
    height: 100%;
    background-color: #0000007f;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

#running > i {
    font-size: 50px;
    color: white;
}
</style>