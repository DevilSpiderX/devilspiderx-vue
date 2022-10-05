<template>
    <el-container>
        <el-main style="padding: 0;overflow: visible;">
            <el-row justify="center">
                <el-col class="register-col">
                    <el-form :model="form" @submit.prevent="form_submit">
                        <h1 style="text-align: center;font-size: 2.5rem;">注&nbsp;&nbsp;册</h1>
                        <el-form-item>
                            <el-input placeholder="账号" ref="user" v-model="form.uid">
                                <template #prefix>
                                        <span style="color: rgb(73,80,87);">
                                            <i class="fas fa-user fa-fw"></i>
                                        </span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input type="password" placeholder="密码" ref="password" v-model="form.pwd"
                                      show-password>
                                <template #prefix>
                                        <span style="color: rgb(73,80,87);">
                                            <i class="fas fa-key fa-fw"></i>
                                        </span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input type="password" placeholder="再次输入密码" ref="password_again"
                                      v-model="form.pwd_a" show-password>
                                <template #prefix>
                                        <span style="color: rgb(73,80,87);">
                                            <i class="fas fa-key fa-fw"></i>
                                        </span>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-row class="button-row" justify="space-around">
                            <el-button type="primary" size="large" native-type="submit" auto-insert-space>
                                注册
                            </el-button>
                            <el-button type="primary" size="large" native-type="button" auto-insert-space
                                       @click="this.$router.back()">返回
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
import {register} from "@/js/server-api";
import {ElMessage} from "element-plus";

export default {
    name: "RegisterRoute",
    data() {
        return {
            form: {
                uid: "",
                pwd: "",
                pwd_a: ""
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
            let pwd_a = this.form.pwd_a;
            if (uid === "") {
                this.$refs.user.focus();
                return;
            }
            if (pwd === "") {
                this.$refs.password.focus();
                return;
            }
            if (pwd_a === "") {
                this.$refs.password_again.focus();
                return;
            }
            if (pwd !== pwd_a) {
                alert("两次输入的密码不相同");
                return;
            }
            this.running_start();
            register(uid, pwd, function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        this.$router.push({name: "login"});
                        break;
                    }
                    case 1: {
                        ElMessage({
                            type: "error",
                            message: "注册失败",
                            "show-close": true,
                            grouping: true
                        });
                        break;
                    }
                    case 4: {
                        ElMessage({
                            type: "error",
                            message: "用户名已存在\n请换一个用户名",
                            "show-close": true,
                            grouping: true
                        });
                        break;
                    }
                }
                this.running_stop();
            }.bind(this), this.running_stop);
        },
        running_start() {
            this.setThemeColor("#808080");
            this.running.show = true;
        },
        running_stop() {
            this.running.show = false;
            this.setThemeColor("#ffffff");
        }
    },
    beforeMount() {
        this.setThemeColor("#ffffff");
    }
}
</script>

<style scoped>
.register-col {
    border-radius: 2ex;
    max-width: 500px;
    margin-top: 100px;
    background-color: white;
    box-shadow: var(--el-box-shadow-dark);
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

/*noinspection CssUnusedSymbol*/
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