<script setup>
import { http } from "@/scripts/http";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { Message } from "@arco-design/web-vue";
import Hex from "crypto-js/enc-hex";
import SHA256 from "crypto-js/sha256";
import { computed, ref } from "vue";

const appConfigs = useAppConfigs();

const props = defineProps({
    visible: Boolean
});

const emit = defineEmits(["update:visible"]);

const _visible = computed({
    get: () => props.visible,
    set: value => emit("update:visible", value)
});

const form = ref({
    oldPassword: "",
    password: "",
    password2: ""
});

function cleanData() {
    form.value = {
        oldPassword: "",
        password: "",
        password2: ""
    }
}

async function on_form_submit() {
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

    const resp = await http.user.updatePassword(oldPassword, newPassword);
    if (resp.code === 0) {
        Message.success("修改成功");
        cleanData();
        emit("update:visible", false);
    } else {
        Message.error(resp.msg);
    }
}

function on_cancel_click() {
    cleanData();
    _visible.value = false;
}

const width = computed(() => appConfigs.client.width <= 500 ? "90%" : 450);
const error = computed(() => form.value.password2 !== "" && form.value.password !== form.value.password2);

</script>

<template>
    <AModal v-model:visible="_visible" title="修改密码" :width="width">
        <AForm :model="form" @submit="on_form_submit">
            <AFormItem field="oldPassword" hide-label>
                <AInputPassword placeholder="输入旧密码" v-model="form.oldPassword" allow-clear :error="error">
                    <template #prefix>
                        <i class="fa-duotone fa-key-skeleton"></i>
                    </template>
                </AInputPassword>
            </AFormItem>
            <AFormItem field="password" hide-label>
                <AInputPassword placeholder="输入新密码" v-model="form.password" allow-clear :error="error">
                    <template #prefix>
                        <i class="fa-duotone fa-key"></i>
                    </template>
                </AInputPassword>
            </AFormItem>
            <AFormItem field="password2" hide-label>
                <AInputPassword placeholder="再次输入新密码" v-model="form.password2" allow-clear :error="error">
                    <template #prefix>
                        <i class="fa-duotone fa-key"></i>
                    </template>
                </AInputPassword>
            </AFormItem>
            <button type="submit" v-show="false"></button>
        </AForm>
        <template #footer>
            <AButton type="primary" @click="on_form_submit">
                修 改
            </AButton>
            <AButton @click="on_cancel_click">取 消</AButton>
        </template>
    </AModal>
</template>

<style scoped></style>