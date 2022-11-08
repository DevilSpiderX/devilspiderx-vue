<script setup lang="jsx">
import { nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Message, Modal } from '@arco-design/web-vue';
import { Vue3Menus } from 'vue3-menus';
import AddModal from "./AddModal.vue";
import UpdateModal from "./UpdateModal.vue";
import http from "/src/scripts/server-api";
import { useAppConfigs } from "/src/store/AppConfigsStore";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = window.getComputedStyle(document.body).backgroundColor;

const table = reactive({
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
});

onMounted(() => {
    detectKey();
    table.bodyScrollWrap = document.querySelector('.arco-scrollbar-container.arco-table-body');
    window.addEventListener('resize', window_resize);//等相对单位dvh标准出来之后删除
});


onUnmounted(() => {
    appConfigs.query.history = undefined;
    window.removeEventListener('resize', window_resize);//等相对单位dvh标准出来之后删除
});

const key = ref("");
const searching = ref(false);

async function Search() {
    appConfigs.query.history = key.value;
    searching.value = true;
    try {
        QuerySucceed(await http.query(key.value));
    } catch (error) {
        console.error("(Search)", `url:${error.config.url}`, error);
        QueryError();
    }
}

const router = useRouter();

function QuerySucceed(resp) {
    console.log("QuerySucceed:", resp);
    searching.value = false;
    table.paginationProps.current = 1;
    switch (resp["code"]) {
        case 0: {
            table.data = resp["data"]["list"];
            setTableScrollTop(0);
            break;
        }
        case 1: {
            console.log("没有查询到任何结果");
            table.data = [];
            break;
        }
        case 100: {
            router.push({name: "login"});
            break;
        }
    }
}

function QueryError() {
    Message.error("查询出现错误");
    searching.value = false;
}

const route = useRoute();

async function detectKey() {
    let routeQuery = route.query;
    try {
        if (Object.hasOwn(routeQuery, "key")) {
            key.value = routeQuery.key;
            appConfigs.query.history = key.value;
            searching.value = true;
            QuerySucceed(await http.query(key.value));
        } else {
            let history = appConfigs.query.history;
            if (history !== undefined) {
                key.value = history;
                searching.value = true;
                QuerySucceed(await http.query(history));
            }
        }
    } catch (error) {
        console.error("(detectKey)", `url:${error.config.url}`, error);
        QueryError();
    }
}

function setTableScrollTop(number) {
    table.bodyScrollWrap.scrollTop = number;
}

const tableMenu = reactive({
    open: false,
    event: {},
    menus: [
        {label: "复制", click: null},
        {label: "删除", click: null},
        {label: "修改", click: null}
    ],
    Open: async () => {
        tableMenu.open = false;
        await nextTick();
        tableMenu.open = true;
    },
    Close: () => {
        tableMenu.open = false;
        removeTableMenuListener();
    }
});
const updateModal = reactive({
    visible: false,
    data: {}
});

function table_cell_contextmenu(column, record, event) {
    if (record.id === -1) return;
    //复制按钮
    tableMenu.menus[0].click = () => {
        if (typeof navigator.clipboard === "object") {
            navigator.clipboard.writeText(record[column.dataIndex]).then(() => {
                Message.success("剪切板写入成功");
            }).catch(() => {
                Message.error("剪切板写入失败");
            });
        } else {
            Message.error("无法使用剪切板");
        }
    };

    //删除按钮
    tableMenu.menus[1].click = () => {
        //假的删除，只是从表格上删除而已，服务器上根本没有删除api
        table.data.splice(this.table.data.indexOf(record), 1);
    };

    //修改按钮
    tableMenu.menus[2].click = async () => {
        updateModal.visible = true;
        updateModal.data = {};
        await nextTick();
        updateModal.data = record;
    };

    //滚动表格消除菜单
    table.bodyScrollWrap.addEventListener("scroll", tableMenu.Close, {once: true});
    //窗体尺寸变化消除菜单
    window.addEventListener("resize", tableMenu.Close, {once: true});

    tableMenu.event = event;
    tableMenu.Open();
}

function removeTableMenuListener() {
    table.bodyScrollWrap.removeEventListener("scroll", tableMenu.Close);
    window.removeEventListener("resize", tableMenu.Close);
}

const addModal = reactive({
    visible: false,
    cleaning: false
});

async function add_submit(form_data) {
    //form_data是有响应性的
    let name = form_data.name;
    let account = form_data.account;
    let password = form_data.password;
    let remark = form_data.remark;
    try {
        let resp = await http.addPasswords(name, account, password, remark);
        console.log("addPasswords:", resp);
        switch (resp["code"]) {
            case 0: {
                let history = appConfigs.query.history;
                history = history === undefined || history === "" ? name : `${history} ${name}`;
                appConfigs.query.history = history;
                searching.value = true;
                key.value = history;
                addModal.visible = false;
                addModal.clean = true;
                Message.success("添加成功");
                try {
                    QuerySucceed(await http.query(history));
                } catch (error) {
                    console.error("(add_submit)", `url:${error.config.url}`, error);
                    QueryError();
                }
                break;
            }
            case 1: {
                Message.error({
                    content: () =>
                        <p style="margin:0">
                            添加失败<br />可能该名称已存在<br />请尝试换一个名称再添加
                        </p>
                });
                addModal.visible = false;
                break;
            }
        }
    } catch (error) {
        console.error("(add_submit)", `url:${error.config.url}`, error);
        Message.error("服务器错误");
    }
}

function update_submit(form_data) {
    //form_data是有响应性的
    Modal.confirm({
        title: "提示",
        content: "确认修改？",
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
            let id = form_data.id;
            let name = form_data.name;
            let account = form_data.account;
            let password = form_data.password;
            let remark = form_data.remark;
            let resp = await http.updatePasswords(id, name, account, password, remark);
            console.log("updatePasswords:", resp);
            switch (resp["code"]) {
                case 0: {
                    let history = appConfigs.query.history;
                    history = history === undefined || history === "" ? name :
                        history.indexOf(name) === -1 ? `${history} ${name}` : history;
                    appConfigs.query.history = history;
                    searching.value = true;
                    key.value = history;
                    updateModal.visible = false;
                    Message.success("修改成功");
                    try {
                        QuerySucceed(await http.query(history))
                    } catch (error) {
                        console.error("(okUpdate)", `url:${error.config.url}`, error);
                        QueryError();
                    }
                    break;
                }
                case 1: {
                    Message.error(resp["msg"]);
                    break;
                }
            }
        }
    });
}

function window_resize() {//等相对单位dvh标准出来之后删除
    table.maxHeight = window.innerHeight - 64;
}

async function table_page_change(page) {
    table.paginationProps.current = page;
    await nextTick();
    setTableScrollTop(0);
}

</script>

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
                            <a-empty />
                        </template>
                        <template #td="{column, record}">
                            <td class="user-select-none"
                                @contextmenu.prevent="table_cell_contextmenu(column,record,$event)" />
                        </template>
                    </a-table>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>

    <vue3-menus v-model:open="tableMenu.open" :event="tableMenu.event" :menus="tableMenu.menus" minWidth="100" />
    <add-modal v-model:visible="addModal.visible" v-model:cleaning="addModal.cleaning" @submit="add_submit" />
    <update-modal v-model:visible="updateModal.visible" :data="updateModal.data" @submit="update_submit" />
</template>

<style scoped>
.user-select-none {
    user-select: none;
}
</style>