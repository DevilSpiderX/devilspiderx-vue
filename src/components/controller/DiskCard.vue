<template>
    <base-card>
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-hdd fa-fw"></i>硬盘分区 {{ diskIndex }}</h3>
            </div>
        </template>
        <div class="my-card-body">
            <div>{{ value.label }}({{ value.mount }})</div>
            <a-progress :percent="usedPercent" :show-text="false" :stroke-width="22" size="large"
                        :color="progressColor"/>
            <div>{{ freeStr }}可用，共 {{ totalStr }}</div>
        </div>
    </base-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import BaseCard from "./BaseCard.vue";
import { colors } from "./scripts/progressColor";

interface DiskValueType {
    label: string,
    mount: string,
    fSType: string,
    name: string,
    total: number,
    free: number,
    used: number,
    format: {
        total: { value: number, unit: string },
        free: { value: number, unit: string },
        used: { value: number, unit: string }
    }
}

export default defineComponent({
    name: "DiskCard",
    components: {BaseCard},
    props: {
        value: {
            type: Object as PropType<DiskValueType>,
            required: true,
            default: {
                label: "",
                mount: "",
                fSType: "",
                name: "",
                total: 1,
                free: 0,
                used: 0,
                format: {
                    total: {value: 0, unit: "B"},
                    free: {value: 0, unit: "B"},
                    used: {value: 0, unit: "B"}
                }
            }
        },
        diskIndex: Number
    },
    computed: {
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

.my-card-body {
    font-size: 16px;
}
</style>