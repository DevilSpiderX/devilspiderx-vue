<script setup lang="ts">
import { unitBytes } from "@/util/format-util";
import { IconArrowFall, IconArrowRise } from "@arco-design/web-vue/es/icon";
import { computed } from "vue";
import { NetworkValueType } from "../scripts/interface";
import BaseCard from "./BaseCard.vue";

const props = withDefaults(
    defineProps<{
        value: NetworkValueType,
        loading: boolean
    }>(),
    {
        value: () => ({
            uploadSpeed: 0,
            downloadSpeed: 0
        }),
        loading: false
    }
)

const formatted = computed(() => {
    let uploadSpeed = unitBytes(props.value.uploadSpeed);
    uploadSpeed.unit += "/s";
    let downloadSpeed = unitBytes(props.value.downloadSpeed);
    downloadSpeed.unit += "/s";
    return { uploadSpeed, downloadSpeed };
});

const precisionUpload = computed(() => {
    let value = formatted.value.uploadSpeed.value;
    return Math.floor(value) === value ? 0 : 2;
});

const precisionDownload = computed(() => {
    let value = formatted.value.downloadSpeed.value;
    return Math.floor(value) === value ? 0 : 2;
});

</script>

<template>
    <BaseCard>
        <template #header>
            <div class="header">
                <h3><i class="fa-solid fa-rss fa-fw"></i>网络信息</h3>
            </div>
        </template>
        <div class="my-card-body">
            <ASkeleton animation :loading="loading">
                <ASkeletonLine :rows="2" :line-height="30" />
                <template #content>
                    <ADescriptions :column="1" :align="{ label: 'right' }" :label-style="{ width: 'calc(50% - 1px)' }">
                        <ADescriptionsItem label="上传速度">
                            <AStatistic :value="formatted.uploadSpeed.value" :precision="precisionUpload"
                                :value-style="{ color: 'rgb(var(--green-7))', fontSize: '20px' }">
                                <template #prefix>
                                    <IconArrowRise />
                                </template>
                                <template #suffix>
                                    {{ formatted.uploadSpeed.unit }}
                                </template>
                            </AStatistic>
                        </ADescriptionsItem>
                        <ADescriptionsItem label="下载速度">
                            <AStatistic :value="formatted.downloadSpeed.value" :precision="precisionDownload"
                                :value-style="{ color: 'rgb(var(--blue-7))', fontSize: '20px' }">>
                                <template #prefix>
                                    <IconArrowFall />
                                </template>
                                <template #suffix>
                                    {{ formatted.downloadSpeed.unit }}
                                </template>
                            </AStatistic>
                        </ADescriptionsItem>
                    </ADescriptions>
                </template>
            </ASkeleton>
        </div>
    </BaseCard>
</template>

<style scoped>
@import url(../styles/card-normal.css);

.my-card-body {
    padding: 20px 30px;
}
</style>