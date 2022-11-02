<template>
    <base-card :empty="empty">
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-microchip fa-fw"></i>CPU</h3>
            </div>
        </template>
        <div class="my-card-body">
            <a-descriptions :column="2" :value-style="{fontSize:'16px'}">
                <a-descriptions-item label="名 称" :span="2">
                    <span style="font-size: 14px">{{ Value.name }}</span>
                </a-descriptions-item>
                <a-descriptions-item label="物理核心数">{{ Value.physicalNum }}</a-descriptions-item>
                <a-descriptions-item label="逻辑核心数">{{ Value.logicalNum }}</a-descriptions-item>
                <a-descriptions-item label="处理器位宽">{{ Value.is64bit ? "64" : "32" }}</a-descriptions-item>
                <a-descriptions-item label="温 度">{{ Value.cpuTemperature }} ℃</a-descriptions-item>
            </a-descriptions>
            <a-descriptions>
                <a-descriptions-item label="使用率" :span="2">
                    <a-progress :percent="Value.usedRate" :stroke-width="22" size="large" :color="progressColor">
                        <template #text="{percent}">
                            {{ (percent * 100).toFixed(2) }}%
                        </template>
                    </a-progress>
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </base-card>
</template>

<script>
import BaseCard from "./BaseCard.vue";
import {colors} from "./scripts/progressColor.js";

export default {
    name: "CpuCard",
    components: {BaseCard},
    data() {
        return {
            Value: {
                name: "",
                physicalNum: 0,
                logicalNum: 0,
                usedRate: 0,
                is64bit: true,
                cpuTemperature: 0
            },
            empty: true
        }
    },
    props: {
        value: {
            type: Object,
            required: true
        }
    },
    watch: {
        value(newVal) {
            Object.assign(this.Value, newVal);
            this.empty = false;
        }
    },
    computed: {
        progressColor() {
            let rate = this.Value.usedRate;
            if (rate < 0.7) {
                return colors[0];
            } else if (rate < 0.9) {
                return colors[1];
            } else {
                return colors[2];
            }
        }
    }
}
</script>

<style scoped>
@import url(/src/components/controller/styles/card-normal.css);
</style>