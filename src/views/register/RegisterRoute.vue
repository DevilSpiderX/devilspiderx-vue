<script setup lang="ts">
import { register as registerApi } from "@/api/user-api.ts";
import { getLogger } from "@/plugins/logger.ts";
import { debounce } from "@/utils/util.ts";
import { FieldRule, Message } from "@arco-design/web-vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const logger = getLogger(import.meta.filePath);

const form = ref({
    uid: "",
    pwd: "",
    pwd_a: "",
});

const formRules = computed(() => ({
    uid: <FieldRule<string>>{
        required: true,
        message: "请输入账号",
    },
    pwd: <FieldRule<string>>{
        required: true,
        message: "请输入密码",
    },
    pwd_a: <FieldRule<string>>{
        required: true,
        message: "请再次输入密码",
    },
}));

const router = useRouter();

const onFormSubmit = debounce(async () => {
    const { uid, pwd, pwd_a } = form.value;
    if (pwd !== pwd_a) {
        Message.error("两次输入的密码不相同");
        return;
    }

    running_start();
    try {
        const resp = await registerApi(uid, pwd);
        logger.set(import.meta.codeLineNum).info("Register", resp);
        switch (resp.status) {
            case 0: {
                router.push({ name: "login" });
                break;
            }
            case 1: {
                Message.error("注册失败");
                break;
            }
            case 2: {
                Message.error("用户名已存在\n请换一个用户名");
                break;
            }
            case 1000: {
                Message.error("账号或者密码未填写");
                break;
            }
        }
    } catch (error) {
        logger.set(import.meta.codeLineNum).error(`提交表单出现错误`, error);
        Message.error("服务器错误");
    } finally {
        running_stop();
    }
});

const running = ref({
    show: false,
});

function running_start() {
    running.value.show = true;
}

function running_stop() {
    running.value.show = false;
}
</script>

<template>
    <ALayout>
        <ALayoutContent style="padding: 0">
            <ARow justify="center">
                <ACol class="register-col">
                    <AForm
                        :model="form"
                        :rules="formRules"
                        @submit-success="onFormSubmit"
                    >
                        <h1 style="text-align: center; font-size: 2.5rem">注&nbsp;&nbsp;册</h1>
                        <AFormItem
                            field="uid"
                            hide-label
                        >
                            <AInput
                                v-model="form.uid"
                                class="my-input"
                                placeholder="账号"
                                allow-clear
                                :input-attrs="{ style: { 'font-size': '1.1rem' } }"
                            >
                                <template #prefix>
                                    <span><i class="fa-solid fa-user fa-fw"></i></span>
                                </template>
                            </AInput>
                        </AFormItem>
                        <AFormItem
                            field="pwd"
                            hide-label
                        >
                            <AInputPassword
                                v-model="form.pwd"
                                class="my-input"
                                placeholder="密码"
                                allow-clear
                                :input-attrs="{ style: { 'font-size': '1.1rem' } }"
                            >
                                <template #prefix>
                                    <span><i class="fa-duotone fa-key fa-fw"></i></span>
                                </template>
                            </AInputPassword>
                        </AFormItem>
                        <AFormItem
                            field="pwd_a"
                            hide-label
                        >
                            <AInputPassword
                                v-model="form.pwd_a"
                                class="my-input"
                                placeholder="再次输入密码"
                                allow-clear
                                :input-attrs="{ style: { 'font-size': '1.1rem' } }"
                            >
                                <template #prefix>
                                    <span><i class="fa-duotone fa-key fa-fw"></i></span>
                                </template>
                            </AInputPassword>
                        </AFormItem>
                        <ARow
                            class="button-row"
                            justify="space-around"
                        >
                            <AButton
                                type="primary"
                                size="large"
                                html-type="submit"
                            >
                                注 册
                            </AButton>
                            <AButton
                                type="primary"
                                size="large"
                                html-type="button"
                                @click="$router.back()"
                            >
                                返 回
                            </AButton>
                        </ARow>
                    </AForm>
                </ACol>
            </ARow>
        </ALayoutContent>
    </ALayout>

    <div
        v-show="running.show"
        class="running"
    >
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
