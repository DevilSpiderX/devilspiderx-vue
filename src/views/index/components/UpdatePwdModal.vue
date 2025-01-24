<script setup lang="ts">
import { updatePassword as updatePasswordApi } from "@/api/user-api.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { debounce } from "@/utils/util.ts";
import { Message } from "@arco-design/web-vue";
import Hex from "crypto-js/enc-hex";
import SHA256 from "crypto-js/sha256";
import { computed, ref } from "vue";

const appConfigs = useAppConfigs();

const props = defineProps({
    visible: Boolean,
});

const emit = defineEmits(["update:visible"]);

const _visible = computed({
    get: () => props.visible,
    set: value => emit("update:visible", value),
});

const form = ref({
    oldPassword: "",
    password: "",
    password2: "",
});

function cleanData() {
    form.value = {
        oldPassword: "",
        password: "",
        password2: "",
    };
}

const onFormSubmit=debounce(async()=>{
    if (form.value.oldPassword === "" || form.value.password === "" || form.value.password2 === "") {
        Message.error("密码不能为空");
        return;
    }

    if (error.value) {
        Message.error("两次输入的密码不相同");
        return;
    }

    const oldPassword = SHA256(form.value.oldPassword).toString(Hex);
    const newPassword = SHA256(form.value.password).toString(Hex);

    await updatePasswordApi(oldPassword, newPassword);
    Message.success("修改成功");
    cleanData();
    emit("update:visible", false);
})

function onCancelClick() {
    cleanData();
    _visible.value = false;
}

const width = computed(() => (appConfigs.client.width <= 500 ? "90%" : 450));
const error = computed(() => form.value.password2 !== "" && form.value.password !== form.value.password2);
</script>

<template>
    <AModal
        v-model:visible="_visible"
        title="修改密码"
        :width="width"
    >
        <AForm
            :model="form"
            @submit="onFormSubmit"
        >
            <AFormItem
                field="oldPassword"
                hide-label
            >
                <AInputPassword
                    placeholder="输入旧密码"
                    v-model="form.oldPassword"
                    allow-clear
                    :error="error"
                >
                    <template #prefix>
                        <i class="fa-duotone fa-key-skeleton"></i>
                    </template>
                </AInputPassword>
            </AFormItem>
            <AFormItem
                field="password"
                hide-label
            >
                <AInputPassword
                    placeholder="输入新密码"
                    v-model="form.password"
                    allow-clear
                    :error="error"
                >
                    <template #prefix>
                        <i class="fa-duotone fa-key"></i>
                    </template>
                </AInputPassword>
            </AFormItem>
            <AFormItem
                field="password2"
                hide-label
            >
                <AInputPassword
                    placeholder="再次输入新密码"
                    v-model="form.password2"
                    allow-clear
                    :error="error"
                >
                    <template #prefix>
                        <i class="fa-duotone fa-key"></i>
                    </template>
                </AInputPassword>
            </AFormItem>
            <button
                type="submit"
                v-show="false"
            ></button>
        </AForm>
        <template #footer>
            <AButton
                type="primary"
                @click="onFormSubmit"
            >
                修 改
            </AButton>
            <AButton @click="onCancelClick">取 消</AButton>
        </template>
    </AModal>
</template>

<style scoped></style>
