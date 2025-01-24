<script setup lang="ts">
import { reboot as rebootApi, shutdown as shutdownApi, stop as stopApi } from "@/api/os-api.ts";
import { getLogger } from "@/plugins/logger.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import type { DiskVo } from "@/types/server-info.ts";
import { debounce } from "@/utils/util.ts";
import { isDefined } from "@/utils/validate.ts";
import { Message } from "@arco-design/web-vue";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { CpuCard, DiskCard, MemoryCard, NetworkCard } from "./components/index.ts";
import { useServerInfoReceiver } from "./hooks/server-info-receiver.ts";

const logger = getLogger(import.meta.filePath);

const appConfigs = useAppConfigs(),
    userStore = useUserStore(),
    router = useRouter();

const props = defineProps({
    cd: {
        type: Number,
        default: 1500,
    },
});

const _cd = computed({
    get: () => Math.floor(props.cd),
    set: _cd => {
        const cd = Math.floor(_cd);
        if (cd !== props.cd) {
            router.replace({ query: { cd } });
        }
    },
});

const { values, setCD } = useServerInfoReceiver(_cd.value);

watch(_cd, cd => {
    logger.set(import.meta.codeLineNum).info(`更改数据刷新速率${cd}ms`);
    setCD(cd);
    Message.success(`数据刷新速率：${cd}ms`);
});

const pageHeaderBoxShadow = ref<string | undefined>();

function onMainScrollbarScroll(event: Event) {
    if (isDefined(event.target)) {
        const target = event.target as HTMLElement;
        pageHeaderBoxShadow.value = target.scrollTop === 0 ? undefined : "var(--bs-shadow)";
    } else {
        pageHeaderBoxShadow.value = undefined;
    }
}

const settingsDrawer = ref({
    visible: false,
    loadding: false,
});

const onSettingsDrawerRebootClick = debounce(async () => {
    settingsDrawer.value.loadding = true;
    try {
        await rebootApi();
        Message.success("服务器重启成功");
        settingsDrawer.value.visible = false;
        resetValues();
    } catch {
    } finally {
        settingsDrawer.value.loadding = false;
    }
});

const onSettingsDrawerShutdownClick = debounce(async () => {
    settingsDrawer.value.loadding = true;
    try {
        await shutdownApi();
        Message.success("服务器关机成功");
        settingsDrawer.value.visible = false;
        resetValues();
    } catch {
    } finally {
        settingsDrawer.value.loadding = false;
    }
});

const onSettingsDrawerStopClick = debounce(async () => {
    settingsDrawer.value.loadding = true;
    try {
        await stopApi();
        Message.success("停止服务器进程成功");
        settingsDrawer.value.visible = false;
        resetValues();
    } catch {
    } finally {
        settingsDrawer.value.loadding = false;
    }
});

const cpuEnabled = ref(true);
const memoryEnabled = ref(true);
const networkEnabled = ref(true);

function resetValues() {
    cpuEnabled.value = false;
    memoryEnabled.value = false;
    networkEnabled.value = false;
}

type ColDisks = Array<{
    index: number;
    disk: DiskVo;
}>;

// 双列
const doubleColDisks = computed(() => {
    const result: [ColDisks, ColDisks] = [[], []];
    values.value.disks.forEach((disk, index) => {
        if (index % 2 === 0 || index === 1) {
            result[0].push({ index, disk });
        } else {
            result[1].push({ index, disk });
        }
    });
    return result;
});

// 三列
const tripleColDisks = computed(() => {
    const result: [ColDisks, ColDisks, ColDisks] = [[], [], []];
    values.value.disks.forEach((disk, index) => {
        switch (index) {
            case 0:
            case 2: {
                result[0].push({ index, disk });
                return;
            }
            case 1: {
                result[1].push({ index, disk });
                return;
            }
        }

        if (index % 3 === 0) {
            result[1].push({ index, disk });
        } else if (index % 3 === 1) {
            result[2].push({ index, disk });
        } else {
            result[0].push({ index, disk });
        }
    });
    return result;
});
</script>

