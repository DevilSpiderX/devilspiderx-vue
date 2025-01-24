<script setup lang="ts">
import { login as loginApi } from "@/api/user-api.ts";
import { getLogger } from "@/plugins/logger.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import { debounce } from "@/utils/util.ts";
import { isDefined } from "@/utils/validate.ts";
import { FieldRule, Message } from "@arco-design/web-vue";
import Hex from "crypto-js/enc-hex";
import SHA256 from "crypto-js/sha256";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

interface Props {
    from?: string;
}

const props = defineProps<Props>();

const fromPath = computed(() => {
    if (isDefined(props.from)) {
        return decodeURIComponent(props.from);
    }
    return null;
});

const logger = getLogger(import.meta.filePath);
const userStore = useUserStore();

const form = ref({
    uid: "",
    pwd: "",
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
}));

onMounted(() => {
    const loginUid = userStore.uid;
    if (loginUid !== undefined) {
        form.value.uid = loginUid;
    }
});

const router = useRouter();

const onFormSubmit = debounce(async () => {
    const { uid, pwd } = form.value;
    userStore.uid = uid;

    running_start();
    const _pwd = SHA256(pwd).toString(Hex);
    try {
        const resp = await loginApi(uid, _pwd);
        logger.set(import.meta.codeLineNum).info("Login:", resp);
        switch (resp.status) {
            case 0: {
                userStore.login = true;
                userStore.$patch(state => {
                    Object.assign(state, resp.data);
                });
                userStore.avatar = undefined;
                if (isDefined(fromPath.value)) {
                    router.push(fromPath.value);
                } else {
                    router.push({ name: "index" });
                }
                userStore.checkUserStatus();
                break;
            }
            case 1: {
                Message.error("密码错误");
                break;
            }
            case 2: {
                Message.error("账号不存在");
                break;
            }
        }
    } catch (error) {
        logger.set(import.meta.codeLineNum).error(`登录出错`, error);
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
                        <h1 style="text-align: center; font-size: 2.5rem">登&nbsp;&nbsp;录</h1>
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
                        <ARow
                            class="button-row"
                            justify="space-around"
                        >
                            <AButton
                                type="primary"
                                size="large"
                                html-type="submit"
                            >
                                登 录
                            </AButton>
                            <AButton
                                type="primary"
                                size="large"
                                html-type="button"
                                @click="$router.push({ name: 'register' })"
                            >
                                注 册
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
