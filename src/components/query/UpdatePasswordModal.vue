<template>
    <Modal ref="modal" @backdropClick="close">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- 修改密码模态框头部 -->
                <div class="modal-header justify-content-center">
                    <h4 class="modal-title">修改密码记录</h4>
                    <button type="button" class="close" @click="close">&times;</button>
                </div>

                <!-- 修改密码模态框主体 -->
                <div class="modal-body">
                    <div class="col-12">
                        <div class="input-group shadow" v-show="false">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fab fa-orcid fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="number" placeholder="ID" disabled v-model="values.id">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-tag fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" placeholder="名称" v-model="values.name">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-user fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" placeholder="账号" v-model="values.account">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-key fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" placeholder="密码" v-model="values.password">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-info fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" placeholder="备注" v-model="values.remark">
                        </div>
                    </div>
                </div>

                <!-- 修改密码模态框底部 -->
                <div class="modal-footer justify-content-around">
                    <button type="button" class="btn btn-success btn-lg shadow" @click="on_updateButton_clicked">
                        修改
                    </button>
                    <button type="button" class="btn btn-danger btn-lg shadow" @click="close">关闭</button>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
import {query, updatePasswords} from "@/js/server-api";
import Modal from "@/components/query/ModalBase";

export default {
    name: "UpdatePasswordModal",
    components: {Modal},
    data() {
        return {
            values: {
                id: -1,
                name: "",
                account: "",
                password: "",
                remark: ""
            }
        }
    },
    emits: ["updateSuc", "querySuc"],
    methods: {
        open() {
            this.$refs.modal.open();
        },
        close() {
            this.$refs.modal.close();
            this.values.id = -1;
            this.values.name = "";
            this.values.account = "";
            this.values.password = "";
            this.values.remark = "";
        },
        on_updateButton_clicked() {
            if (confirm("确定修改？")) {
                let vm = this;
                let id = this.values.id;
                let name = this.values.name;
                let account = this.values.account;
                let password = this.values.password;
                let remark = this.values.remark;
                updatePasswords(id, name, account, password, remark, function (resp) {
                    switch (resp["code"]) {
                        case 0: {
                            let key = window.sessionStorage['history_query_key'];
                            key = key === undefined || key === '' ? name : key;
                            if (key.indexOf(name) === -1) {
                                key += ` ${name}`;
                            }
                            window.sessionStorage['history_query_key'] = key;
                            query(key, function (resp) {
                                vm.$emit("querySuc", resp);
                            });
                            vm.$emit("updateSuc", key);
                            vm.close();
                            break;
                        }
                        case 1: {
                            alert(resp["msg"]);
                            break;
                        }
                    }
                })
            }
        }
    }
}
</script>

<style scoped>

</style>