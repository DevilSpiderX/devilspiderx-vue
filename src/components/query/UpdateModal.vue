<script setup>
import { reactive, ref, watch } from "vue";

const props = defineProps({
    visible: Boolean,
    data: Object
})
const emit = defineEmits(["submit", "update:visible"]);

watch(() => props.visible, newVal => {
    if (newVal) {
        window_resize();
        window.addEventListener("resize", window_resize);
    } else {
        window.removeEventListener("resize", window_resize);
    }
});

const form = reactive({
    id: -1,
    name: "",
    account: "",
    password: "",
    remark: ""
});

watch(() => props.data, newVal => {
    Object.assign(form, newVal);
});

function Close() {
    emit('update:visible', false);
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

function window_resize() {
    let winWidth = window.innerWidth;
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
}

function cancel_click() {
    Close();
}
</script>

<template>
    <a-modal :visible="visible" title="修改密码记录" :width="width"
        @update:visible="value=>$emit('update:visible',value)">
        <a-form :model="form" @submit="form_submit">
            <a-form-item field="id" label="ID" v-show="false">
                <a-input-number placeholder="id" v-model="form.id" :min="0"></a-input-number>
            </a-form-item>
            <a-form-item field="name" hide-label>
                <a-input placeholder="名称" v-model="form.name" clearable :error="inputNameStatus">
                    <template #prefix>
                        <i class="fas fa-tag fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="account" hide-label>
                <a-input placeholder="账号" v-model="form.account" clearable>
                    <template #prefix>
                        <i class="fas fa-user fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="password" hide-label>
                <a-input placeholder="密码" v-model="form.password" clearable>
                    <template #prefix>
                        <i class="fas fa-key fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="remark" hide-label>
                <a-input placeholder="备注" v-model="form.remark" clearable>
                    <template #prefix>
                        <i class="fas fa-info fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <button type="submit" v-show="false"></button>
        </a-form>
        <template #footer>
            <a-button type="primary" @click="form_submit">
                修 改
            </a-button>
            <a-button @click="cancel_click">取 消</a-button>
        </template>
    </a-modal>
</template>

<style scoped>
</style>