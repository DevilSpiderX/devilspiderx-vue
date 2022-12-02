<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, toRef, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { IconCaretUp, IconCaretDown, IconLoop } from "@arco-design/web-vue/es/icon"
import { useAppConfigs } from "@/store/AppConfigsStore";
import http from "@/scripts/server-api";
import LogMonitor from "./LogMonitor.vue";

const appConfigs = useAppConfigs();
appConfigs.backgroundColor2StatusBarColor();

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
        console.log("logList:", resp.data);
        log.list = resp.data;
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

async function getLog() {
    log.loading = true;
    try {
        let resp = await http.log.logFile(log.name);
        if (Object.hasOwn(resp, "code") && (resp.code === 100 || resp.code === 101)) {
            router.push({ name: "login" });
            return;
        }
        log.text = resp;
    } catch (error) {
        console.error("获取日志出现错误", `url:${error.config?.url}`, error)
        log.text = '';
    }
    log.loading = false;
}

const logMonitorRef = ref();

watchEffect(async () => {
    await getLog();
    logMonitorRef.value.backTop();
});

const reflush = ref(false);

watch(reflush, async reflushVal => {
    if (reflushVal) {
        await getLog();
        logMonitorRef.value.toBottom(true);
        reflush.value = false;
    }
});

const logFontSizeModal = reactive({
    visible: false
});

watch(() => logFontSizeModal.visible, visible => {
    appConfigs.statusBarColor = visible ? appConfigs.darkTheme ? "#17171a" : "#777a7f"
        : window.getComputedStyle(document.body).backgroundColor;
});

const collapseList = reactive({
    show: false,
    form: {}
})

</script>

<template>
    <ALayout style="height:100%">
        <ALayoutHeader style="border-bottom: 1px solid #84858d55;max-height: 65px">
            <APageHeader @back="$router.back">
                <template #title>
                    <span> 日志 </span>
                </template>
                <template #extra>
                    <AButton v-if="appConfigs.client.width <= 576" type="text"
                        @click="collapseList.show = !collapseList.show">
                        <template #icon>
                            <span style="font-size: 1.2rem;color:var(--color-text-2)">
                                <i class="fa-solid fa-bars fa-fw" />
                            </span>
                        </template>
                    </AButton>
                    <ASpace v-else>
                        <span v-show="appConfigs.client.width > 768" style="color: var(--color-text-1)">日志:</span>
                        <ASelect v-model="log.name" :options="logSelectOptions" style="width: 11em" />
                        <ATooltip v-if="appConfigs.client.width <= 768" :content="String(log.fontSize)" mini>
                            <AButton shape="round" @click="logFontSizeModal.visible = true">字体大小</AButton>
                        </ATooltip>
                        <AInputNumber v-else v-model="log.fontSize" :min="12" :max="50" mode="button" read-only
                            style="max-width: 13em">
                            <template #prefix>
                                <span>字体大小</span>
                            </template>
                        </AInputNumber>
                        <AButtonGroup shape="round">
                            <ATooltip content="回到顶部" position="bottom">
                                <AButton @click="$refs.logMonitorRef.backTop(true)">
                                    <IconCaretUp />
                                </AButton>
                            </ATooltip>
                            <AButton @click="reflush = true" :loading="reflush">
                                <IconLoop v-show="!reflush" />
                            </AButton>
                            <ATooltip content="回到底部" position="br">
                                <AButton @click="$refs.logMonitorRef.toBottom(true)">
                                    <IconCaretDown />
                                </AButton>
                            </ATooltip>
                        </AButtonGroup>
                    </ASpace>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <!-- 这一块是可收缩框 -->
        <div v-if="appConfigs.client.width <= 576">
            <Transition name="collapse">
                <div class="collapseList" v-show="collapseList.show">
                    <AForm :model="collapseList" auto-label-width>
                        <AFormItem label="日志：">
                            <ASelect v-model="log.name" :options="logSelectOptions"
                                @change="collapseList.show = false" />
                        </AFormItem>
                        <AFormItem label="字体大小：">
                            <AInputNumber v-model="log.fontSize" :min="12" :max="50" mode="button" read-only />
                        </AFormItem>
                        <AFormItem hide-label>
                            <ARow justify="end" :style="{ width: '100%' }">
                                <AButtonGroup shape="round">
                                    <AButton @click="$refs.logMonitorRef.backTop(true); collapseList.show = false">
                                        <IconCaretUp />
                                    </AButton>
                                    <AButton @click="reflush = true; collapseList.show = false" :loading="reflush">
                                        <IconLoop v-show="!reflush" />
                                    </AButton>
                                    <AButton @click="$refs.logMonitorRef.toBottom(true); collapseList.show = false">
                                        <IconCaretDown />
                                    </AButton>
                                </AButtonGroup>
                            </ARow>
                        </AFormItem>
                    </AForm>
                </div>
            </Transition>
        </div>
        <ALayoutContent style="height:calc(100% - 65px)">
            <ARow justify="center" style="height:100%">
                <ACol style="height:calc(100% - 3px)" :xs="24" :sm="23" :md="22" :lg="21" :xl="20" :xxl="19">
                    <LogMonitor :text="log.text" :font-size="log.fontSize" ref="logMonitorRef" :loading="log.loading" />
                </ACol>
            </ARow>
        </ALayoutContent>
    </ALayout>
    <AModal title="日志字体大小" v-model:visible="logFontSizeModal.visible" width="auto" simple :footer="false">
        <AInputNumber v-model="log.fontSize" :min="12" :max="50" mode="button" read-only style="max-width: 15em" />
    </AModal>
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