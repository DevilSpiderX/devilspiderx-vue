<script setup>
import { start as startApi, state as stateApi, stop as stopApi } from "@/api/v2ray-api";
import { getLogger } from "@/plugins/logger";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { useUserStore } from "@/store/UserStore";
import { Message } from "@arco-design/web-vue";
import { onMounted, ref } from "vue";
import { MySwitch } from "./components";

const logger = getLogger(import.meta.filePath);
const appConfigs = useAppConfigs(),
    userStore = useUserStore();

const switchStatus = ref(false);

onMounted(async () => {
    try {
        const resp = await stateApi();
        logger.set(import.meta.codeLineNum).info("v2rayState:", resp);
        switchStatus.value = resp;
    } catch (ignored) {}
});

async function on_switch_clicked() {
    try {
        if (switchStatus.value) {
            const resp = await stopApi();
            logger.set(import.meta.codeLineNum).info("v2rayStop:", resp);
            switch (resp) {
                case 0: {
                    switchStatus.value = false;
                    break;
                }
                case 1: {
                    Message.error("v2ray关闭失败");
                    break;
                }
                case 2: {
                    switchStatus.value = false;
                    Message.error("v2ray没有运行");
                    break;
                }
            }
        } else {
            const resp = await startApi();
            logger.set(import.meta.codeLineNum).info("v2rayStart:", resp);
            switch (resp) {
                case 0: {
                    switchStatus.value = true;
                    break;
                }
                case 1: {
                    Message.error("v2ray启动失败");
                    break;
                }
                case 2: {
                    switchStatus.value = true;
                    Message.error("v2ray正在运行");
                    break;
                }
            }
        }
    } catch (error) {
        logger.set(import.meta.codeLineNum).error(`url:${error.config?.url}`, error);
        Message.error("服务器错误");
    }
}

const settingsDrawer = ref({
    visible: false,
    loadding: false,
});
</script>

<template>
    <ALayout>
        <ALayoutHeader>
            <APageHeader @back="$router.push({ name: 'index' })">
                <template #title>
                    <span>V2Ray</span>
                </template>
                <template #extra>
                    <ASpace>
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
            <ARow justify="center">
                <ACol :style="{ marginTop: '5rem', maxWidth: '480px' }">
                    <ACard style="box-shadow: var(--el-box-shadow-light)">
                        <template #title>
                            <div style="font-weight: 700; font-size: 1.4rem; text-align: center">V2Ray开关</div>
                        </template>
                        <div class="card-body">
                            <MySwitch
                                v-model:modal-status="switchStatus"
                                @click="on_switch_clicked"
                            />
                        </div>
                    </ACard>
                </ACol>
            </ARow>
        </ALayoutContent>
    </ALayout>

    <ADrawer
        v-model:visible="settingsDrawer.visible"
        title="设置"
        :footer="false"
    >
        <ASpace
            direction="vertical"
            fill
        ></ASpace>
    </ADrawer>
</template>

<style scoped>
.card-body {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 12rem;
}
</style>
