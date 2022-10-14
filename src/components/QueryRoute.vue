<template>
    <el-container style="padding-top: 8px;">
        <el-header>
            <el-row justify="center">
                <el-col :xs="17" :sm="15" :md="13" :lg="11" :xl="9" class="my-xxs-col">
                    <el-button size="large" style="margin-right: 10px;" @click="addModal.visible=true">
                        <template #icon>
                            <i class="fas fa-plus fa-fw"></i>
                        </template>
                        添加
                    </el-button>
                    <el-input v-model="key" size="large" clearable style="max-width: calc(100% - 100px);"
                              @keydown.enter="Search">
                        <template #prefix>
                            <i class="fas fa-terminal fa-fw"></i>
                        </template>
                        <template #append>
                            <el-button @click="Search">
                                <template #icon>
                                    <i class="fas fa-search fa-fw"></i>
                                </template>
                            </el-button>
                        </template>
                    </el-input>
                </el-col>
            </el-row>
        </el-header>
        <el-main style="--el-main-padding:0;">
            <el-row justify="center">
                <el-col :xs="22" :sm="20" :md="18" :lg="16" :xl="14" class="my-xxs-col">
                    <el-table :data="dataList" border stripe :max-height="table.maxHeight+'px'" size="large"
                              @cell-contextmenu="table_cell_contextmenu" @sort-change="table_sort_change">
                        <template #empty>
                            <el-empty :image-size="200"/>
                        </template>
                        <el-table-column prop="name" label="名称" header-align="center" sortable="custom">
                            <template v-slot="{row}">
                                <span style="user-select: none;">{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="account" label="账号" header-align="center"
                                         show-overflow-tooltip sortable="custom">
                            <template v-slot="{row}">
                                <span style="user-select: none">{{ row.account }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="password" label="密码" header-align="center"
                                         show-overflow-tooltip sortable="custom">
                            <template v-slot="{row}">
                                <span style="user-select: none">{{ row.password }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" header-align="center"
                                         show-overflow-tooltip sortable="custom">
                            <template v-slot="{row}">
                                <span style="user-select: none">{{ row.remark }}</span>
                            </template>
                        </el-table-column>
                        <template #append>

                        </template>
                    </el-table>
                </el-col>
            </el-row>
        </el-main>
    </el-container>

    <vue3-menus v-model:open="tableMenu.open" :event="tableMenu.event" :menus="tableMenu.menus" minWidth="100"/>
    <add-modal v-model:open="addModal.visible" :clean="addModal.clean" @submit="add_submit"/>
    <update-modal v-model:open="updateModal.visible" :in-data="updateModal.inData" @submit="update_submit"/>
</template>

<script lang="jsx">
import {addPasswords, query, updatePasswords} from "/src/js/server-api.js";
import {ElMessage, ElMessageBox} from 'element-plus';
import {Vue3Menus} from 'vue3-menus';
import AddModal from "./query/AddModal.vue";
import UpdateModal from "./query/UpdateModal.vue";

export default {
    name: "QueryRoute",
    components: {Vue3Menus, AddModal, UpdateModal},
    data() {
        return {
            key: "",
            dataList: [],
            sortSetting: {
                prop: "",
                order: null
            },
            tableMenu: {
                open: false,
                event: {},
                menus: [
                    {label: "复制", click: null},
                    {label: "删除", click: null},
                    {label: "修改", click: null}
                ]
            },
            addModal: {
                visible: false,
                clean: false
            },
            updateModal: {
                visible: false,
                inData: {}
            },
            table: {
                maxHeight: window.innerHeight - 80//等相对单位dvh标准出来之后删除
            }
        }
    },
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
        let routeQuery = this.$router.currentRoute.value.query;
        if (Object.hasOwn(routeQuery, "key")) {
            this.key = routeQuery.key;
            window.sessionStorage['history_query_key'] = this.key;
            query(this.key, this.QuerySucceed);
        } else {
            let hQKey = window.sessionStorage['history_query_key'];
            if (hQKey !== undefined) {
                query(hQKey, this.QuerySucceed);
                this.key = hQKey;
            }
        }
        window.addEventListener('resize', this.window_resize);//等相对单位dvh标准出来之后删除
    },
    unmounted() {
        window.sessionStorage.removeItem('history_query_key');
        window.removeEventListener('resize', this.window_resize);//等相对单位dvh标准出来之后删除
    },
    methods: {
        Search() {
            window.sessionStorage['history_query_key'] = this.key;
            query(this.key, this.QuerySucceed);
        },

        QuerySucceed(resp) {
            console.log(resp);
            switch (resp["code"]) {
                case 0: {
                    this.dataList = resp["data"];
                    this.SortTable(this.sortSetting.prop, this.sortSetting.order);
                    break;
                }
                case 1: {
                    console.log("没有查询到任何结果");
                    this.dataList = [];
                    break;
                }
                case 100: {
                    this.$router.push({name: "login"});
                    break;
                }
            }
        },

        table_cell_contextmenu(row, column, cell, event) {
            event.preventDefault();

            //复制按钮
            this.tableMenu.menus[0].click = function () {
                try {
                    navigator.clipboard.writeText(row[column.property]).then(function () {
                        ElMessage.success("剪切板写入成功");
                    }, function () {
                        ElMessage.error("剪切板写入失败");
                    });
                } catch (e) {
                    ElMessage.error("剪切板写入错误\n" + e);
                }
            }.bind(this);

            //删除按钮
            this.tableMenu.menus[1].click = function () {
                this.dataList.splice(this.dataList.indexOf(row), 1);
            }.bind(this);

            //修改按钮
            this.tableMenu.menus[2].click = function () {
                this.updateModal.visible = true;
                this.updateModal.inData = {};
                this.$nextTick(function () {
                    this.updateModal.inData = row;
                });
            }.bind(this);

            //滚动表格消除菜单
            let scroller = document.querySelector(".el-table__body-wrapper .el-scrollbar__wrap");
            let scrollEvent = function () {
                this.tableMenu.open = false;
                scroller.removeEventListener("scroll", scrollEvent);
            }.bind(this);
            scroller.addEventListener("scroll", scrollEvent);
            //窗体尺寸变化消除菜单
            let windowResizeEvent = function () {
                this.tableMenu.open = false;
                window.removeEventListener("resize", windowResizeEvent);
            }.bind(this);
            window.addEventListener("resize", windowResizeEvent);

            this.tableMenu.open = false;
            this.tableMenu.event = event;
            this.$nextTick(function () {
                this.tableMenu.open = true;
            });
        },

        table_sort_change({prop, order}) {
            this.sortSetting.prop = prop;
            this.sortSetting.order = order;
            this.SortTable(prop, order);
        },

        SortTable(prop, order) {
            switch (order) {
                case 'ascending': {
                    this.dataList.sort((a, b) => {
                        if (a[prop] === b[prop]) return 0;
                        return a[prop] > b[prop] ? 1 : -1;
                    });
                    break;
                }
                case 'descending': {
                    this.dataList.sort((a, b) => {
                        if (a[prop] === b[prop]) return 0;
                        return a[prop] > b[prop] ? -1 : 1;
                    });
                    break;
                }
                default: {
                    this.dataList.sort((a, b) => {
                        let i0 = Number(a.id);
                        let i1 = Number(b.id);
                        return i0 - i1;
                    });
                    break;
                }
            }
        },

        add_submit(form_data) {
            let name = form_data.name;
            let account = form_data.account;
            let password = form_data.password;
            let remark = form_data.remark;
            addPasswords(name, account, password, remark, function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        let key = window.sessionStorage['history_query_key'];
                        key = key === undefined || key === '' ? name : `${key} ${name}`;
                        window.sessionStorage['history_query_key'] = key;
                        query(key, this.QuerySucceed);
                        this.key = key;
                        this.addModal.visible = false;
                        this.addModal.clean = true;
                        this.$nextTick(function () {
                            this.addModal.clean = false;
                        });
                        ElMessage.success("添加成功");
                        break;
                    }
                    case 1: {
                        ElMessage.error(<p className="el-message__content">
                            添加失败<br/>可能该名称已存在<br/>请尝试换一个名称再添加
                        </p>);
                        this.addModal.visible = false;
                        break;
                    }
                }
            }.bind(this));
        },

        update_submit(form_data) {
            ElMessageBox.confirm("确定修改？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                callback: function (action) {
                    if (action === "confirm") {
                        let id = form_data.id;
                        let name = form_data.name;
                        let account = form_data.account;
                        let password = form_data.password;
                        let remark = form_data.remark;
                        updatePasswords(id, name, account, password, remark, function (resp) {
                            switch (resp["code"]) {
                                case 0: {
                                    let key = window.sessionStorage['history_query_key'];
                                    key = key === undefined || key === '' ? name : key;
                                    if (key.indexOf(name) === -1) {
                                        key += ` ${name}`;
                                    }
                                    window.sessionStorage['history_query_key'] = key;
                                    query(key, this.QuerySucceed);
                                    this.key = key;
                                    this.updateModal.visible = false;
                                    ElMessage.success("修改成功");
                                    break;
                                }
                                case 1: {
                                    ElMessage.error(resp["msg"]);
                                    break;
                                }
                            }
                        }.bind(this));
                    }
                }.bind(this)
            });
        },

        window_resize() {//等相对单位dvh标准出来之后删除
            this.table.maxHeight = window.innerHeight - 80;
        }

    }
}
</script>

<style scoped>
@media (max-width: 576px) {
    .my-xxs-col {
        max-width: 100%;
        flex: 0 0 100%;
    }
}
</style>