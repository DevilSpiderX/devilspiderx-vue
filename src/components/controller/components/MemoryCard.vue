<script setup lang="ts">
import { formatBytes } from "@/util/format-util";
import { Progress as AProgress } from "@arco-design/web-vue";
import { computed } from "vue";
import { MemoryValueType } from "../scripts/interface";
import { colors } from "../scripts/progressColor";
import BaseCard from "./BaseCard.vue";

const props = withDefaults(
    defineProps<{
        value: MemoryValueType;
        processCount: number;
        loading: boolean;
    }>(),
    {
        value: () => ({
            total: 1,
            used: 0,
            free: 0
        }),
        processCount: 0,
        loading: false
    }
)

const usedStr = computed(() => formatBytes(props.value.used, 2, ' '));

const freeStr = computed(() => formatBytes(props.value.free, 2, ' '));

const totalStr = computed(() => formatBytes(props.value.total, 2, ' '));

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
                <h3><i class="fa-solid fa-memory fa-fw"></i>内存</h3>
            </div>
        </template>
        <div class="my-card-body">
            <ASkeleton animation :loading="loading">
                <ASkeletonLine :rows="3" />
                <template #content>
                    <ADescriptions :column="2" :value-style="{ fontSize: '16px' }">
                        <ADescriptionsItem label="已 用">{{ usedStr }}</ADescriptionsItem>
                        <ADescriptionsItem label="剩 余">{{ freeStr }}</ADescriptionsItem>
                        <ADescriptionsItem label="总 量">{{ totalStr }}</ADescriptionsItem>
                        <ADescriptionsItem label="进 程">{{ processCount }} 个</ADescriptionsItem>
                    </ADescriptions>
                    <ADescriptions>
                        <ADescriptionsItem label="使用率">
                            <AProgress :percent="usedPercent" :stroke-width="22" size="large" :color="progressColor">
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