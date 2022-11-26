<script setup>
import { reactive, ref, watch, watchEffect } from "vue";
import { useAppConfigs } from "@/store/AppConfigsStore";

const props = defineProps({
    visible: Boolean,
    data: Object
})
const emit = defineEmits(["submit", "update:visible"]);

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
    Close();
}
</script>

<template>
    <AModal :visible="visible" title="修改密码记录" :width="width"
        @update:visible="visible => $emit('update:visible', visible)">
        <AForm :model="form" @submit="form_submit">
            <AFormItem field="id" label="ID" v-show="false">
                <AInputNumber placeholder="id" v-model="form.id" :min="0"></AInputNumber>
            </AFormItem>
            <AFormItem field="name" hide-label>
                <AInput placeholder="名称" v-model="form.name" clearable :error="inputNameStatus">
                    <template #prefix>
                        <i class="fas fa-tag fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="account" hide-label>
                <AInput placeholder="账号" v-model="form.account" clearable>
                    <template #prefix>
                        <i class="fas fa-user fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="password" hide-label>
                <AInput placeholder="密码" v-model="form.password" clearable>
                    <template #prefix>
                        <i class="fas fa-key fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="remark" hide-label>
                <AInput placeholder="备注" v-model="form.remark" clearable>
                    <template #prefix>
                        <i class="fas fa-info fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <button type="submit" v-show="false"></button>
        </AForm>
        <template #footer>
            <AButton type="primary" @click="form_submit">
                修 改
            </AButton>
            <AButton @click="cancel_click">取 消</AButton>
        </template>
    </AModal>
</template>