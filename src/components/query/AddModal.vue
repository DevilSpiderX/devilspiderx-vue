<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import { useAppConfigs } from "@/store/AppConfigsStore";

const props = defineProps({
    visible: Boolean,
    cleaning: Boolean
})
const emit = defineEmits(["submit", "update:visible", "update:cleaning"]);

watch(() => props.cleaning, newVal => {
    if (newVal) {
        cleanData();
    }
});

function close() {
    emit("update:visible", false);
}

const form = reactive({
    name: "",
    account: "",
    password: "",
    remark: ""
});

function cleanData() {
    for (let key in form) form[key] = "";
    emit("update:cleaning", false);
}

const inputNameStatus = ref(false);

function form_submit() {
    inputNameStatus.value = false;
    if (form.name === "") {
        inputNameStatus.value = true;
        return;
    }
    emit('submit', form);
}

const width = ref("50%");
const appConfigs = useAppConfigs();
watchEffect(() => {
    let winWidth = appConfigs.window.width;
    if (winWidth < 576) {
        width.value = "90%";
    } else if (winWidth < 768) {
        width.value = "83.3%";
    } else if (winWidth < 992) {
        width.value = "62.5%";
    } else if (winWidth < 1200) {
        width.value = "48%";
    } else if (winWidth < 1920) {
        width.value = "40%";
    } else if (winWidth >= 1920) {
        width.value = "25%";
    }
});

function cancel_click() {
    cleanData();
    close();
}
</script>

<template>
    <a-modal :visible="visible" title="添加密码记录" :width="width" @update:visible="value => $emit('update:visible', value)">
        <a-form :model="form" @submit="form_submit">
            <a-form-item field="name" hide-label>
                <a-input placeholder="名称" v-model="form.name" allow-clear :error="inputNameStatus">
                    <template #prefix>
                        <i class="fas fa-tag fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="account" hide-label>
                <a-input placeholder="账号" v-model="form.account" allow-clear>
                    <template #prefix>
                        <i class="fas fa-user fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="password" hide-label>
                <a-input placeholder="密码" v-model="form.password" allow-clear>
                    <template #prefix>
                        <i class="fas fa-key fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="remark" hide-label>
                <a-input placeholder="备注" v-model="form.remark" allow-clear>
                    <template #prefix>
                        <i class="fas fa-info fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <button type="submit" v-show="false"></button>
        </a-form>
        <template #footer>
            <a-button type="primary" @click="form_submit">
                添 加
            </a-button>
            <a-button @click="cancel_click">取 消</a-button>
        </template>
    </a-modal>
</template>

<style scoped>

</style>