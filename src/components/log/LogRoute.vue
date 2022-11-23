<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, toRef, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAppConfigs } from "@/store/AppConfigsStore";
import http from "@/scripts/server-api";
import LogMonitor from "./LogMonitor.vue";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = window.getComputedStyle(document.body).backgroundColor;

onMounted(() => {
    document.body.classList.add("no-scrollbar");
});

onUnmounted(() => {
    document.body.classList.remove("no-scrollbar");
});


const logList = ref([]);
const router = useRouter();
(async () => {
    try {
        let resp = await http.log.list();
        console.log("logList:", resp);
        logList.value = resp;
    } catch (error) {
        console.error("(setup)", `url:${error.config?.url}`, error);
        router.push({ name: "login" });
    }
})();
const logSelectOptions = computed(() => {
    const result = [];
    for (const logName of logList.value) {
        result.push({ value: logName, label: logName.replaceAll(".log", "") })
    }
    return result;
});


const logName = ref("now.log");
const logText = ref("");
const logMonitor = ref();
watchEffect(async () => {
    let resp = await http.log.logFile(logName.value);
    if (Object.hasOwn(resp, "code") && (resp.code === 100 || resp.code === 101)) {
        router.push({ name: "login" });
        return;
    }
    logText.value = resp;
    logMonitor.value.backTop();
})

const logFontSize = toRef(appConfigs.log, "fontSize");

const logFontSizeModal = reactive({
    visible: false
});

watch(() => logFontSizeModal.visible, newVal => {
    appConfigs.statusBarColor = newVal ? appConfigs.darkTheme ? "#17171a" : "#777a7f"
        : window.getComputedStyle(document.body).backgroundColor;
});

const collapseList = reactive({
    show: false,
    form: {}
})

</script>

<template>
    <a-layout style="height:100%">
        <a-layout-header style="border-bottom: 1px solid #84858d55;">
            <a-page-header @back="$router.back">
                <template #title>
                    <span style="font-weight:700;"> DevilSpiderX </span>
                </template>
                <template #extra>
                    <a-space v-if="appConfigs.window.width > 576">
                        <a-select v-model="logName" :options="logSelectOptions" style="width: 11em" />
                        <a-tooltip :content="String(logFontSize)" mini>
                            <a-button shape="round" @click="logFontSizeModal.visible = true">字体大小</a-button>
                        </a-tooltip>
                    </a-space>
                    <a-button v-if="appConfigs.window.width <= 576" @click="collapseList.show = !collapseList.show">
                        <template #icon>
                            <span style="font-size: 1.2rem;position: relative">
                                <i class="fa-solid fa-bars fa-fw" />
                            </span>
                        </template>
                    </a-button>
                </template>
            </a-page-header>
        </a-layout-header>
        <div v-if="appConfigs.window.width <= 576">
            <transition name="collapse">
                <div class="collapseList" v-show="collapseList.show">
                    <a-form :model="collapseList" auto-label-width>
                        <a-form-item label="日志：">
                            <a-select v-model="logName" :options="logSelectOptions"
                                @change="collapseList.show = false" />
                        </a-form-item>
                        <a-form-item label="字体大小：">
                            <a-input-number v-model="logFontSize" :min="12" :max="50" mode="button" read-only />
                        </a-form-item>
                    </a-form>
                </div>
            </transition>
        </div>
        <a-layout-content style="height:calc(100% - 65px)">
            <a-row justify="center" align="center" style="height:100%">
                <a-col style="height:calc(100% - 16px)" :xs="24" :sm="23" :md="22" :lg="21" :xl="20" :xxl="19">
                    <log-monitor width="100%" height="100%" :text="logText" :font-size="logFontSize" ref="logMonitor" />
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>
    <a-modal title="日志字体大小" v-model:visible="logFontSizeModal.visible" width="auto" simple :footer="false">
        <a-input-number v-model="logFontSize" :min="12" :max="50" mode="button" />
    </a-modal>
</template>

<style scoped>
.collapseList {
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    padding-bottom: 0;
    z-index: 101;
    color: var(--color-text-1);
    background-color: var(--color-bg-1);
    border-bottom: 1px solid #84858d55;
    position: absolute;
    overflow: hidden;
    transform-origin: top;
}

.collapse-enter-active,
.collapse-leave-active {
    transition: all 300ms ease-in-out;
}

.collapse-enter-from,
.collapse-leave-to {
    transform: scaleY(0);
}

.collapse-enter-to,
.collapse-leave-from {
    transform: scaleY(1);
}
</style>