<script setup lang="ts">
import { useBodyNoScrollbar } from "@/hooks/body";
import type { NetworkVo } from "@/types/server-info";
import { unitBytes } from "@/util/format-util";
import { IconArrowFall, IconArrowRise } from "@arco-design/web-vue/es/icon";
import { computed, ref, watch, watchEffect } from "vue";
import { useControllerStore } from "../stores/ControllerStore";
import BaseCard from "./BaseCard.vue";

const defaultValue: NetworkVo = {
    name: "All",
    displayName: "",
    macAddr: "",
    bytesSent: 0,
    bytesRecv: 0,
    uploadSpeed: 0,
    downloadSpeed: 0,
    IPv4addr: [],
    IPv6addr: [],
};

const props = withDefaults(
    defineProps<{
        values: NetworkVo[];
        loading: boolean;
        enabled: boolean;
    }>(),
    {
        values: () => [],
        loading: false,
        enabled: true,
    },
);

const showValue = computed(() => {
    for (const network of props.values) {
        if (network.name === selection.value) {
            if (!props.enabled) {
                return {
                    ...network,
                    uploadSpeed: 0,
                    downloadSpeed: 0,
                };
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
            <ASkeleton
                animation
                :loading="loading">
                <ASkeletonLine
                    :rows="7"
                    :line-height="30" />
                <template #content>
                    <ADescriptions :column="1">
                        <ADescriptionsItem
                            label="名 称"
                            key="0">
                            <ASelect v-model:model-value="selection">
                                <AOption
                                    v-for="value of props.values"
                                    :value="value.name">
                                    {{ value.name }}
                                </AOption>
                            </ASelect>
                        </ADescriptionsItem>

                        <ADescriptionsItem
                            label="网卡类型"
                            key="1">
                            <span class="line-feed">{{ showValue.displayName }}</span>
                        </ADescriptionsItem>

                        <ADescriptionsItem
                            label="IPv4"
                            key="2">
                            <APopover
                                v-if="showValue.IPv4addr && showValue.IPv4addr.length > 0"
                                title="IPv4"
                                trigger="click">
                                <span
                                    class="line-feed"
                                    style="cursor: pointer"
                                    >{{ showValue.IPv4addr[0] }}</span
                                >
                                <template #content>
                                    <p v-for="value of showValue.IPv4addr">
                                        {{ value }}
                                    </p>
                                </template>
                            </APopover>
                            <span v-else></span>
                        </ADescriptionsItem>

                        <ADescriptionsItem
                            label="IPv6"
                            key="3">
                            <APopover
                                v-if="showValue.IPv6addr && showValue.IPv6addr.length > 0"
                                title="IPv6"
                                trigger="click">
                                <span
                                    class="line-feed"
                                    style="cursor: pointer"
                                    >{{ showValue.IPv6addr[0] }}</span
                                >
                                <template #content>
                                    <p v-for="value of showValue.IPv6addr">
                                        {{ value }}
                                    </p>
                                </template>
                            </APopover>
                            <span v-else></span>
                        </ADescriptionsItem>

                        <ADescriptionsItem
                            label="MAC"
                            key="4">
                            <span class="line-feed">{{ showValue.macAddr }}</span>
                        </ADescriptionsItem>

                        <ADescriptionsItem
                            label="上 传"
                            key="5">
                            <ASpace size="large">
                                <AStatistic
                                    :value="uploadSpeed.value"
                                    :precision="precisionUpload"
                                    :value-style="{ color: 'rgb(var(--green-7))', fontSize: '20px' }">
                                    <template #prefix>
                                        <IconArrowRise />
                                    </template>
                                    <template #suffix>
                                        {{ uploadSpeed.unit }}
                                    </template>
                                </AStatistic>

                                <AStatistic
                                    :value="uploadBytes.value"
                                    :precision="2"
                                    :value-style="{ color: 'rgb(var(--green-7))', fontSize: '20px' }">
                                    <template #suffix>
                                        {{ uploadBytes.unit }}
                                    </template>
                                </AStatistic>
                            </ASpace>
                        </ADescriptionsItem>

                        <ADescriptionsItem
                            label="下 载"
                            key="6">
                            <ASpace size="large">
                                <AStatistic
                                    :value="downloadSpeed.value"
                                    :precision="precisionDownload"
                                    :value-style="{ color: 'rgb(var(--blue-7))', fontSize: '20px' }"
                                    >>
                                    <template #prefix>
                                        <IconArrowFall />
                                    </template>
                                    <template #suffix>
                                        {{ downloadSpeed.unit }}
                                    </template>
                                </AStatistic>

                                <AStatistic
                                    :value="downloadBytes.value"
                                    :precision="2"
                                    :value-style="{ color: 'rgb(var(--blue-7))', fontSize: '20px' }"
                                    >>
                                    <template #suffix>
                                        {{ downloadBytes.unit }}
                                    </template>
                                </AStatistic>
                            </ASpace>
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
</style>
