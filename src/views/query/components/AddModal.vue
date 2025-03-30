<script setup lang="ts">
import { add as addApi } from "@/api/query-api.ts";
import { useModalWidth } from "@/hooks/modal-width.ts";
import { getLogger } from "@/plugins/logger.ts";
import type { MyPasswordsVo } from "@/types/query.ts";
import { debounce } from "@/utils/util.ts";
import { FieldRule, Message } from "@arco-design/web-vue";
import { computed, ref, useId } from "vue";

const logger = getLogger(import.meta.filePath);

const emit = defineEmits<{
    success: [name: string];
    error: [error?: any];
}>();

const visible = defineModel("visible", { default: false });

const defaultForm = {
    name: "",
    account: "",
    password: "",
    remark: "",
};

type FormType = Omit<Required<MyPasswordsVo>, "id">;

const form = ref<FormType>(structuredClone(defaultForm));

const formRules = computed(() => ({
    name: <FieldRule<string>>{
        required: true,
        message: "名称不能为空",
    },
}));

const formId = useId();

function cleanData() {
    Object.assign(form.value, defaultForm);
}

const onFormSubmit = debounce(async () => {
    try {
        const { name, account, password, remark } = form.value;
        const resp = await addApi(name, account, password, remark);
        if (resp) {
            emit("success", name);
            cleanData();
        } else {
            emit("error");
        }
    } catch (error) {
        logger.set(import.meta.codeLineNum).error("出现错误", error);
        Message.error("服务器错误");
        emit("error", error);
    }
});

const { width } = useModalWidth();

function cancel_click() {
    cleanData();
    visible.value = false;
}
</script>

<template>
    <AModal
        v-model:visible="visible"
        title="添加密码记录"
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
                field="name"
                hide-label
            >
                <AInput
                    placeholder="名称"
                    v-model="form.name"
                    allow-clear
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
                    allow-clear
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
                    allow-clear
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
                    allow-clear
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
                添 加
            </AButton>
            <AButton @click="cancel_click">取 消</AButton>
        </template>
    </AModal>
</template>
