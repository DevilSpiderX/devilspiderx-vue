<script setup lang="ts">
import { list as listApi, logFile as logFileApi } from "@/api/log-api.ts";
import { getLogger } from "@/plugins/logger.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { IconCaretDown, IconCaretUp, IconLoop } from "@arco-design/web-vue/es/icon";
import { computed, onMounted, ref, toRef, useTemplateRef, watch, watchEffect } from "vue";
import { LogMonitor } from "./components/index.ts";

const logger = getLogger(import.meta.filePath);
const appConfigs = useAppConfigs();

const log = ref({
    list: ["now.log"],
    name: "now.log",
    text: "",
    fontSize: toRef(appConfigs.log, "fontSize"),
    loading: false,
});

onMounted(async () => {
    try {
        const resp = await listApi();
        logger.set(import.meta.codeLineNum).info("logList:", resp);
        log.value.list = resp;
    } catch (error) {
        logger.set(import.meta.codeLineNum).error(`获取日志列表出现错误`, error);
    }
});

const logSelectOptions = computed(() => {
    const result: Array<{ value: string; label: string }> = [];
    for (const logName of log.value.list) {
        result.push({ value: logName, label: logName.replaceAll(".log", "") });
    }
    return result;
});

async function getLog() {
    log.value.loading = true;
    try {
        const resp = await logFileApi(log.value.name);
        log.value.text = resp;
    } catch (error) {
        logger.set(import.meta.codeLineNum).error(`获取日志出现错误`, error);
        log.value.text = "";
    } finally {
        log.value.loading = false;
    }
}

const logMonitorRef = useTemplateRef("logMonitorRef");

watchEffect(async () => {
    await getLog();
    logMonitorRef.value?.backTop();
});

const reflush = ref(false);

watch(reflush, async reflushVal => {
    if (reflushVal && logMonitorRef.value) {
        await getLog();
        logMonitorRef.value.toBottom(true);
        reflush.value = false;
    }
});

const logFontSizeModal = ref({
    visible: false,
});

const collapseList = ref({
    show: false,
    form: {},
});
</script>

<template>
    <ALayout>
        <ALayoutHeader>
            <APageHeader @back="$router.push({ name: 'index' })">
                <template #title>
                    <span>日志</span>
                </template>
                <template #extra>
                    <AButton
                        v-if="appConfigs.client.width <= 576"
                        type="text"
                        @click="collapseList.show = !collapseList.show"
                    >
                        <template #icon>
                            <span style="font-size: 1.2rem; color: var(--color-text-2)">
                                <i class="fa-solid fa-bars fa-fw" />
                            </span>
                        </template>
                    </AButton>
                    <ASpace v-else>
                        <span v-show="appConfigs.client.width > 768">日志:</span>
                        <ASelect
                            v-model="log.name"
                            :options="logSelectOptions"
                            style="width: 11em"
                        />
                        <ATooltip
                            v-if="appConfigs.client.width <= 768"
                            :content="String(log.fontSize)"
                            mini
                        >
                            <AButton
                                shape="round"
                                @click="logFontSizeModal.visible = true"
                            >
                                字体大小
                            </AButton>
                        </ATooltip>
                        <AInputNumber
                            v-else
                            v-model="log.fontSize"
                            :min="12"
                            :max="50"
                            mode="button"
                            style="max-width: 13em"
                        >
                            <template #prefix>
                                <span>字体大小</span>
                            </template>
                        </AInputNumber>
                        <AButtonGroup shape="round">
                            <ATooltip
                                content="回到顶部"
                                position="bottom"
                            >
                                <AButton @click="logMonitorRef?.backTop(true)">
                                    <IconCaretUp />
                                </AButton>
                            </ATooltip>
                            <AButton
                                @click="reflush = true"
                                :loading="reflush"
                            >
                                <IconLoop v-show="!reflush" />
                            </AButton>
                            <ATooltip
                                content="回到底部"
                                position="br"
                            >
                                <AButton @click="logMonitorRef?.toBottom(true)">
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
                <div
                    class="collapseList"
                    v-show="collapseList.show"
                >
                    <AForm
                        :model="collapseList.form"
                        auto-label-width
                    >
                        <AFormItem label="日志：">
                            <ASelect
                                v-model="log.name"
                                :options="logSelectOptions"
                                @change="collapseList.show = false"
                            />
                        </AFormItem>
                        <AFormItem label="字体大小：">
                            <AInputNumber
                                v-model="log.fontSize"
                                :min="12"
                                :max="50"
                                mode="button"
                            />
                        </AFormItem>
                        <AFormItem hide-label>
                            <ARow
                                justify="end"
                                :style="{ width: '100%' }"
                            >
                                <AButtonGroup shape="round">
                                    <AButton
                                        @click="
                                            logMonitorRef?.backTop(true);
                                            collapseList.show = false;
                                        "
                                    >
                                        <IconCaretUp />
                                    </AButton>
                                    <AButton
                                        @click="
                                            reflush = true;
                                            collapseList.show = false;
                                        "
                                        :loading="reflush"
                                    >
                                        <IconLoop v-show="!reflush" />
                                    </AButton>
                                    <AButton
                                        @click="
                                            logMonitorRef?.toBottom(true);
                                            collapseList.show = false;
                                        "
                                    >
                                        <IconCaretDown />
                                    </AButton>
                                </AButtonGroup>
                            </ARow>
                        </AFormItem>
                    </AForm>
                </div>
            </Transition>
        </div>
        <ALayoutContent>
            <ARow
                justify="center"
                style="height: 100%"
            >
                <ACol
                    style="height: calc(100% - 1px)"
                    :xs="24"
                    :sm="23"
                    :md="22"
                    :lg="21"
                    :xl="20"
                    :xxl="19"
                >
                    <LogMonitor
                        ref="logMonitorRef"
                        :text="log.text"
                        :font-size="log.fontSize"
                        :loading="log.loading"
                    />
                </ACol>
            </ARow>
        </ALayoutContent>
    </ALayout>
    <AModal
        title="日志字体大小"
        v-model:visible="logFontSizeModal.visible"
        width="auto"
        simple
        :footer="false"
    >
        <AInputNumber
            v-model="log.fontSize"
            :min="12"
            :max="50"
            mode="button"
            style="max-width: 15em"
        />
    </AModal>
</template>

<style scoped>
.arco-layout,
.arco-layout-content {
    width: 100%;
    height: 100%;
}

.arco-layout-content {
    overflow: hidden;
}

.collapseList {
    box-sizing: border-box;
    width: 100%;
    padding: 10px 10px 0;
    z-index: 101;
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
    /* opacity: 0; */
}

.collapse-enter-to,
.collapse-leave-from {
    transform: scaleY(1);
    /* opacity: 1; */
}
</style>