<template>
    <ALayout>
        <ALayoutHeader :style="{ zIndex: 101, boxShadow: pageHeaderBoxShadow }">
            <APageHeader @back="$router.push({ name: 'index' })">
                <template #title>
                    <span>控制中心</span>
                </template>
                <template #extra>
                    <ASpace>
                        <AInputNumber
                            v-if="appConfigs.client.width > 576"
                            v-model="_cd"
                            :min="500"
                            hide-button
                            :style="{ maxWidth: '12em' }"
                        >
                            <template #prefix>
                                <span>刷新速率</span>
                            </template>
                            <template #suffix>
                                <span>ms</span>
                            </template>
                        </AInputNumber>
                        <AButton
                            v-if="userStore.admin"
                            type="text"
                            shape="circle"
                            style="color: var(--color-text-2)"
                            @click="settingsDrawer.visible = true"
                        >
                            <i class="fa-solid fa-gear"></i>
                        </AButton>
                    </ASpace>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent>
            <AScrollbar
                class="main-scrollbar"
                outer-class="main-scrollbar-out"
                @scroll="onMainScrollbarScroll"
            >
                <ACard
                    class="main-card"
                    :header-style="{ height: 'auto' }"
                    style="background-color: var(--color-bg-1)"
                >
                    <template #title>
                        <div>
                            <h1 style="text-align: center; user-select: none; margin: 0; font-size: 1.5rem">
                                <i class="fa-solid fa-server fa-fw"></i>
                                服务器状态监控
                            </h1>
                        </div>
                    </template>
                    <!-- width < 768px 时单列 -->
                    <template v-if="appConfigs.client.width < 768">
                        <ARow
                            class="my-row"
                            :gutter="10"
                            align="start"
                        >
                            <ACol class="my-col">
                                <CpuCard
                                    :value="values.cpu"
                                    :loading="!values.cpu"
                                    :enabled="cpuEnabled"
                                />
                            </ACol>

                            <ACol class="my-col">
                                <MemoryCard
                                    :value="values.memory"
                                    :process-count="values.os?.processCount"
                                    :loading="!isDefined(values.memory)"
                                    :enabled="memoryEnabled"
                                />
                            </ACol>

                            <ACol class="my-col">
                                <NetworkCard
                                    :values="values.networks"
                                    :loading="values.networks.length === 0"
                                    :enabled="networkEnabled"
                                />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol
                                    v-for="(disk, index) in values.disks"
                                    class="my-col"
                                    :key="index"
                                >
                                    <DiskCard
                                        :value="disk"
                                        :disk-index="index"
                                    />
                                </ACol>
                            </TransitionGroup>
                        </ARow>
                    </template>
                    <!-- 768px <= width < 1200px 时双列 -->
                    <template v-else-if="appConfigs.client.width < 1200">
                        <ARow
                            class="my-row"
                            :gutter="10"
                            align="start"
                            style="margin-right: 10px"
                        >
                            <ACol class="my-col">
                                <CpuCard
                                    :value="values.cpu"
                                    :loading="!values.cpu"
                                    :enabled="cpuEnabled"
                                />
                            </ACol>

                            <ACol class="my-col">
                                <NetworkCard
                                    :values="values.networks"
                                    :loading="values.networks.length === 0"
                                    :enabled="networkEnabled"
                                />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol
                                    v-for="{ disk, index } in doubleColDisks[1]"
                                    class="my-col"
                                    :key="index"
                                >
                                    <DiskCard
                                        :value="disk"
                                        :disk-index="index"
                                    />
                                </ACol>
                            </TransitionGroup>
                        </ARow>

                        <ARow
                            class="my-row"
                            :gutter="10"
                            align="start"
                        >
                            <ACol class="my-col">
                                <MemoryCard
                                    :value="values.memory"
                                    :process-count="values.os?.processCount"
                                    :loading="!isDefined(values.memory)"
                                    :enabled="memoryEnabled"
                                />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol
                                    v-for="{ disk, index } in doubleColDisks[0]"
                                    class="my-col"
                                    :key="index"
                                >
                                    <DiskCard
                                        :value="disk"
                                        :disk-index="index"
                                    />
                                </ACol>
                            </TransitionGroup>
                        </ARow>
                    </template>
                    <!-- 1200px <= width 时三列-->
                    <template v-else>
                        <ARow
                            class="my-row"
                            :gutter="10"
                            align="start"
                            style="margin-right: 10px"
                        >
                            <ACol class="my-col">
                                <CpuCard
                                    :value="values.cpu"
                                    :loading="!values.cpu"
                                    :enabled="cpuEnabled"
                                />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol
                                    v-for="{ disk, index } in tripleColDisks[0]"
                                    class="my-col"
                                    :key="index"
                                >
                                    <DiskCard
                                        :value="disk"
                                        :disk-index="index"
                                    />
                                </ACol>
                            </TransitionGroup>
                        </ARow>

                        <ARow
                            class="my-row"
                            :gutter="10"
                            align="start"
                            style="margin-right: 10px"
                        >
                            <ACol class="my-col">
                                <MemoryCard
                                    :value="values.memory"
                                    :process-count="values.os?.processCount"
                                    :loading="!isDefined(values.memory)"
                                    :enabled="memoryEnabled"
                                />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol
                                    v-for="{ disk, index } in tripleColDisks[1]"
                                    class="my-col"
                                    :key="index"
                                >
                                    <DiskCard
                                        :value="disk"
                                        :disk-index="index"
                                    />
                                </ACol>
                            </TransitionGroup>
                        </ARow>

                        <ARow
                            class="my-row"
                            :gutter="10"
                            align="start"
                        >
                            <ACol class="my-col">
                                <NetworkCard
                                    :values="values.networks"
                                    :loading="values.networks.length === 0"
                                    :enabled="networkEnabled"
                                />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol
                                    v-for="{ disk, index } in tripleColDisks[2]"
                                    class="my-col"
                                    :key="index"
                                >
                                    <DiskCard
                                        :value="disk"
                                        :disk-index="index"
                                    />
                                </ACol>
                            </TransitionGroup>
                        </ARow>
                    </template>
                </ACard>
            </AScrollbar>
        </ALayoutContent>
    </ALayout>

    <ADrawer
        v-model:visible="settingsDrawer.visible"
        title="服务器操作"
        :footer="false"
    >
        <ASpace
            direction="vertical"
            fill
        >
            <AInputNumber
                v-if="appConfigs.client.width <= 576"
                v-model="_cd"
                :min="500"
                hide-button
            >
                <template #prefix>
                    <span>刷新速率</span>
                </template>
                <template #suffix>
                    <span>ms</span>
                </template>
            </AInputNumber>

            <APopconfirm
                v-if="userStore.checkPermission(['system.reboot'])"
                content="确认重启？"
                position="bottom"
                type="warning"
                @ok="onSettingsDrawerRebootClick"
            >
                <AButton
                    type="primary"
                    long
                    status="warning"
                    size="large"
                    :loading="settingsDrawer.loadding"
                >
                    <template #icon>
                        <i class="fa-solid fa-plug-circle-bolt fa-fw"></i>
                    </template>
                    重启
                </AButton>
            </APopconfirm>

            <APopconfirm
                v-if="userStore.checkPermission(['system.shutdown'])"
                content="确认关机？"
                position="bottom"
                type="warning"
                @ok="onSettingsDrawerShutdownClick"
            >
                <AButton
                    type="primary"
                    long
                    status="danger"
                    size="large"
                    :loading="settingsDrawer.loadding"
                >
                    <template #icon>
                        <i class="fa-solid fa-power-off fa-fw"></i>
                    </template>
                    关机
                </AButton>
            </APopconfirm>

            <APopconfirm
                v-if="userStore.checkPermission(['process.shutdown'])"
                content="确认停止服务器进程？"
                position="bottom"
                @ok="onSettingsDrawerStopClick"
            >
                <AButton
                    type="primary"
                    long
                    size="large"
                    :loading="settingsDrawer.loadding"
                >
                    <template #icon>
                        <i class="fa-solid fa-stop fa-fw"></i>
                    </template>
                    停止
                </AButton>
            </APopconfirm>
        </ASpace>
    </ADrawer>
</template>

<style scoped>
@import url(styles/card-transition.css);

.arco-layout,
.arco-layout-content,
.main-scrollbar-out,
.main-scrollbar-out :deep(.main-scrollbar) {
    width: 100%;
    height: 100%;
}

.arco-layout-content {
    overflow: hidden;
}

.main-scrollbar-out :deep(.main-scrollbar) {
    overflow: auto;
}

.main-card {
    box-sizing: border-box;
    border: 0;
}

.my-col {
    padding-bottom: 10px;
}

.my-col > * {
    height: 100%;
}

.my-col:hover {
    z-index: 1;
}

.arco-input-number :deep(.arco-input) {
    text-align: center;
}

.main-card :deep(.arco-card-body) {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}

.my-row {
    flex: 1;
}
</style>
