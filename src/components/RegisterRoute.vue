<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import http from "@/scripts/server-api";
import { useAppConfigs } from "@/store/AppConfigsStore";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = window.getComputedStyle(document.body).backgroundColor;

const inputStatus = reactive([false, false, false]);
const form = reactive({
    uid: "",
    pwd: "",
    pwd_a: ""
});
const router = useRouter();

async function form_submit() {
    for (const i in inputStatus) inputStatus[i] = false;
    let uid = form.uid;
    let pwd = form.pwd;
    let pwd_a = form.pwd_a;
    if (uid === "") {
        inputStatus[0] = true;
        return;
    }
    if (pwd === "") {
        inputStatus[1] = true;
        return;
    }
    if (pwd_a === "") {
        inputStatus[2] = true;
        return;
    }
    if (pwd !== pwd_a) {
        Message.error("两次输入的密码不相同");
        inputStatus[1] = true;
        inputStatus[2] = true;
        return;
    }
    running_start();
    try {
        let resp = await http.register(uid, pwd);
        console.log("Register:", resp);
        switch (resp["code"]) {
            case 0: {
                await router.push({ name: "login" });
                break;
            }
            case 1: {
                Message.error("注册失败");
                for (const i in inputStatus) inputStatus[i] = true;
                break;
            }
            case 4: {
                Message.error("用户名已存在\n请换一个用户名");
                inputStatus[0] = true;
                break;
            }
        }
    } catch (error) {
        console.error("(form_submit)", `url:${error.config?.url}`, error);
        Message.error("服务器错误");
    }
    running_stop();
}

const running = reactive({
    show: false
});

function running_start() {
    running.show = true;
    appConfigs.statusBarColor = appConfigs.darkTheme ? "#0c0c0d" : "#808080";
}

function running_stop() {
    running.show = false;
    appConfigs.statusBarColor = window.getComputedStyle(document.body).backgroundColor;
}
</script>

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
                            <a-input v-model="form.uid" class="my-input" placeholder="账号" allow-clear
                                :input-attrs="{ style: { 'font-size': '1.1rem' } }" :error="inputStatus[0]">
                                <template #prefix>
                                    <span><i class="fas fa-user fa-fw" /></span>
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item field="pwd" hide-label>
                            <a-input-password v-model="form.pwd" class="my-input" placeholder="密码" allow-clear
                                :input-attrs="{ style: { 'font-size': '1.1rem' } }" :error="inputStatus[1]">
                                <template #prefix>
                                    <span><i class="fas fa-key fa-fw" /></span>
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item field="pwd_a" hide-label>
                            <a-input-password v-model="form.pwd_a" class="my-input" placeholder="再次输入密码" allow-clear
                                :input-attrs="{ style: { 'font-size': '1.1rem' } }" :error="inputStatus[2]">
                                <template #prefix>
                                    <span><i class="fas fa-key fa-fw" /></span>
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-row class="button-row" justify="space-around">
                            <a-button type="primary" size="large" html-type="submit">
                                注 册
                            </a-button>
                            <a-button type="primary" size="large" html-type="button" @click="$router.back()">
                                返 回
                            </a-button>
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>

    <div v-show="running.show" class="running">
        <i class="fas fa-spinner fa-spin" />
    </div>
</template>

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