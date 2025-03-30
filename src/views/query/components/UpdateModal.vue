<script setup lang="ts">
import { update as updateApi } from "@/api/query-api.ts";
import { useModalWidth } from "@/hooks/modal-width.ts";
import { isDefined } from "@/utils/validate.ts";
import { Message, Modal } from "@arco-design/web-vue";
import type { FieldRule } from "@arco-design/web-vue/es/form/interface";
import { computed, ref, useId, watch } from "vue";
import type { DataType } from "../types/password-data.ts";

const props = defineProps<{
    data: DataType;
}>();

const emit = defineEmits<{
    success: [data: DataType];
    error: [error?: any];
}>();

const visible = defineModel("visible", { default: false });

const form = ref<DataType>({
    id: -1,
    name: "",
    account: "",
    password: "",
    remark: "",
});

watch(visible, value => {
    if (!value) {
        return;
    }
    const { id, name, account, password, remark } = props.data;
    form.value = {
        id,
        name,
        account,
        password,
        remark,
    };
});

const formRules = computed(() => ({
    id: <FieldRule<number>[]>[
        {
            required: true,
            message: "id不能为空",
        },
        {
            message: "id必须大于0",
            validator(value, callback) {
                if (!isDefined(value)) {
                    callback("value为undefined");
                    return;
                }
                if (value < 0) {
                    Message.error("id属性必须大于0，请关闭重进窗口");
                    callback("id必须大于0");
                } else {
                    callback();
                }
            },
        },
    ],
    name: <FieldRule<string>>{
        required: true,
        message: "名称不能为空",
    },
}));

const formId = useId();

function onFormSubmit() {
    Modal.confirm({
        title: "提示",
        content: "确认修改？",
        width: 300,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
            try {
                const { id, name, account, password, remark } = form.value;
                const resp = await updateApi(id, name, account, password, remark);
                if (resp) {
                    emit("success", form.value);
                } else {
                    emit("error");
                }
            } catch (error) {
                emit("error", error);
            }
        },
    });
}

const { width } = useModalWidth();

function cancel_click() {
    visible.value = false;
}
</script>

<template>
    <AModal
        v-model:visible="visible"
        title="修改密码记录"
        :width="width"
        unmount-on-close
    >
        <AForm
            :id="formId"
            :model="form"
            :rules="formRules"
            @submit-success="onFormSubmit"
        >
            <AFormItem
                field="id"
                label="ID"
                v-show="false"
            >
                <AInputNumber
                    placeholder="id"
                    v-model="form.id"
                />
            </AFormItem>
            <AFormItem
                field="name"
                hide-label
            >
                <AInput
                    placeholder="名称"
                    v-model="form.name"
                    clearable
                >
                    <template #prefix>
                        <i class="fa-solid fa-hashtag fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem
                field="account"
                hide-label
            >
                <AInput
                    placeholder="账号"
                    v-model="form.account"
                    clearable
                >
                    <template #prefix>
                        <i class="fa-solid fa-user fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem
                field="password"
                hide-label
            >
                <AInput
                    placeholder="密码"
                    v-model="form.password"
                    clearable
                >
                    <template #prefix>
                        <i class="fa-duotone fa-key fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem
                field="remark"
                hide-label
            >
                <AInput
                    placeholder="备注"
                    v-model="form.remark"
                    clearable
                >
                    <template #prefix>
                        <i class="fa-duotone fa-circle-info fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
        </AForm>
        <template #footer>
            <AButton
                type="primary"
                html-type="submit"
                :form="formId"
            >
                修 改
            </AButton>
            <AButton @click="cancel_click">取 消</AButton>
        </template>
    </AModal>
</template>
