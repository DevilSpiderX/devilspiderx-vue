<script setup>
import { http } from "@/scripts/http";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { Notification } from '@arco-design/web-vue';
import { onMounted, ref } from "vue";
import MySwitch from "./MySwitch.vue";

const appConfigs = useAppConfigs();
appConfigs.backgroundColor2StatusBarColor();

const switchStatus = ref(false);

onMounted(async () => {
    try {
        let resp = await http.v2ray.state();
        console.log("v2rayState:", resp);
        switchStatus.value = resp.data;
    } catch (ignored) {
    }
});

async function on_switch_clicked() {
    try {
        if (switchStatus.value) {
            let resp = await http.v2ray.stop();
            console.log("v2rayStop:", resp);
            switch (resp.code) {
                case 0: {
                    switchStatus.value = false;
                    break;
                }
                case 1: {
                    Notification.error(resp.msg);
                    break;
                }
                case 2: {
                    switchStatus.value = false;
                    Notification.error(resp.msg);
                    break;
                }
                case 1003: {
                    Notification.error("没有管理员权限");
                    break;
                }
            }
        } else {
            let resp = await http.v2ray.start();
            console.log("v2rayStart:", resp);
            switch (resp.code) {
                case 0: {
                    switchStatus.value = true;
                    break;
                }
                case 1: {
                    Notification.error(resp.msg);
                    break;
                }
                case 2: {
                    switchStatus.value = true;
                    Notification.error(resp.msg);
                    break;
                }
                case 1003: {
                    Notification.error("没有管理员权限");
                    break;
                }
            }
        }
    } catch (error) {
        console.error("(on_switch_clicked)", `url:${error.config?.url}`, error);
        Notification.error("服务器错误");
    }
}
</script>

<template>
    <ALayout>
        <ALayoutHeader>
            <APageHeader @back="$router.back">
                <template #title>
                    <span> V2Ray </span>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent>
            <ARow justify="center">
                <ACol :style="{ marginTop: '5rem', maxWidth: '480px' }">
                    <ACard style="box-shadow: var(--el-box-shadow-light)">
                        <template #title>
                            <div style="font-weight: 700;font-size: 1.4rem;text-align: center;">V2Ray开关</div>
                        </template>
                        <div class="card-body">
                            <MySwitch v-model:modal-status="switchStatus" @click="on_switch_clicked" />
                        </div>
                    </ACard>
                </ACol>
            </ARow>
        </ALayoutContent>
    </ALayout>
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