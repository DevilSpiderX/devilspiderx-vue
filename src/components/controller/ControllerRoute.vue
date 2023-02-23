<script setup>
import { http } from "@/scripts/http";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { Message, Scrollbar as AScrollbar } from "@arco-design/web-vue";
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { CpuCard, DiskCard, MemoryCard, NetworkCard } from "./components";
import { useServerInfoReceiver } from "./hooks/server-info-receiver";

const appConfigs = useAppConfigs();

const router = useRouter();

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

const speedModal = reactive({
    visible: false
});

const cardsProps = reactive({
    class: "my-col",
    xs: 24,
    md: 12,
    xl: 8
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

function resetValues() {
    values.cpu.cpuTemperature = 0;
    values.cpu.usedRate = 0;
    values.memory.used = 0;
    values.memory.free = values.memory.total;
    values.os.processCount = 0;
    values.network.uploadSpeed = 0;
    values.network.downloadSpeed = 0;
}

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
                        <ATooltip v-if="appConfigs.client.width <= 576" :content="String(_cd)" mini>
                            <AButton shape="round" @click="speedModal.visible = true">刷新速率</AButton>
                        </ATooltip>
                        <AInputNumber v-else v-model="_cd" :min="500" hide-button style="max-width: 12em">
                            <template #prefix>
                                <span>刷新速率</span>
                            </template>
                            <template #suffix>
                                <span>ms</span>
                            </template>
                        </AInputNumber>
                        <AButton v-if="appConfigs.user.admin" type="text" shape="circle" style="color:var(--color-text-2)"
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
                    <ARow :gutter="10" align="stretch">
                        <ACol v-bind="cardsProps">
                            <CpuCard :value="values.cpu" :loading="!values.cpu" />
                        </ACol>
                        <ACol v-bind="cardsProps">
                            <MemoryCard :value="values.memory" :process-count="values.os?.processCount"
                                :loading="!values.memory" />
                        </ACol>
                        <ACol v-bind="cardsProps">
                            <NetworkCard :value="values.network" :loading="!values.network" />
                        </ACol>
                        <TransitionGroup name="body">
                            <ACol v-for="(disk, index) in values.disk" v-bind="cardsProps" :key="index">
                                <DiskCard :value="disk" :disk-index="index" />
                            </ACol>
                        </TransitionGroup>
                    </ARow>
                </ACard>
            </AScrollbar>
        </ALayoutContent>
    </ALayout>
    <AModal title="数据刷新速率" v-model:visible="speedModal.visible" width="auto" simple :footer="false">
        <AInputNumber v-model="_cd" @change="speedModal.visible = false" :min="500" hide-button style="max-width: 15em">
            <template #suffix>
                <span>ms</span>
            </template>
        </AInputNumber>
    </AModal>
    <ADrawer v-model:visible="settingsDrawer.visible" title="服务器操作" :footer="false">
        <ASpace direction="vertical" fill>
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
</style>