<template>
    <a-modal v-model:visible="visible" title="添加密码记录" :width="width">
        <a-form :model="form" @submit="form_submit">
            <a-form-item field="name" hide-label>
                <a-input placeholder="名称" ref="name" v-model="form.name" allow-clear>
                    <template #prefix>
                        <i class="fas fa-tag fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="account" hide-label>
                <a-input placeholder="账号" v-model="form.account" allow-clear>
                    <template #prefix>
                        <i class="fas fa-user fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="password" hide-label>
                <a-input placeholder="密码" v-model="form.password" allow-clear>
                    <template #prefix>
                        <i class="fas fa-key fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="remark" hide-label>
                <a-input placeholder="备注" v-model="form.remark" allow-clear>
                    <template #prefix>
                        <i class="fas fa-info fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <button type="submit" v-show="false"></button>
        </a-form>
        <template #footer>
            <a-button type="primary" @click="form_submit">
                添 加
            </a-button>
            <a-button @click="cancel_click">取 消</a-button>
        </template>
    </a-modal>
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
            if (newVal) {
                window.addEventListener("resize", this.window_resize);
            } else {
                window.removeEventListener("resize", this.window_resize);
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
        this.$nextTick(this.window_resize);
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
            if (width < 576) {
                this.width = "90%";
            } else if (width < 768) {
                this.width = "83.3%";
            } else if (width < 992) {
                this.width = "62.5%";
            } else if (width < 1200) {
                this.width = "48%";
            } else if (width < 1920) {
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