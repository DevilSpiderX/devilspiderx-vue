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

<script lang="ts">
import { defineComponent, PropType } from "vue";
import BaseCard from "./BaseCard.vue";
import { colors } from "./scripts/progressColor";

interface MemoryValueType {
    total: number,
    used: number,
    free: number,
    format: {
        total: { value: number, unit: string },
        used: { value: number, unit: string },
        free: { value: number, unit: string }
    }
}

export default defineComponent({
    name: "MemoryCard",
    components: {BaseCard},
    props: {
        value: {
            type: Object as PropType<MemoryValueType>,
            required: true,
            default: {
                total: 1,
                used: 0,
                free: 0,
                format: {
                    total: {value: 0, unit: "B"},
                    used: {value: 0, unit: "B"},
                    free: {value: 0, unit: "B"}
                }
            }
        }
    },
    computed: {
        usedStr() {
            let data = this.value.format.used;
            return `${data.value} ${data.unit}`;
        },
        freeStr() {
            let data = this.value.format.free;
            return `${data.value} ${data.unit}`;
        },
        totalStr() {
            let data = this.value.format.total;
            return `${data.value} ${data.unit}`;
        },
        usedPercent() {
            return this.value.used / this.value.total;
        },
        progressColor() {
            let rate = this.usedPercent;
            if (rate < 0.7) {
                return colors[0];
            } else if (rate < 0.9) {
                return colors[1];
            } else {
                return colors[2];
            }
        }
    }
})
</script>

<style scoped>
@import url(/src/components/controller/styles/card-normal.css);
</style>