<script setup lang="ts">
import { computed } from "vue";
import BaseCard from "./BaseCard.vue";
import { DiskValueType } from "../scripts/interface";
import { colors } from "../scripts/progressColor";

const props = withDefaults(
    defineProps<{ value: DiskValueType, diskIndex: number }>(),
    {
        value: () => ({
            label: "",
            mount: "",
            fSType: "",
            name: "",
            total: 1,
            free: 0,
            used: 0,
            format: {
                total: { value: 0, unit: "B" },
                free: { value: 0, unit: "B" },
                used: { value: 0, unit: "B" }
            }
        })
    }
)

const freeStr = computed(() => {
    let data = props.value.format.free;
    return `${data.value} ${data.unit}`;
});

const totalStr = computed(() => {
    let data = props.value.format.total;
    return `${data.value} ${data.unit}`;
});

const usedPercent = computed(() => {
    return props.value.used / props.value.total;
});

const progressColor = computed(() => {
    let rate = usedPercent.value;
    if (rate < 0.7) {
        return colors[0];
    } else if (rate < 0.9) {
        return colors[1];
    } else {
        return colors[2];
    }
});

</script>

<template>
    <BaseCard>
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-hdd fa-fw"></i>硬盘分区 {{ diskIndex }}</h3>
            </div>
        </template>
        <div class="my-card-body">
            <div>{{ value.label }}({{ value.mount }})</div>
            <AProgress :percent="usedPercent" :show-text="false" :stroke-width="22" size="large"
                :color="progressColor" />
            <div>{{ freeStr }}可用，共 {{ totalStr }}</div>
        </div>
    </BaseCard>
</template>

<style scoped>
@import url(../styles/card-normal.css);

.my-card-body {
    font-size: 16px;
}
</style>