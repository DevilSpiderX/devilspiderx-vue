<script setup lang="ts">
import { computed } from "vue";
import { IconArrowFall, IconArrowRise } from "@arco-design/web-vue/es/icon";
import BaseCard from "./BaseCard.vue";
import { NetworkValueType } from "./scripts/Types";

const props = withDefaults(
    defineProps<{ value: NetworkValueType }>(),
    {
        value: () => ({
            uploadSpeed: 0,
            downloadSpeed: 0,
            format: {
                uploadSpeed: {value: 0, unit: "B/s"},
                downloadSpeed: {value: 0, unit: "B/s"}
            }
        })
    }
)

const precision_upload = computed(() => {
    return props.value.format.uploadSpeed.unit === "B/s" ? 0 : 2;
});

const precision_download = computed(() => {
    return props.value.format.downloadSpeed.unit === "B/s" ? 0 : 2;
});

</script>

<template>
    <base-card>
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-rss fa-fw"></i>网络信息</h3>
            </div>
        </template>
        <div class="my-card-body">
            <a-descriptions :column="1" :align="{label:'right'}" :label-style="{width:'calc(50% - 1px)'}">
                <a-descriptions-item label="上传速度">
                    <a-statistic :value="value.format.uploadSpeed.value" :precision="precision_upload"
                                 :value-style="{color:'rgb(var(--green-7))',fontSize:'20px'}">
                        <template #prefix>
                            <icon-arrow-rise />
                        </template>
                        <template #suffix>
                            {{ value.format.uploadSpeed.unit }}
                        </template>
                    </a-statistic>
                </a-descriptions-item>
                <a-descriptions-item label="下载速度">
                    <a-statistic :value="value.format.downloadSpeed.value" :precision="precision_download"
                                 :value-style="{color:'rgb(var(--blue-7))',fontSize:'20px'}">>
                        <template #prefix>
                            <icon-arrow-fall />
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

<style scoped>
@import url(/src/components/controller/styles/card-normal.css);
</style>