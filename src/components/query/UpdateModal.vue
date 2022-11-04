<template>
    <a-modal :visible="visible" title="修改密码记录" :width="width"
             @update:visible="value=>$emit('update:visible',value)">
        <a-form :model="form" @submit="form_submit">
            <a-form-item field="id" label="ID" v-show="false">
                <a-input-number placeholder="id" v-model="form.id" :min="0"></a-input-number>
            </a-form-item>
            <a-form-item field="name" hide-label>
                <a-input placeholder="名称" v-model="form.name" clearable :error="inputNameStatus">
                    <template #prefix>
                        <i class="fas fa-tag fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="account" hide-label>
                <a-input placeholder="账号" v-model="form.account" clearable>
                    <template #prefix>
                        <i class="fas fa-user fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="password" hide-label>
                <a-input placeholder="密码" v-model="form.password" clearable>
                    <template #prefix>
                        <i class="fas fa-key fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item field="remark" hide-label>
                <a-input placeholder="备注" v-model="form.remark" clearable>
                    <template #prefix>
                        <i class="fas fa-info fa-fw"></i>
                    </template>
                </a-input>
            </a-form-item>
            <button type="submit" v-show="false"></button>
        </a-form>
        <template #footer>
            <a-button type="primary" @click="form_submit">
                修 改
            </a-button>
            <a-button @click="cancel_click">取 消</a-button>
        </template>
    </a-modal>
</template>

<script>
export default {
    name: "UpdateModal",
    data() {
        return {
            form: {
                id: -1,
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
        data: Object
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
        data(newVal) {
            Object.assign(this.form, newVal);
        }
    },
    emits: ["submit", "update:visible"],
    methods: {
        Open() {
            this.$emit('update:visible', true);
        },
        Close() {
            this.$emit('update:visible', false);
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
            this.Close();
        }
    }
}
</script>

<style scoped>
</style>