<script setup>
import { http } from "@/scripts/http";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { useUserStore } from "@/store/UserStore";
import { Scrollbar as AScrollbar, Message } from "@arco-design/web-vue";
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { CpuCard, DiskCard, MemoryCard, NetworkCard } from "./components";
import { useServerInfoReceiver } from "./hooks/server-info-receiver";

const appConfigs = useAppConfigs(),
    userStore = useUserStore(),
    router = useRouter();

const props = defineProps({
    cd: {
        type: Number,
        default: 1500
    }
});

const _cd = computed({
    get: () => Math.floor(props.cd),
    set: _cd => {
        const cd = Math.floor(_cd);
        if (cd !== props.cd) {
            router.replace({ query: { cd } });
        }
    }
});

const { values, setCD } = useServerInfoReceiver(_cd.value);

watch(_cd, cd => {
    console.log("更改数据刷新速率", cd, "ms");
    setCD(cd);
    Message.success(`数据刷新速率：${cd}ms`);
});

const pageHeaderBoxShadow = ref();

function on_main_scrollbar_scroll(event) {
    pageHeaderBoxShadow.value = event.target?.scrollTop === 0 ? undefined : "var(--bs-shadow)";
}

const settingsDrawer = reactive({
    visible: false,
    loadding: false,
    reboot: async () => {
        settingsDrawer.loadding = true;
        const resp = await http.os.reboot();
        console.log("settingsDrawer.reboot:", resp);
        if (resp.code === 0) {
            Message.success("服务器重启成功");
            settingsDrawer.visible = false;
            resetValues()
        } else {
            Message.error("服务器重启失败");
        }
        settingsDrawer.loadding = false;
    },
    shutdown: async () => {
        settingsDrawer.loadding = true;
        const resp = await http.os.shutdown();
        console.log("settingsDrawer.reboot:", resp);
        if (resp.code === 0) {
            Message.success("服务器关机成功");
            settingsDrawer.visible = false;
            resetValues()
        } else {
            Message.error("服务器关机失败");
        }
        settingsDrawer.loadding = false;
    },
    stop: async () => {
        settingsDrawer.loadding = true;
        const resp = await http.os.stop();
        console.log("settingsDrawer.reboot:", resp);
        if (resp.code === 0) {
            Message.success("停止服务器进程成功");
            settingsDrawer.visible = false;
            resetValues()
        } else {
            Message.error("停止服务器进程失败");
        }
        settingsDrawer.loadding = false;
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

/**
 * @typedef {import("./scripts/interface").DiskValueType} DiskValueType
 */

// 双列
const doubleColDisks = computed(() => {
    /**
     * @type { {index:number,disk:DiskValueType}[][] }
     */
    const result = [[], []];
    values.value.disks.forEach((disk, index) => {
        if (index % 2 === 0 || index === 1) {
            result[0].push({ index, disk });
        } else {
            result[1].push({ index, disk });
        }
    })
    return result;
});

// 三列
const tripleColDisks = computed(() => {
    /**
     * @type { {index:number,disk:DiskValueType}[][] }
     */
    const result = [[], [], []];
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
    })
    return result;
});

</script>

<template>
    <ALayout>
        <ALayoutHeader :style="{ zIndex: 101, boxShadow: pageHeaderBoxShadow }">
            <APageHeader @back="$router.push({ name: 'index' })">
                <template #title>
                    <span> 控制中心 </span>
                </template>
                <template #extra>
                    <ASpace>
                        <AInputNumber v-if="appConfigs.client.width > 576" v-model="_cd" :min="500" hide-button
                            :style="{ maxWidth: '12em' }">
                            <template #prefix>
                                <span>刷新速率</span>
                            </template>
                            <template #suffix>
                                <span>ms</span>
                            </template>
                        </AInputNumber>
                        <AButton v-if="userStore.admin" type="text" shape="circle" style="color:var(--color-text-2)"
                            @click="settingsDrawer.visible = true">
                            <i class="fa-solid fa-gear"></i>
                        </AButton>
                    </ASpace>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent>
            <AScrollbar class="main-scrollbar" outer-class="main-scrollbar-out" @scroll="on_main_scrollbar_scroll">
                <ACard class="main-card" :header-style="{ height: 'auto' }" style="background-color: var(--color-bg-1)">
                    <template #title>
                        <div>
                            <h1 style="text-align: center;user-select: none;margin: 0;font-size: 1.5rem">
                                <i class="fa-solid fa-server fa-fw"></i>
                                服务器状态监控
                            </h1>
                        </div>
                    </template>
                    <!-- width < 768px 时单列 -->
                    <template v-if="appConfigs.client.width < 768">
                        <ARow class="single-my-row" :gutter="10" align="start">
                            <ACol class="my-col">
                                <CpuCard :value="values.cpu" :loading="!values.cpu" :enabled="cpuEnabled" />
                            </ACol>

                            <ACol class="my-col">
                                <MemoryCard :value="values.memory" :process-count="values.os?.processCount"
                                    :loading="!values.memory" :enabled="memoryEnabled" />
                            </ACol>

                            <ACol class="my-col">
                                <NetworkCard :values="values.networks" :loading="values.networks.length === 0"
                                    :enabled="networkEnabled" />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol v-for="(disk, index) in values.disks" class="my-col" :key="index">
                                    <DiskCard :value="disk" :disk-index="index" />
                                </ACol>
                            </TransitionGroup>

                        </ARow>
                    </template>
                    <!-- 768px <= width < 1200px 时双列 -->
                    <template v-else-if="appConfigs.client.width < 1200">
                        <ARow class="double-my-row" :gutter="10" align="start" style="margin-right: 10px;">
                            <ACol class="my-col">
                                <CpuCard :value="values.cpu" :loading="!values.cpu" :enabled="cpuEnabled" />
                            </ACol>

                            <ACol class="my-col">
                                <NetworkCard :values="values.networks" :loading="values.networks.length === 0"
                                    :enabled="networkEnabled" />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol v-for="{ disk, index } in doubleColDisks[1]" class="my-col" :key="index">
                                    <DiskCard :value="disk" :disk-index="index" />
                                </ACol>
                            </TransitionGroup>

                        </ARow>

                        <ARow class="double-my-row" :gutter="10" align="start">
                            <ACol class="my-col">
                                <MemoryCard :value="values.memory" :process-count="values.os?.processCount"
                                    :loading="!values.memory" :enabled="memoryEnabled" />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol v-for="{ disk, index } in doubleColDisks[0]" class="my-col" :key="index">
                                    <DiskCard :value="disk" :disk-index="index" />
                                </ACol>
                            </TransitionGroup>

                        </ARow>
                    </template>
                    <!-- 1200px <= width 时三列-->
                    <template v-else>
                        <ARow class="triple-my-row" :gutter="10" align="start" style="margin-right: 10px;">
                            <ACol class="my-col">
                                <CpuCard :value="values.cpu" :loading="!values.cpu" :enabled="cpuEnabled" />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol v-for="{ disk, index } in tripleColDisks[0]" class="my-col" :key="index">
                                    <DiskCard :value="disk" :disk-index="index" />
                                </ACol>
                            </TransitionGroup>

                        </ARow>

                        <ARow class="triple-my-row" :gutter="10" align="start" style="margin-right: 10px;">
                            <ACol class="my-col">
                                <MemoryCard :value="values.memory" :process-count="values.os?.processCount"
                                    :loading="!values.memory" :enabled="memoryEnabled" />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol v-for="{ disk, index }  in tripleColDisks[1]" class="my-col" :key="index">
                                    <DiskCard :value="disk" :disk-index="index" />
                                </ACol>
                            </TransitionGroup>

                        </ARow>

                        <ARow class="triple-my-row" :gutter="10" align="start">
                            <ACol class="my-col">
                                <NetworkCard :values="values.networks" :loading="values.networks.length === 0"
                                    :enabled="networkEnabled" />
                            </ACol>

                            <TransitionGroup name="body">
                                <ACol v-for="{ disk, index } in tripleColDisks[2]" class="my-col" :key="index">
                                    <DiskCard :value="disk" :disk-index="index" />
                                </ACol>
                            </TransitionGroup>

                        </ARow>
                    </template>
                </ACard>
            </AScrollbar>
        </ALayoutContent>
    </ALayout>

    <ADrawer v-model:visible="settingsDrawer.visible" title="服务器操作" :footer="false">
        <ASpace direction="vertical" fill>
            <AInputNumber v-if="appConfigs.client.width <= 576" v-model="_cd" :min="500" hide-button>
                <template #prefix>
                    <span>刷新速率</span>
                </template>
                <template #suffix>
                    <span>ms</span>
                </template>
            </AInputNumber>

            <APopconfirm content="确认重启？" position="bottom" type="warning" @ok="settingsDrawer.reboot">
                <AButton type="primary" long status="warning" size="large" :loading="settingsDrawer.loadding">
                    <template #icon>
                        <i class="fa-solid fa-plug-circle-bolt fa-fw"></i>
                    </template>
                    重启
                </AButton>
            </APopconfirm>

            <APopconfirm content="确认关机？" position="bottom" type="warning" @ok="settingsDrawer.shutdown">
                <AButton type="primary" long status="danger" size="large" :loading="settingsDrawer.loadding">
                    <template #icon>
                        <i class="fa-solid fa-power-off fa-fw"></i>
                    </template>
                    关机
                </AButton>
            </APopconfirm>

            <APopconfirm content="确认停止服务器进程？" position="bottom" @ok="settingsDrawer.stop">
                <AButton type="primary" long size="large" :loading="settingsDrawer.loadding">
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
@import url(./styles/card-transition.css);

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

.single-my-row {
    width: 100%;
}

.double-my-row {
    width: 50%;
}

.triple-my-row {
    width: 33.333%;
}
</style>