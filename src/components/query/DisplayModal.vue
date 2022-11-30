<script setup>

const props = defineProps({
    visible: Boolean,
    data: {
        type: Object,
        default: {
            name: "",
            account: "",
            password: "",
            remark: ""
        }
    }
})
const emit = defineEmits(["update:visible"]);

const style = {
    fontSize: "16px"
}

</script>

<template>
    <AModal :visible="visible" title="数据详细" simple :footer="false" width="auto" :modal-style="{ maxWidth: '80%' }"
        @update:visible="visible => $emit('update:visible', visible)">
        <ADescriptions :column="1" :label-style="style" :value-style="style">
            <ADescriptionsItem label="名 称">{{ data.name }}</ADescriptionsItem>
            <ADescriptionsItem label="账 号">{{ data.account }}</ADescriptionsItem>
            <ADescriptionsItem label="密 码">{{ data.password }}</ADescriptionsItem>
            <ADescriptionsItem label="备 注">{{ data.remark }}</ADescriptionsItem>
        </ADescriptions>
    </AModal>
</template>