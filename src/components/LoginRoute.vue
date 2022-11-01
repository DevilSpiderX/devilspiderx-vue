<template>
    <a-layout>
        <a-layout-content style="padding: 0;overflow: visible;">
            <a-row justify="center">
                <a-col class="register-col">
                    <a-form :model="form" @submit.prevent="form_submit">
                        <h1 style="text-align: center;font-size: 2.5rem;color: var(--color-text-1);">
                            登&nbsp;&nbsp;录
                        </h1>
                        <a-form-item hide-label>
                            <a-input class="my-input" placeholder="账号" ref="user" v-model="form.uid" allow-clear
                                     :input-attrs="{style:{'font-size':'1.1rem'}}">
                                <template #prefix>
                                    <span><i class="fas fa-user fa-fw"></i></span>
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item hide-label>
                            <a-input-password class="my-input" placeholder="密码" ref="password" v-model="form.pwd"
                                              allow-clear :input-attrs="{style:{'font-size':'1.1rem'}}">
                                <template #prefix>
                                    <span><i class="fas fa-key fa-fw"></i></span>
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-row class="button-row" justify="space-around">
                            <a-button type="primary" size="large" native-type="submit" auto-insert-space>
                                登录
                            </a-button>
                            <a-button type="primary" size="large" native-type="button" auto-insert-space
                                      @click="this.$router.push({name:'register'})">注册
                            </a-button>
                        </a-row>
                    </a-form>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>

    <div class="running" v-show="running.show">
        <i class="fas fa-spinner fa-spin"></i>
    </div>
</template>

<script>
import {login} from "/src/js/server-api.js";
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
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
        let loginUid = localStorage.loginUid;
        if (loginUid !== undefined) {
            this.form.uid = loginUid;
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
            this.setThemeColor("#808080");
            this.running.show = true;
        },
        running_stop() {
            this.running.show = false;
            this.setThemeColor("#ffffff");
        }
    }
}
</script>

<style scoped>
.register-col {
    border-radius: 2ex;
    max-width: 500px;
    margin-top: 100px;
    background-color: var(--color-bg-2);
    box-shadow: var(--box-shadow-dark);
    padding: 15px;
}

form > h1,
form > div {
    margin: 10px 0;
}

.button-row > button {
    margin: 10px 0;
    width: 100px;
    height: 50px;
    font-size: 1.25rem;
}

.my-input {
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