<script setup lang="ts">
import { computed } from "vue";
import { Progress as AProgress } from "@arco-design/web-vue";
import BaseCard from "./BaseCard.vue";
import { CpuValueType } from "../scripts/interface";
import { colors } from "../scripts/progressColor";

const props = withDefaults(
    defineProps<{ value: CpuValueType, loading: boolean }>(),
    {
        value: () => ({
            name: "",
            physicalNum: 0,
            logicalNum: 0,
            usedRate: 0,
            is64bit: true,
            cpuTemperature: 0
        }),
        loading: false
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
    <BaseCard>
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-microchip fa-fw"></i>CPU</h3>
            </div>
        </template>
        <div class="my-card-body">
            <ASkeleton animation :loading="loading">
                <ASkeletonLine :rows="4" />
                <template #content>
                    <ADescriptions :column="2" :value-style="{ fontSize: '16px' }">
                        <ADescriptionsItem label="名 称" :span="2">
                            <span style="font-size: 14px">{{ value.name }}</span>
                        </ADescriptionsItem>
                        <ADescriptionsItem label="物理核心数">{{ value.physicalNum }}</ADescriptionsItem>
                        <ADescriptionsItem label="逻辑核心数">{{ value.logicalNum }}</ADescriptionsItem>
                        <ADescriptionsItem label="处理器位宽">{{ value.is64bit ? "64" : "32" }}</ADescriptionsItem>
                        <ADescriptionsItem label="温 度">{{ value.cpuTemperature }} ℃</ADescriptionsItem>
                    </ADescriptions>
                    <ADescriptions>
                        <ADescriptionsItem label="使用率" :span="2">
                            <AProgress :percent="value.usedRate" :stroke-width="22" size="large" :color="progressColor">
                                <template #text="{ percent }">
                                    {{ (percent * 100).toFixed(2) }}%
                                </template>
                            </AProgress>
                        </ADescriptionsItem>
                    </ADescriptions>
                </template>
            </ASkeleton>
        </div>
    </BaseCard>
</template>

<style scoped>
@import url(../styles/card-normal.css);
</style>