<script setup lang="ts">
import { useBodyNoScrollbar } from "@/hooks/body";
import { unitBytes } from "@/util/format-util";
import { IconArrowFall, IconArrowRise } from "@arco-design/web-vue/es/icon";
import { computed, ref, watch, watchEffect } from "vue";
import { NetworkValueType } from "../scripts/interface";
import { useControllerStore } from "../stores/ControllerStore";
import BaseCard from "./BaseCard.vue";

const defaultValue: NetworkValueType = {
    name: "All",
    bytesSent: 0,
    bytesRecv: 0,
    uploadSpeed: 0,
    downloadSpeed: 0
};

const props = withDefaults(
    defineProps<{
        values: NetworkValueType[];
        loading: boolean;
        enabled: boolean;
    }>(),
    {
        values: () => [],
        loading: false,
        enabled: true
    }
);

const showValue = computed(() => {
    for (const network of props.values) {
        if (network.name === selection.value) {
            if (!props.enabled) {
                return {
                    ...network,
                    uploadSpeed: 0,
                    downloadSpeed: 0
                }
            }
            return network;
        }
    }
    return defaultValue;
});

const uploadSpeed = computed(() => {
    const uploadSpeed = unitBytes(showValue.value.uploadSpeed);
    uploadSpeed.unit += "/s";
    return uploadSpeed;
});

const downloadSpeed = computed(() => {
    const downloadSpeed = unitBytes(showValue.value.downloadSpeed);
    downloadSpeed.unit += "/s";
    return downloadSpeed;
});

const uploadBytes = computed(() => unitBytes(showValue.value.bytesSent));

const downloadBytes = computed(() => unitBytes(showValue.value.bytesRecv));

const precisionUpload = computed(() => {
    const { value } = uploadSpeed.value;
    return Math.floor(value) === value ? 0 : 2;
});

const precisionDownload = computed(() => {
    const { value } = downloadSpeed.value;
    return Math.floor(value) === value ? 0 : 2;
});

const controllerStore = useControllerStore();

const selection = ref("");

watch(selection, value => {
    controllerStore.networkSelection = value;
});

watchEffect(() => {
    if (props.values.length > 0) {
        const { networkSelection } = controllerStore;
        for (const { name } of props.values) {
            if (name === networkSelection) {
                selection.value = name;
                return;
            }
        }
        selection.value = props.values[0].name;
    }
});

useBodyNoScrollbar();

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
                    <ADescriptions :column="1">
                        <ADescriptionsItem label="名称">
                            <ASelect v-model:model-value="selection">
                                <AOption v-for="value of props.values" :value="value.name">
                                    {{ value.name }}
                                </AOption>
                            </ASelect>
                        </ADescriptionsItem>
                    </ADescriptions>

                    <ADescriptions :column="1" :key="selection">
                        <ADescriptionsItem label="网卡类型" key="1">
                            <span class="line-feed">{{ showValue.displayName }}</span>
                        </ADescriptionsItem>

                        <ADescriptionsItem label="IPv4" key="2">
                            <APopover v-if="showValue.IPv4addr && showValue.IPv4addr.length > 0" title="IPv4"
                                trigger="click">
                                <span class="line-feed" style="cursor: pointer;">{{ showValue.IPv4addr[0] }}</span>
                                <template #content>
                                    <p v-for="value of showValue.IPv4addr">
                                        {{ value }}
                                    </p>
                                </template>
                            </APopover>
                            <span v-else></span>
                        </ADescriptionsItem>

                        <ADescriptionsItem label="IPv6" key=3>
                            <APopover v-if="showValue.IPv6addr && showValue.IPv6addr.length > 0" title="IPv6"
                                trigger="click">
                                <span class="line-feed" style="cursor: pointer;">{{ showValue.IPv6addr[0] }}</span>
                                <template #content>
                                    <p v-for="value of showValue.IPv6addr">
                                        {{ value }}
                                    </p>
                                </template>
                            </APopover>
                            <span v-else></span>
                        </ADescriptionsItem>

                        <ADescriptionsItem label="MAC" key="4">
                            <span class="line-feed">{{ showValue.macAddr }}</span>
                        </ADescriptionsItem>

                        <ADescriptionsItem label="上传" key="5">
                            <div class="div-flex-between">
                                <AStatistic :value="uploadSpeed.value" :precision="precisionUpload"
                                    :value-style="{ color: 'rgb(var(--green-7))', fontSize: '20px' }">
                                    <template #prefix>
                                        <IconArrowRise />
                                    </template>
                                    <template #suffix>
                                        {{ uploadSpeed.unit }}
                                    </template>
                                </AStatistic>

                                <AStatistic :value="uploadBytes.value" :precision="2"
                                    :value-style="{ color: 'rgb(var(--green-7))', fontSize: '20px' }">
                                    <template #suffix>
                                        {{ uploadBytes.unit }}
                                    </template>
                                </AStatistic>
                            </div>
                        </ADescriptionsItem>


                        <ADescriptionsItem label="下载" key="6">
                            <div class="div-flex-between">
                                <AStatistic :value="downloadSpeed.value" :precision="precisionDownload"
                                    :value-style="{ color: 'rgb(var(--blue-7))', fontSize: '20px' }">>
                                    <template #prefix>
                                        <IconArrowFall />
                                    </template>
                                    <template #suffix>
                                        {{ downloadSpeed.unit }}
                                    </template>
                                </AStatistic>

                                <AStatistic :value="downloadBytes.value" :precision="2"
                                    :value-style="{ color: 'rgb(var(--blue-7))', fontSize: '20px' }">>
                                    <template #suffix>
                                        {{ downloadBytes.unit }}
                                    </template>
                                </AStatistic>
                            </div>
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

.line-feed {
    word-break: break-word;
    overflow-wrap: break-word;
}

.div-flex-between {
    display: flex;
    justify-content: space-between;
}
</style>