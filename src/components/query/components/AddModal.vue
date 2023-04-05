<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useModalWidth } from "../hooks/modal-width";

const props = defineProps({
    visible: Boolean,
    cleaning: Boolean
});
const emit = defineEmits(["submit", "update:visible", "update:cleaning"]);

const _visible = computed({
    get: () => props.visible,
    set: value => emit("update:visible", value)
});

watch(() => props.cleaning, cleaning => {
    if (cleaning) {
        cleanData();
    }
});

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

const { width } = useModalWidth();

function cancel_click() {
    cleanData();
    _visible.value = false;
}
</script>

<template>
    <AModal v-model:visible="_visible" title="添加密码记录" :width="width">
        <AForm :model="form" @submit="form_submit">
            <AFormItem field="name" hide-label>
                <AInput placeholder="名称" v-model="form.name" allow-clear :error="inputNameStatus">
                    <template #prefix>
                        <i class="fa-solid fa-hashtag fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="account" hide-label>
                <AInput placeholder="账号" v-model="form.account" allow-clear>
                    <template #prefix>
                        <i class="fa-solid fa-user fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="password" hide-label>
                <AInput placeholder="密码" v-model="form.password" allow-clear>
                    <template #prefix>
                        <i class="fa-duotone fa-key fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="remark" hide-label>
                <AInput placeholder="备注" v-model="form.remark" allow-clear>
                    <template #prefix>
                        <i class="fa-duotone fa-circle-info fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <button type="submit" v-show="false"></button>
        </AForm>
        <template #footer>
            <AButton type="primary" @click="form_submit">
                添 加
            </AButton>
            <AButton @click="cancel_click">取 消</AButton>
        </template>
    </AModal>
</template>