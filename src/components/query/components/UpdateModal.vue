<script setup lang="ts">
import { useModalWidth } from "@/hooks/modal-width";
import type { MyPasswordsVo } from "@/types/query";
import { computed, ref } from "vue";

type DataType = Required<MyPasswordsVo>;

const props = defineProps<{
    visible: boolean;
    data: DataType;
}>();

const emit = defineEmits<{
    submit: [form: DataType];
    "update:data": [value: DataType];
    "update:visible": [value: boolean];
}>();

const _visible = computed({
    get: () => props.visible,
    set: value => emit("update:visible", value),
});

const form = computed({
    get: () => props.data,
    set: newData => emit("update:data", newData),
});

const inputNameStatus = ref(false);

function form_submit() {
    inputNameStatus.value = false;
    if (form.value.name === "") {
        inputNameStatus.value = true;
        return;
    }
    emit("submit", form.value);
}

const { width } = useModalWidth();

function cancel_click() {
    _visible.value = false;
}
</script>

<template>
    <AModal
        v-model:visible="_visible"
        title="修改密码记录"
        :width="width">
        <AForm
            :model="form"
            @submit="form_submit">
            <AFormItem
                field="id"
                label="ID"
                v-show="false">
                <AInputNumber
                    placeholder="id"
                    v-model="form.id"
                    :min="0"></AInputNumber>
            </AFormItem>
            <AFormItem
                field="name"
                hide-label>
                <AInput
                    placeholder="名称"
                    v-model="form.name"
                    clearable
                    :error="inputNameStatus">
                    <template #prefix>
                        <i class="fa-solid fa-hashtag fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem
                field="account"
                hide-label>
                <AInput
                    placeholder="账号"
                    v-model="form.account"
                    clearable>
                    <template #prefix>
                        <i class="fa-solid fa-user fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem
                field="password"
                hide-label>
                <AInput
                    placeholder="密码"
                    v-model="form.password"
                    clearable>
                    <template #prefix>
                        <i class="fa-duotone fa-key fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem
                field="remark"
                hide-label>
                <AInput
                    placeholder="备注"
                    v-model="form.remark"
                    clearable>
                    <template #prefix>
                        <i class="fa-duotone fa-circle-info fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <button
                type="submit"
                v-show="false"></button>
        </AForm>
        <template #footer>
            <AButton
                type="primary"
                @click="form_submit">
                修 改
            </AButton>
            <AButton @click="cancel_click">取 消</AButton>
        </template>
    </AModal>
</template>
