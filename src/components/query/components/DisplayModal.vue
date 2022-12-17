<script setup>
import { computed } from "vue";

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

const _visible = computed({
    get: () => props.visible,
    set: value => emit("update:visible", value)
});

const style = {
    fontSize: "16px"
}

</script>

<template>
    <AModal v-model:visible="_visible" title="数据详细" simple :footer="false" width="auto"
        :modal-style="{ maxWidth: '80%' }">
        <ADescriptions :column="1" :label-style="style" :value-style="style">
            <ADescriptionsItem label="名 称">{{ data.name }}</ADescriptionsItem>
            <ADescriptionsItem label="账 号">{{ data.account }}</ADescriptionsItem>
            <ADescriptionsItem label="密 码">{{ data.password }}</ADescriptionsItem>
            <ADescriptionsItem label="备 注">{{ data.remark }}</ADescriptionsItem>
        </ADescriptions>
    </AModal>
</template>