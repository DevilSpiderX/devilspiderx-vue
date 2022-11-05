<template>
    <a-layout>
        <a-layout-content>
            <a-row justify="center">
                <a-col :style="{marginTop: '7rem',maxWidth:'480px'}">
                    <a-card style="box-shadow: var(--box-shadow-light)">
                        <template #title>
                            <div style="font-weight: 700;font-size: 1.4rem;text-align: center;">V2Ray开关</div>
                        </template>
                        <div class="card-body">
                            <Switch v-model:modal-status="switchStatus" @click="on_switch_clicked"/>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>
</template>

<script>
import Switch from "/src/components/v2ray/MySwitch.vue";
import { Notification } from '@arco-design/web-vue';
import http from "/src/scripts/server-api";

export default {
    name: "V2rayRoute",
    components: {
        Switch
    },
    data() {
        return {
            switchStatus: false
        }
    },
    methods: {
        async on_switch_clicked() {
            try {
                if (this.switchStatus) {
                    let resp = await http.v2rayStop();
                    console.log("v2rayStop:", resp);
                    switch (resp["code"]) {
                        case 0: {
                            this.switchStatus = false;
                            break;
                        }
                        case 1: {
                            Notification.error(resp["msg"]);
                            break;
                        }
                        case 2: {
                            this.switchStatus = false;
                            Notification.error(resp["msg"]);
                            break;
                        }
                        case 101: {
                            Notification.error("没有管理员权限");
                            break;
                        }
                    }
                } else {
                    let resp = await http.v2rayStart();
                    console.log("v2rayStart:", resp);
                    switch (resp["code"]) {
                        case 0: {
                            this.switchStatus = true;
                            break;
                        }
                        case 1: {
                            Notification.error(resp["msg"]);
                            break;
                        }
                        case 2: {
                            this.switchStatus = true;
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
                console.error("on_switch_clicked:", error);
                Notification.error("服务器错误")
            }
        }
    },
    beforeMount() {
        this.setThemeColor(window.getComputedStyle(document.body).backgroundColor);
    },
    async mounted() {
        let resp = await http.v2rayState();
        console.log("v2rayState:", resp);
        this.switchStatus = resp["code"] === 1;
    }
}
</script>

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