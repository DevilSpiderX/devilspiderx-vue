<template>
    <el-container>
        <el-header style="border-bottom: 1px solid #84858d55;">
            <el-page-header title=" " @back="this.$router.back()">
                <template #icon>
                    <i class="fas fa-arrow-left fa-fw" style="font-size: 1.2rem;"></i>
                </template>
                <template #content>
                    <span style="font-weight:700;"> DevilSpiderX </span>
                </template>
            </el-page-header>
        </el-header>
        <el-main>
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
        </el-main>
    </el-container>
</template>

<script>
import Switch from "@/components/v2ray/MySwitch";
import {v2rayState, v2rayStart, v2rayStop} from "@/js/server-api";
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
        this.setThemeColor("#dcdcdc");
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

<style scoped src="../css/nav-back-button.css"></style>

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