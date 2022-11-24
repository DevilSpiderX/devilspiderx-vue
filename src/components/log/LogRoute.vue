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

const log = reactive({
    list: [],
    name: "now.log",
    text: "",
    fontSize: toRef(appConfigs.log, "fontSize"),
    loading: false
});

const router = useRouter();
(async () => {
    try {
        let resp = await http.log.list();
        console.log("logList:", resp);
        log.list = resp;
    } catch (error) {
        console.error("(setup)", `url:${error.config?.url}`, error);
        router.push({ name: "login" });
    }
})();
const logSelectOptions = computed(() => {
    const result = [];
    for (const logName of log.list) {
        result.push({ value: logName, label: logName.replaceAll(".log", "") })
    }
    return result;
});


const logMonitor = ref();
watchEffect(async () => {
    log.loading = true;
    try {
        let resp = await http.log.logFile(log.name);
        if (Object.hasOwn(resp, "code") && (resp.code === 100 || resp.code === 101)) {
            router.push({ name: "login" });
            return;
        }
        log.text = resp;
        logMonitor.value.backTop();
    } catch (error) {
        console.error("获取日志出现错误", `url:${error.config?.url}`, error)
        log.text = '';
    }
    log.loading = false;
})

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
        <a-layout-header style="border-bottom: 1px solid #84858d55;max-height: 65px">
            <a-page-header @back="$router.back">
                <template #title>
                    <span> 日志 </span>
                </template>
                <template #extra>
                    <a-button v-if="appConfigs.window.width <= 576" type="text"
                        @click="collapseList.show = !collapseList.show">
                        <template #icon>
                            <span style="font-size: 1.2rem;color:var(--color-text-2)">
                                <i class="fa-solid fa-bars fa-fw" />
                            </span>
                        </template>
                    </a-button>
                    <a-space v-else>
                        <span v-show="appConfigs.window.width > 768">日志:</span>
                        <a-select v-model="log.name" :options="logSelectOptions" style="width: 11em" />
                        <a-tooltip v-if="appConfigs.window.width <= 768" :content="String(log.fontSize)" mini>
                            <a-button shape="round" @click="logFontSizeModal.visible = true">字体大小</a-button>
                        </a-tooltip>
                        <a-input-number v-else v-model="log.fontSize" :min="12" :max="50" mode="button" read-only
                            style="max-width: 13em">
                            <template #prefix>
                                <span>字体大小</span>
                            </template>
                        </a-input-number>
                    </a-space>
                </template>
            </a-page-header>
        </a-layout-header>
        <div v-if="appConfigs.window.width <= 576">
            <transition name="collapse">
                <div class="collapseList" v-show="collapseList.show">
                    <a-form :model="collapseList" auto-label-width>
                        <a-form-item label="日志：">
                            <a-select v-model="log.name" :options="logSelectOptions"
                                @change="collapseList.show = false" />
                        </a-form-item>
                        <a-form-item label="字体大小：">
                            <a-input-number v-model="log.fontSize" :min="12" :max="50" mode="button" read-only />
                        </a-form-item>
                    </a-form>
                </div>
            </transition>
        </div>
        <a-layout-content style="height:calc(100% - 65px)">
            <a-row justify="center" align="center" style="height:100%">
                <a-col style="height:calc(100% - 16px)" :xs="24" :sm="23" :md="22" :lg="21" :xl="20" :xxl="19">
                    <log-monitor :text="log.text" :font-size="log.fontSize" ref="logMonitor" :loading="log.loading" />
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>
    <a-modal title="日志字体大小" v-model:visible="logFontSizeModal.visible" width="auto" simple :footer="false">
        <a-input-number v-model="log.fontSize" :min="12" :max="50" mode="button" read-only style="max-width: 15em" />
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
    opacity: 0;
}

.collapse-enter-to,
.collapse-leave-from {
    transform: scaleY(1);
    opacity: 1;
}
</style>