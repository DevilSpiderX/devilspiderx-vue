<template>
    <a-layout>
        <a-layout-header style="padding:8px">
            <a-row justify="center">
                <a-col :xs="24" :sm="17" :md="15" :lg="13" :xl="11" :xxl="9">
                    <a-row>
                        <a-col flex="105px">
                            <a-button size="large" @click="addModal.visible=true">
                                <template #icon>
                                    <i class="fas fa-plus fa-fw"></i>
                                </template>
                                添加
                            </a-button>
                        </a-col>
                        <a-col flex="auto" style="max-width: calc(100% - 105px)">
                            <a-input-search v-model="key" size="large" allow-clear :button-props="{type:'secondary'}"
                                            search-button @keydown.enter="Search" @search="Search" :loading="searching">
                                <template #prefix>
                                    <i class="fas fa-terminal fa-fw"></i>
                                </template>
                            </a-input-search>
                        </a-col>
                    </a-row>
                </a-col>
            </a-row>
        </a-layout-header>
        <a-layout-content>
            <a-row justify="center">
                <a-col :xs="24" :sm="22" :md="20" :lg="18" :xl="16" :xxl="14">
                    <a-table :columns="table.columns" :data="table.data" :scroll="{y:table.maxHeight+'px'}" row-key="id"
                             page-position="bottom" :pagination="table.paginationProps" :loading="searching"
                             @page-change="table_page_change">
                        <template #empty>
                            <a-empty/>
                        </template>
                        <template #td="{column, record}">
                            <td class="user-select-none"
                                @contextmenu.prevent="table_cell_contextmenu(column,record,$event)"/>
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>

    <vue3-menus v-model:open="tableMenu.open" :event="tableMenu.event" :menus="tableMenu.menus" minWidth="100"/>
    <add-modal v-model:visible="addModal.visible" v-model:cleaning="addModal.cleaning" @submit="add_submit"/>
    <update-modal v-model:visible="updateModal.visible" :data="updateModal.data" @submit="update_submit"/>
</template>

<script lang="jsx">
import {addPasswords, query, updatePasswords} from "/src/scripts/server-api.js";
import {Message, Modal} from '@arco-design/web-vue';
import {Vue3Menus} from 'vue3-menus';
import AddModal from "./AddModal.vue";
import UpdateModal from "./UpdateModal.vue";

export default {
    name: "QueryRoute",
    components: {Vue3Menus, AddModal, UpdateModal},
    data() {
        return {
            key: "",
            searching: false,
            table: {
                maxHeight: window.innerHeight - 64,//等相对单位dvh标准出来之后删除
                columns: [
                    {title: "名称", dataIndex: "name"},
                    {title: "账号", dataIndex: "account", ellipsis: true, tooltip: true},
                    {title: "密码", dataIndex: "password", ellipsis: true, tooltip: true},
                    {title: "备注", dataIndex: "remark", ellipsis: true, tooltip: true}
                ],
                data: [],
                paginationProps: {
                    pageSize: 20,
                    current: 1,
                    hideOnSinglePage: true
                },
                bodyScrollWrap: null
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
                cleaning: false
            },
            updateModal: {
                visible: false,
                data: {}
            }
        }
    },
    beforeMount() {
        this.setThemeColor(window.getComputedStyle(document.body).backgroundColor);
    },
    mounted() {
        let routeQuery = this.$router.currentRoute.value.query;
        if (Object.hasOwn(routeQuery, "key")) {
            this.key = routeQuery.key;
            window.sessionStorage['history_query_key'] = this.key;
            query(this.key, this.QuerySucceed);
            this.searching = true;
        } else {
            let hQKey = window.sessionStorage['history_query_key'];
            if (hQKey !== undefined) {
                query(hQKey, this.QuerySucceed);
                this.searching = true;
                this.key = hQKey;
            }
        }
        this.table.bodyScrollWrap = document.querySelector('.arco-scrollbar-container.arco-table-body');
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
            this.searching = true;
        },

        QuerySucceed(resp) {
            console.log(resp);
            this.searching = false;
            this.table.paginationProps.current = 1;
            switch (resp["code"]) {
                case 0: {
                    this.table.data = resp["data"]["list"];

                    this.setTableScrollTop(0);
                    break;
                }
                case 1: {
                    console.log("没有查询到任何结果");
                    this.table.data = [];
                    break;
                }
                case 100: {
                    this.$router.push({name: "login"});
                    break;
                }
            }
        },

        setTableScrollTop(number) {
            this.table.bodyScrollWrap.scrollTop = number;
        },

        table_cell_contextmenu(column, record, event) {
            if (record.id === -1) return;
            //复制按钮
            this.tableMenu.menus[0].click = function () {
                try {
                    navigator.clipboard.writeText(record[column.dataIndex]).then(function () {
                        Message.success("剪切板写入成功");
                    }, function () {
                        Message.error("剪切板写入失败");
                    });
                } catch (e) {
                    Message.error("剪切板写入错误\n" + e);
                }
            }.bind(this);

            //删除按钮
            this.tableMenu.menus[1].click = function () {
                this.table.data.splice(this.table.data.indexOf(record), 1);
            }.bind(this);

            //修改按钮
            this.tableMenu.menus[2].click = async function () {
                this.updateModal.visible = true;
                this.updateModal.data = {};
                await this.$nextTick();
                this.updateModal.data = record;
            }.bind(this);


            const menuClose = function () {
                this.tableMenu.open = false;
            }.bind(this);
            //滚动表格消除菜单
            this.table.bodyScrollWrap.addEventListener("scroll", menuClose, {once: true});
            //窗体尺寸变化消除菜单
            window.addEventListener("resize", menuClose, {once: true});

            this.tableMenu.open = false;
            this.tableMenu.event = event;
            this.$nextTick(function () {
                this.tableMenu.open = true;
            });
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
                        this.searching = true;
                        this.key = key;
                        this.addModal.visible = false;
                        this.addModal.clean = true;
                        Message.success("添加成功");
                        break;
                    }
                    case 1: {
                        Message.error({
                            content: () =>
                                <p style="margin:0">
                                    添加失败<br/>可能该名称已存在<br/>请尝试换一个名称再添加
                                </p>
                        });
                        this.addModal.visible = false;
                        break;
                    }
                }
            }.bind(this));
        },

        update_submit(form_data) {
            Modal.confirm({
                title: "提示",
                content: "确认修改？",
                okText: "确定",
                cancelText: "取消",
                onOk: function () {
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
                                this.searching = true;
                                this.key = key;
                                this.updateModal.visible = false;
                                Message.success("修改成功");
                                break;
                            }
                            case 1: {
                                Message.error(resp["msg"]);
                                break;
                            }
                        }
                    }.bind(this));
                }.bind(this)
            });
        },

        window_resize() {//等相对单位dvh标准出来之后删除
            this.table.maxHeight = window.innerHeight - 64;
        },

        async table_page_change(page) {
            this.table.paginationProps.current = page;
            await this.$nextTick();
            this.setTableScrollTop(0);
        }

    }
}
</script>

<style scoped>
.user-select-none {
    user-select: none;
}
</style>