<script setup>
import { onMounted, ref } from "vue";
import { Notification } from '@arco-design/web-vue';
import Switch from "./MySwitch.vue";
import http from "@/scripts/server-api";
import { useAppConfigs } from "@/store/AppConfigsStore";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = window.getComputedStyle(document.body).backgroundColor;

const switchStatus = ref(false);

onMounted(async () => {
    try {
        let resp = await http.v2ray.state();
        console.log("v2rayState:", resp);
        switchStatus.value = resp["code"] === 1;
    } catch (ignored) {
    }
});

async function on_switch_clicked() {
    try {
        if (switchStatus.value) {
            let resp = await http.v2ray.stop();
            console.log("v2rayStop:", resp);
            switch (resp["code"]) {
                case 0: {
                    switchStatus.value = false;
                    break;
                }
                case 1: {
                    Notification.error(resp["msg"]);
                    break;
                }
                case 2: {
                    switchStatus.value = false;
                    Notification.error(resp["msg"]);
                    break;
                }
                case 101: {
                    Notification.error("没有管理员权限");
                    break;
                }
            }
        } else {
            let resp = await http.v2ray.start();
            console.log("v2rayStart:", resp);
            switch (resp["code"]) {
                case 0: {
                    switchStatus.value = true;
                    break;
                }
                case 1: {
                    Notification.error(resp["msg"]);
                    break;
                }
                case 2: {
                    switchStatus.value = true;
                    Notification.error(resp["msg"]);
                    break;
                }
                case 101: {
                    Notification.error("没有管理员权限");
                    break;
                }
            }
        }
    } catch (error) {
        console.error("(on_switch_clicked)", `url:${error.config?.url}`, error);
        Notification.error("服务器错误")
    }
}
</script>

<template>
    <a-layout>
        <a-layout-content>
            <a-row justify="center">
                <a-col :style="{ marginTop: '7rem', maxWidth: '480px' }">
                    <a-card style="box-shadow: var(--box-shadow-light)">
                        <template #title>
                            <div style="font-weight: 700;font-size: 1.4rem;text-align: center;">V2Ray开关</div>
                        </template>
                        <div class="card-body">
                            <Switch v-model:modal-status="switchStatus" @click="on_switch_clicked" />
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>
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