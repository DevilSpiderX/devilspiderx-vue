<script setup>
import {
    login as loginApi
} from "@/scripts/http/user-api";
import { useUserStore } from "@/store/UserStore";
import { Message } from "@arco-design/web-vue";
import Hex from "crypto-js/enc-hex";
import SHA256 from "crypto-js/sha256";
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();

const form = reactive({
    uid: "",
    pwd: ""
});

onMounted(() => {
    const loginUid = userStore.uid;
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
    userStore.uid = uid;

    running_start();
    pwd = SHA256(pwd).toString(Hex);
    try {
        const resp = await loginApi(uid, pwd);
        console.log("Login:", resp);
        switch (resp.code) {
            case 0: {
                userStore.login = true;
                Object.assign(userStore, resp.data);
                router.push({ name: "index" });
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
}

function running_stop() {
    running.show = false;
}
</script>

<template>
    <ALayout>
        <ALayoutContent style="padding: 0">
            <ARow justify="center">
                <ACol class="register-col">
                    <AForm :model="form" @submit="form_submit">
                        <h1 style="text-align: center; font-size: 2.5rem">
                            登&nbsp;&nbsp;录
                        </h1>
                        <AFormItem field="uid" hide-label>
                            <AInput v-model="form.uid" class="my-input" placeholder="账号" allow-clear
                                :input-attrs="{ style: { 'font-size': '1.1rem' } }" :error="inputStatus[0]">
                                <template #prefix>
                                    <span><i class="fa-solid fa-user fa-fw"></i></span>
                                </template>
                            </AInput>
                        </AFormItem>
                        <AFormItem field="pwd" hide-label>
                            <AInputPassword v-model="form.pwd" class="my-input" placeholder="密码" allow-clear
                                :input-attrs="{ style: { 'font-size': '1.1rem' } }" :error="inputStatus[1]">
                                <template #prefix>
                                    <span><i class="fa-duotone fa-key fa-fw"></i></span>
                                </template>
                            </AInputPassword>
                        </AFormItem>
                        <ARow class="button-row" justify="space-around">
                            <AButton type="primary" size="large" html-type="submit">
                                登 录
                            </AButton>
                            <AButton type="primary" size="large" html-type="button"
                                @click="$router.push({ name: 'register' })">
                                注 册
                            </AButton>
                        </ARow>
                    </AForm>
                </ACol>
            </ARow>
        </ALayoutContent>
    </ALayout>

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
    box-shadow: var(--el-box-shadow-dark);
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