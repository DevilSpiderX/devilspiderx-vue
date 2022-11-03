<template>
    <base-card :empty="empty">
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-rss fa-fw"></i>网络信息</h3>
            </div>
        </template>
        <div class="my-card-body">
            <a-descriptions :column="1" :align="{label:'right'}" :label-style="{width:'calc(50% - 1px)'}">
                <a-descriptions-item label="上传速度">
                    <a-statistic :value="value.format.uploadSpeed.value" :precision="precision.upload"
                                 :value-style="{color:'rgb(var(--green-7))',fontSize:'20px'}">
                        <template #prefix>
                            <icon-arrow-rise/>
                        </template>
                        <template #suffix>
                            {{ value.format.uploadSpeed.unit }}
                        </template>
                    </a-statistic>
                </a-descriptions-item>
                <a-descriptions-item label="下载速度">
                    <a-statistic :value="value.format.downloadSpeed.value" :precision="precision.download"
                                 :value-style="{color:'rgb(var(--blue-7))',fontSize:'20px'}">>
                        <template #prefix>
                            <icon-arrow-fall/>
                        </template>
                        <template #suffix>
                            {{ value.format.downloadSpeed.unit }}
                        </template>
                    </a-statistic>
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </base-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseCard from "./BaseCard.vue";
import {IconArrowRise, IconArrowFall} from "@arco-design/web-vue/es/icon";

interface NetworkValueType {
    uploadSpeed: number,
    downloadSpeed: number,
    format: {
        uploadSpeed: { value: number, unit: string },
        downloadSpeed: { value: number, unit: string }
    }
}

export default defineComponent({
    name: "NetworkCard",
    components: {BaseCard, IconArrowRise, IconArrowFall},
    data() {
        return {
            empty: true,
            precision: {
                upload: 2,
                download: 2
            }
        }
    },
    props: {
        value: {
            type: Object as PropType<NetworkValueType>,
            required: true,
            default: {
                uploadSpeed: 0,
                downloadSpeed: 0,
                format: {
                    uploadSpeed: {value: 0, unit: "B/s"},
                    downloadSpeed: {value: 0, unit: "B/s"}
                }
            }
        }
    },
    watch: {
        value(newVal) {
            this.empty = false;
            this.precision.upload = 2;
            if (newVal.format.uploadSpeed.unit === "B/s") {
                this.precision.upload = 0;
            }
            this.precision.download = 2;
            if (newVal.format.downloadSpeed.unit === "B/s") {
                this.precision.download = 0;
            }
        }
    }
})
</script>

<style scoped>
@import url(/src/components/controller/styles/card-normal.css);
</style>