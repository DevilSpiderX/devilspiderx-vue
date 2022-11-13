<script setup lang="ts">
import { computed } from "vue";
import { Progress as AProgress } from "@arco-design/web-vue";
import BaseCard from "./BaseCard.vue";
import { CpuValueType } from "./scripts/Types";
import { colors } from "./scripts/progressColor";

const props = withDefaults(
    defineProps<{ value: CpuValueType }>(),
    {
        value: () => ({
            name: "",
            physicalNum: 0,
            logicalNum: 0,
            usedRate: 0,
            is64bit: true,
            cpuTemperature: 0
        })
    }
);

const progressColor = computed(() => {
    let rate = props.value.usedRate;
    if (rate < 0.7) {
        return colors[0];
    } else if (rate < 0.9) {
        return colors[1];
    } else {
        return colors[2];
    }
})

</script>

<template>
    <base-card>
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-microchip fa-fw"></i>CPU</h3>
            </div>
        </template>
        <div class="my-card-body">
            <a-descriptions :column="2" :value-style="{fontSize:'16px'}">
                <a-descriptions-item label="名 称" :span="2">
                    <span style="font-size: 14px">{{ value.name }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="物理核心数">{{ value.physicalNum }}</a-descriptions-item>
                <a-descriptions-item label="逻辑核心数">{{ value.logicalNum }}</a-descriptions-item>
                <a-descriptions-item label="处理器位宽">{{ value.is64bit ? "64" : "32" }}</a-descriptions-item>
                <a-descriptions-item label="温 度">{{ value.cpuTemperature }} ℃</a-descriptions-item>
            </a-descriptions>
            <a-descriptions>
                <a-descriptions-item label="使用率" :span="2">
                    <a-progress :percent="value.usedRate" :stroke-width="22" size="large" :color="progressColor">
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