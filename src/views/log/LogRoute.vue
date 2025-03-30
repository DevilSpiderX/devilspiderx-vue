<script setup lang="ts">
import { list as listApi, logFile as logFileApi } from "@/api/log-api.ts";
import { getLogger } from "@/plugins/logger.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { IconCaretDown, IconCaretUp, IconLoop } from "@arco-design/web-vue/es/icon";
import { computed, onMounted, ref, toRef, useTemplateRef, watch } from "vue";
import { LogMonitor } from "./components/index.ts";

const logger = getLogger(import.meta.filePath);
const appConfigs = useAppConfigs();

const logList = ref<string[]>([]);
const logName = ref<string>("");
const logText = ref<string>("");
const logFontSize = toRef(appConfigs.log, "fontSize");
const logLoading = ref<boolean>(false);

const logSelectLoading = ref(false);

onMounted(async () => {
    logSelectLoading.value = true;
    try {
        const resp = await listApi();
        logger.set(import.meta.codeLineNum).info("logList:", resp);
        logList.value = resp;
        logName.value = resp[resp.length - 1];
    } catch (error) {
        logger.set(import.meta.codeLineNum).error(`获取日志列表出现错误`, error);
    } finally {
        logSelectLoading.value = false;
    }
});

const logSelectOptions = computed(() => {
    const result: Array<{ value: string; label: string }> = [];
    for (const logName of logList.value) {
        result.push({ value: logName, label: logName.replaceAll(".log", "") });
    }
    return result;
});

async function getLog(logName: string) {
    logLoading.value = true;
    try {
        const resp = await logFileApi(logName);
        logText.value = resp;
    } catch (error) {
        logger.set(import.meta.codeLineNum).error(`获取日志出现错误`, error);
        logText.value = "";
    } finally {
        logLoading.value = false;
    }
}

const logMonitorRef = useTemplateRef("logMonitorRef");

watch(logName, async logName => {
    await getLog(logName);
    logMonitorRef.value?.backTop();
});

const reflush = ref(false);

async function onReflushButtonClick() {
    reflush.value = true;
    collapseList.value.show = false;
    await getLog(logName.value);
    logMonitorRef.value?.toBottom(true);
    reflush.value = false;
}

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
                            v-model="logName"
                            :options="logSelectOptions"
                            style="width: 11em"
                            :default-active-first-option="false"
                            :loading="logSelectLoading"
                        />
                        <ATooltip
                            v-if="appConfigs.client.width <= 768"
                            :content="String(logFontSize)"
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
                            v-model="logFontSize"
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
                                @click="onReflushButtonClick"
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
                    class="collapse-list"
                    v-show="collapseList.show"
                >
                    <AForm
                        :model="collapseList.form"
                        auto-label-width
                    >
                        <AFormItem label="日志：">
                            <ASelect
                                v-model="logName"
                                :options="logSelectOptions"
                                @change="collapseList.show = false"
                                :default-active-first-option="false"
                                :loading="logSelectLoading"
                            />
                        </AFormItem>
                        <AFormItem label="字体大小：">
                            <AInputNumber
                                v-model="logFontSize"
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
                                        @click="onReflushButtonClick"
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
                        :text="logText"
                        :font-size="logFontSize"
                        :loading="logLoading"
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
            v-model="logFontSize"
            :min="12"
            :max="50"
            mode="button"
            style="max-width: 15em"
        />
    </AModal>
</template>

<style scoped lang="scss">
.arco-layout {
    &,
    &-content {
        width: 100%;
        height: 100%;
    }

    &-content {
        overflow: hidden;
    }
}
</style>

<style scoped lang="scss">
.collapse {
    &-list {
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

    &-enter-active,
    &-leave-active {
        transition: all 300ms ease-in-out;
    }

    &-enter-from,
    &-leave-to {
        transform: scaleY(0);
        opacity: 0;
    }

    &-enter-to,
    &-leave-from {
        transform: scaleY(1);
        opacity: 1;
    }
}
</style>
