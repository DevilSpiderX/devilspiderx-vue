<script setup>
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { Message } from '@arco-design/web-vue';
import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import http from "/src/scripts/server-api";
import { setThemeColor } from "../plugins/dsxPlugins";
import { useAppConfigs } from "/src/store/AppConfigsStore";

setThemeColor(window.getComputedStyle(document.body).backgroundColor);

const appConfigs = useAppConfigs();
const form = reactive({
    uid: "",
    pwd: ""
});

onMounted(() => {
    let loginUid = appConfigs.user.uid;
    if (loginUid !== undefined) {
        form.uid = loginUid;
    }
});

const inputStatus = reactive([false, false]);
const router = useRouter();

async function form_submit() {
    for (const i in inputStatus) inputStatus[i] = false;
    let uid = form.uid;
    let pwd = form.pwd;
    if (uid === "") {
        inputStatus[0] = true;
        return;
    }
    if (pwd === "") {
        inputStatus[1] = true;
        return;
    }
    appConfigs.user.uid = uid;

    running_start()
    pwd = SHA256(pwd).toString(Hex);
    try {
        let resp = await http.login(uid, pwd);
        console.log("Login:", resp);
        switch (resp["code"]) {
            case 0: {
                appConfigs.user.login = true;
                Object.assign(appConfigs.user, resp.data);
                await router.push({name: "index"});
                break;
            }
            case 1: {
                Message.error("密码错误");
                inputStatus[1] = true;
                break;
            }
            case 2: {
                Message.error("账号不存在");
                for (const i in inputStatus) inputStatus[i] = false;
                break;
            }
        }
    } catch (error) {
        console.error("form_submit:", error);
        Message.error("服务器错误");
    }
    running_stop();
}

const running = reactive({
    show: false
});

function running_start() {
    running.show = true;
    setThemeColor(appConfigs.darkTheme ? "#0c0c0d" : "#808080");
}

function running_stop() {
    running.show = false;
    setThemeColor(window.getComputedStyle(document.body).backgroundColor);
}
</script>

<template>
    <a-layout>
        <a-layout-content style="padding: 0;overflow: visible;">
            <a-row justify="center">
                <a-col class="register-col">
                    <a-form :model="form" @submit="form_submit">
                        <h1 style="text-align: center;font-size: 2.5rem;color: var(--color-text-1);">
                            登&nbsp;&nbsp;录
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
                        <a-row class="button-row" justify="space-around">
                            <a-button type="primary" size="large" html-type="submit">登 录</a-button>
                            <a-button type="primary" size="large" html-type="button"
                                      @click="$router.push({name:'register'})">
                                注 册
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