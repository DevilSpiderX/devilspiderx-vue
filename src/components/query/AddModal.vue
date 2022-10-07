<template>
    <el-dialog v-model="visible" title="添加密码记录" :width="width">
        <el-form :model="form" @submit.prevent="form_submit">
            <el-form-item>
                <el-input placeholder="名称" ref="name" v-model="form.name">
                    <template #prefix>
                    <span style="color: rgb(73,80,87);">
                        <i class="fas fa-tag fa-fw"></i>
                    </span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="账号" v-model="form.account">
                    <template #prefix>
                    <span style="color: rgb(73,80,87);">
                        <i class="fas fa-user fa-fw"></i>
                    </span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="密码" v-model="form.password">
                    <template #prefix>
                    <span style="color: rgb(73,80,87);">
                        <i class="fas fa-key fa-fw"></i>
                    </span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="备注" v-model="form.remark">
                    <template #prefix>
                    <span style="color: rgb(73,80,87);">
                        <i class="fas fa-info fa-fw"></i>
                    </span>
                    </template>
                </el-input>
            </el-form-item>
            <button type="submit" v-show="false"></button>
        </el-form>
        <template #footer>
            <el-button type="primary" auto-insert-space @click="form_submit" style="margin-right: 10px;">
                添加
            </el-button>
            <el-button auto-insert-space @click="cancel_click">取消</el-button>
        </template>
    </el-dialog>
</template>

<script>
export default {
    name: "AddModal",
    data() {
        return {
            visible: false,
            form: {
                name: "",
                account: "",
                password: "",
                remark: ""
            },
            width: "50%"
        }
    },
    props: {
        open: Boolean,
        clean: Boolean
    },
    watch: {
        open(newVal, oldVal) {
            if (this.visible === oldVal) {
                this.visible = newVal;
            }
        },
        visible(newVal, oldVal) {
            if (this.$props.open === oldVal) {
                this.$emit("update:open", newVal);
            }
        },
        clean(newVal) {
            if (newVal) {
                this.CleanData();
            }
        }
    },
    emits: ["submit", "update:open"],
    mounted() {
        this.$nextTick(this.window_resize.bind(this));
        window.addEventListener("resize", this.window_resize.bind(this));
    },
    unmounted() {
        window.removeEventListener("resize", this.window_resize.bind(this));
    },
    methods: {
        Open() {
            this.visible = true;
        },
        Close() {
            this.visible = false;
        },
        CleanData() {
            this.form = {name: "", account: "", password: "", remark: ""};
        },
        form_submit() {
            if (this.form.name === "") {
                this.$refs.name.focus();
                return;
            }
            let form_data = {};
            Object.assign(form_data, this.form)
            this.$emit('submit', form_data);
        },
        window_resize() {
            let width = window.innerWidth;
            if (width < 768) {
                this.width = "90%";
            } else if (width >= 768 && width < 992) {
                this.width = "62.5%";
            } else if (width >= 992 && width < 1200) {
                this.width = "48%";
            } else if (width >= 1200 && width < 1920) {
                this.width = "40%";
            } else if (width >= 1920) {
                this.width = "25%";
            }
        },
        cancel_click() {
            this.CleanData();
            this.Close();
        }
    }

}
</script>

<style scoped>
</style>