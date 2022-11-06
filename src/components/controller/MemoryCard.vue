<script setup lang="ts">
import { computed } from "vue";
import BaseCard from "./BaseCard.vue";
import { MemoryValueType } from "./scripts/Types";
import { colors } from "./scripts/progressColor";

const props = withDefaults(
    defineProps<{ value: MemoryValueType }>(),
    {
        value: () => ({
            total: 1,
            used: 0,
            free: 0,
            format: {
                total: {value: 0, unit: "B"},
                used: {value: 0, unit: "B"},
                free: {value: 0, unit: "B"}
            }
        })
    }
)

const usedStr = computed(() => {
    let data = props.value.format.used;
    return `${data.value} ${data.unit}`;
});

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
    <base-card>
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-memory fa-fw"></i>内存</h3>
            </div>
        </template>
        <div class="my-card-body">
            <a-descriptions :column="2" :value-style="{fontSize:'16px'}">
                <a-descriptions-item label="已 用">{{ usedStr }}</a-descriptions-item>
                <a-descriptions-item label="剩 余">{{ freeStr }}</a-descriptions-item>
                <a-descriptions-item label="总 量">{{ totalStr }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions>
                <a-descriptions-item label="使用率">
                    <a-progress :percent="usedPercent" :stroke-width="22" size="large" :color="progressColor">
                        <template #text="{percent}">
                            {{ (percent * 100).toFixed(2) }}%
                        </template>
                    </a-progress>
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </base-card>
</template>

<style scoped>
@import url(/src/components/controller/styles/card-normal.css);
</style>