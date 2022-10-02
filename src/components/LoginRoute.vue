<template>
    <el-container>
        <el-main style="padding: 0;overflow: visible;">
            <el-row justify="center">
                <el-col class="register-col">
                    <el-form :model="form" @submit.prevent="form_submit">
                        <h1 style="text-align: center;font-size: 2rem;">登&nbsp;&nbsp;录</h1>
                        <el-form-item>
                            <el-input placeholder="账号" ref="user" v-model="form.uid">
                                <template #prepend>
                                        <span style="color: rgb(73,80,87);">
                                            <i class="fas fa-user fa-fw"></i>
                                        </span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input type="password" placeholder="密码" ref="password" v-model="form.pwd"
                                      show-password>
                                <template #prepend>
                                        <span style="color: rgb(73,80,87);">
                                            <i class="fas fa-key fa-fw"></i>
                                        </span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-row class="button-row" justify="space-around">
                            <el-button type="primary" size="large" native-type="submit" auto-insert-space>
                                登录
                            </el-button>
                            <el-button type="primary" size="large" native-type="button" auto-insert-space
                                       @click="this.$router.push({name:'register'})">注册
                            </el-button>
                        </el-row>
                    </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>

    <div class="running" v-show="running.show">
        <i class="fas fa-spinner fa-spin"></i>
    </div>
</template>

<script>
import {login} from "@/js/server-api";
import SHA256 from 'crypto-js/sha256';
import Hex from 'crypto-js/enc-hex';
import {ElMessage} from "element-plus";

export default {
    name: "LoginRoute",
    data() {
        return {
            form: {
                uid: "",
                pwd: ""
            },
            running: {
                show: false
            }
        }
    },
    methods: {
        form_submit() {
            let uid = this.form.uid;
            let pwd = this.form.pwd;
            if (uid === "") {
                this.$refs.user.focus();
                return;
            }
            if (pwd === "") {
                this.$refs.password.focus();
                return;
            }
            this.storageAccount(uid, true);

            this.running_start()
            pwd = SHA256(pwd).toString(Hex);
            login(uid, pwd, function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        this.$router.push({name: "index"});
                        break;
                    }
                    case 1: {
                        ElMessage.error({message: "密码错误", grouping: true});
                        break;
                    }
                    case 2: {
                        ElMessage.error({message: "账号不存在", grouping: true});
                        break;
                    }
                }
                this.running_stop();
            }.bind(this), function () {
                ElMessage.error({message: "服务器错误", grouping: true});
                this.running_stop();
            }.bind(this));
        },
        storageAccount(uid, allow) {
            if (allow) {
                localStorage.loginUid = uid;
            } else {
                localStorage.removeItem("loginUid");
            }
        },
        running_start() {
            this.setThemeColor("#262626");
            this.running.show = true;
        },
        running_stop() {
            this.running.show = false;
            this.setThemeColor("#dcdcdc");
        }
    },
    beforeMount() {
        this.setThemeColor("#dcdcdc");
    },
    mounted() {
        let loginUid = localStorage.loginUid;
        if (loginUid !== undefined) {
            this.form.uid = loginUid;
        }

    }
}
</script>

<style scoped>
.register-col {
    border-radius: 2ex;
    max-width: 500px;
    margin-top: 100px;
    background-color: white;
    box-shadow: var(--el-box-shadow);
    padding: 15px;
}

form > h1,
form > div {
    margin: 20px 0;
}

.button-row > button {
    margin: 10px 0;
    width: 100px;
    height: 50px;
    font-size: 1.25rem;
}

.el-input {
    font-size: 1.1rem;
    height: 3rem;
}

.running {
    width: 100%;
    height: 100%;
    background-color: #0000007f;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.running > i {
    font-size: 50px;
    color: white;
}
</style>