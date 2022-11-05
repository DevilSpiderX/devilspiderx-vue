<template>
    <a-layout>
        <a-layout-content style="padding: 0;overflow: visible;">
            <a-row justify="center">
                <a-col class="register-col">
                    <a-form :model="form" @submit="form_submit">
                        <h1 style="text-align: center;font-size: 2.5rem;color: var(--color-text-1);">
                            注&nbsp;&nbsp;册
                        </h1>
                        <a-form-item field="uid" hide-label>
                            <a-input class="my-input" placeholder="账号" v-model="form.uid" allow-clear
                                     :input-attrs="{style:{'font-size':'1.1rem'}}" :error="inputStatus[0]">
                                <template #prefix>
                                    <span><i class="fas fa-user fa-fw"></i></span>
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item field="pwd" hide-label>
                            <a-input-password class="my-input" placeholder="密码" v-model="form.pwd" allow-clear
                                              :input-attrs="{style:{'font-size':'1.1rem'}}" :error="inputStatus[1]">
                                <template #prefix>
                                    <span><i class="fas fa-key fa-fw"></i></span>
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item field="pwd_a" hide-label>
                            <a-input-password class="my-input" placeholder="再次输入密码" v-model="form.pwd_a"
                                              allow-clear :input-attrs="{style:{'font-size':'1.1rem'}}"
                                              :error="inputStatus[2]">
                                <template #prefix>
                                    <span><i class="fas fa-key fa-fw"></i></span>
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-row class="button-row" justify="space-around">
                            <a-button type="primary" size="large" html-type="submit">注 册</a-button>
                            <a-button type="primary" size="large" html-type="button" @click="$router.back()">
                                返 回
                            </a-button>
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>

    <div class="running" v-show="running.show">
        <i class="fas fa-spinner fa-spin"></i>
    </div>
</template>

<script>
import {Message} from "@arco-design/web-vue";
import http from "/src/scripts/server-api";
import router from "/src/router.js";

export default {
    name: "RegisterRoute",
    data() {
        return {
            form: {
                uid: "",
                pwd: "",
                pwd_a: ""
            },
            inputStatus: [false, false, false],
            running: {
                show: false
            }
        }
    },
    inject: ["appSettings"],
    beforeMount() {
        this.setThemeColor(window.getComputedStyle(document.body).backgroundColor);
    },
    methods: {
        async form_submit() {
            for (const i in this.inputStatus) this.inputStatus[i] = false;
            let uid = this.form.uid;
            let pwd = this.form.pwd;
            let pwd_a = this.form.pwd_a;
            if (uid === "") {
                this.inputStatus[0] = true;
                return;
            }
            if (pwd === "") {
                this.inputStatus[1] = true;
                return;
            }
            if (pwd_a === "") {
                this.inputStatus[2] = true;
                return;
            }
            if (pwd !== pwd_a) {
                Message.error("两次输入的密码不相同");
                this.inputStatus[1] = true;
                this.inputStatus[2] = true;
                return;
            }
            this.running_start();
            try {
                let resp = await http.register(uid, pwd);
                console.log("Register:", resp);
                switch (resp["code"]) {
                    case 0: {
                        await router.push({name: "login"});
                        break;
                    }
                    case 1: {
                        Message.error("注册失败");
                        for (const i in this.inputStatus) this.inputStatus[i] = true;
                        break;
                    }
                    case 4: {
                        Message.error("用户名已存在\n请换一个用户名");
                        this.inputStatus[0] = true;
                        break;
                    }
                }
            } catch (error) {
                console.error("form_submit:", error);
                Message.error("服务器错误");
            }
            this.running_stop();
        },
        running_start() {
            this.setThemeColor(this.appSettings.darkTheme ? "#0c0c0d" : "#808080");
            this.running.show = true;
        },
        running_stop() {
            this.running.show = false;
            this.setThemeColor(window.getComputedStyle(document.body).backgroundColor);
        }
    }
}
</script>

<style scoped>
.register-col {
    border-radius: 2ex;
    max-width: 500px;
    margin-top: 100px;
    background-color: var(--color-bg-2);
    box-shadow: var(--box-shadow-dark);
    padding: 15px;
}

form > h1,
form > div {
    margin: 10px 0;
}

.button-row > button {
    margin: 10px 0;
    width: 100px;
    height: 50px;
    font-size: 1.25rem;
}

.my-input {
    font-size: 1.1rem;
    height: 3rem;
}

.running {
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

.running > i {
    font-size: 50px;
    color: white;
}
</style>