<template>
    <el-container>
        <a-layout-content>
            <el-row justify="center">
                <el-col class="card-container">
                    <el-card>
                        <template #header>
                            <div style="display: flex;justify-content: center;">
                                <span style="font-weight: 700;font-size: 1.4rem;text-align: center;">V2Ray开关</span>
                            </div>
                        </template>
                        <div class="card-body">
                            <Switch ref="v2Switch" @click="on_switch_clicked"/>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </a-layout-content>
    </el-container>
</template>

<script>
import Switch from "/src/components/v2ray/MySwitch.vue";
import {v2rayState, v2rayStart, v2rayStop} from "/src/js/server-api.js";
import {ElMessage} from "element-plus";

export default {
    name: "V2rayRoute",
    components: {
        Switch
    },
    data() {
        return {}
    },
    methods: {
        on_switch_clicked() {
            if (this.$refs.v2Switch.is_on()) {
                v2rayStop(function (resp) {
                    switch (resp["code"]) {
                        case 0: {
                            this.$refs.v2Switch.switch_off();
                            break;
                        }
                        case 1: {
                            ElMessage.error(resp["msg"]);
                            break;
                        }
                        case 2: {
                            this.$refs.v2Switch.switch_off();
                            ElMessage.error(resp["msg"]);
                            break;
                        }
                        case 101: {
                            ElMessage.error("没有管理员权限");
                            break;
                        }
                    }
                }.bind(this), () => {
                    ElMessage.error("服务器错误")
                });
            } else {
                v2rayStart(function (resp) {
                    switch (resp["code"]) {
                        case 0: {
                            this.$refs.v2Switch.switch_on();
                            break;
                        }
                        case 1: {
                            alert(resp["msg"]);
                            break;
                        }
                        case 2: {
                            this.$refs.v2Switch.switch_on();
                            ElMessage.error({message: resp["msg"]});
                            break;
                        }
                        case 101: {
                            ElMessage.error({message: "没有管理员权限"});
                            break;
                        }
                    }
                }.bind(this), () => {
                    ElMessage.error("服务器错误")
                });
            }
        }
    },
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
        v2rayState(function (resp) {
            if (resp["code"] === 1) {
                this.$refs.v2Switch.switch_on();
            } else {
                this.$refs.v2Switch.switch_off();
            }
        }.bind(this));
    }
}
</script>

<style scoped>
.card-container {
    margin-top: 5rem;
    max-width: 480px;
}

.card-body {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 12rem;
}
</style>