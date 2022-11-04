<template>
    <a-modal :visible="visible" title="添加密码记录" :width="width"
             @update:visible="value=>$emit('update:visible',value)">
        <a-form :model="form" @submit="form_submit">
            <a-form-item field="name" hide-label>
                <a-input placeholder="名称" v-model="form.name" allow-clear :error="inputNameStatus">
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
            form: {
                name: "",
                account: "",
                password: "",
                remark: ""
            },
            inputNameStatus: false,
            width: "50%"
        }
    },
    props: {
        visible: Boolean,
        cleaning: Boolean
    },
    watch: {
        visible(newVal) {
            if (newVal) {
                this.window_resize();
                window.addEventListener("resize", this.window_resize);
            } else {
                window.removeEventListener("resize", this.window_resize);
            }
        },
        cleaning(newVal) {
            if (newVal) {
                this.CleanData();
            }
        }
    },
    emits: ["submit", "update:visible", "update:cleaning"],
    methods: {
        Open() {
            this.$emit('update:visible', true);
        },
        Close() {
            this.$emit('update:visible', false);
        },
        CleanData() {
            this.form = {name: "", account: "", password: "", remark: ""};
            this.$emit('update:cleaning', false);
        },
        form_submit() {
            this.inputNameStatus = false;
            if (this.form.name === "") {
                this.inputNameStatus = true;
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