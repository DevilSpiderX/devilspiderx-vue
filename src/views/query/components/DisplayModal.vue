<script setup lang="ts">
import { Message } from "@arco-design/web-vue";

type Props = {
    data: {
        name: string;
        account: string;
        password: string;
        remark: string;
    };
};

const props = withDefaults(defineProps<Props>(), {
    data: () => ({
        name: "",
        account: "",
        password: "",
        remark: "",
    }),
});

const visible = defineModel("visible", { default: false });

const style = {
    fontSize: "16px",
};

function onCopyButtonClick(value: string) {
    if (typeof navigator.clipboard === "object") {
        navigator.clipboard
            .writeText(value)
            .then(() => {
                Message.success({
                    id: "copy_success",
                    content: "复制成功",
                });
            })
            .catch(() => {
                Message.error({
                    id: "copy_error",
                    content: "复制失败",
                });
            });
    }
}
</script>

<template>
    <AModal
        v-model:visible="visible"
        title="数据详细"
        simple
        :footer="false"
        width="auto"
        :modal-style="{ maxWidth: '80%', minWidth: `250px` }"
    >
        <ADescriptions
            :column="1"
            :label-style="style"
            :value-style="style"
        >
            <ADescriptionsItem label="名 称">
                <div :class="$style.descrItem">
                    <span>{{ data.name }}</span>
                    <button
                        v-if="data.name && data.name.length !== 0"
                        :class="$style.copyBtn"
                        @click="onCopyButtonClick(data.name)"
                    >
                        <i class="fa-regular fa-copy" />
                    </button>
                </div>
            </ADescriptionsItem>
            <ADescriptionsItem label="账 号">
                <div :class="$style.descrItem">
                    <span>{{ data.account }}</span>
                    <button
                        v-if="data.account && data.account.length !== 0"
                        :class="$style.copyBtn"
                        @click="onCopyButtonClick(data.account)"
                    >
                        <i class="fa-regular fa-copy" />
                    </button>
                </div>
            </ADescriptionsItem>
            <ADescriptionsItem label="密 码">
                <div :class="$style.descrItem">
                    <span>{{ data.password }}</span>
                    <button
                        v-if="data.password && data.password.length !== 0"
                        :class="$style.copyBtn"
                        @click="onCopyButtonClick(data.password)"
                    >
                        <i class="fa-regular fa-copy" />
                    </button>
                </div>
            </ADescriptionsItem>
            <ADescriptionsItem label="备 注">
                <div :class="$style.descrItem">
                    <span>{{ data.remark }}</span>
                    <button
                        v-if="data.remark && data.remark.length !== 0"
                        :class="$style.copyBtn"
                        @click="onCopyButtonClick(data.remark)"
                    >
                        <i class="fa-regular fa-copy" />
                    </button>
                </div>
            </ADescriptionsItem>
        </ADescriptions>
    </AModal>
</template>

<style module>
.descrItem {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
}

.copyBtn {
    border: unset;
    cursor: pointer;
    background-color: transparent;
    color: var(--color-text-1);
    margin-left: 20px;
    margin-right: -20px;
}
</style>
