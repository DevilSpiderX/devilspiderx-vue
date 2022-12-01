<script setup>
import { computed, h, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Message, Modal } from "@arco-design/web-vue";
import AddModal from "./AddModal.vue";
import UpdateModal from "./UpdateModal.vue";
import DisplayModal from "./DisplayModal.vue";
import http from "@/scripts/server-api";
import { useAppConfigs } from "@/store/AppConfigsStore";
import QueryTd from "./QueryTd.vue";
import { DSXMenu } from "@/components/dsx-menu";
import { useTableMenu } from "./hooks/table-menu";

const appConfigs = useAppConfigs();
appConfigs.backgroundColor2StatusBarColor();

const sortable = {
    sortDirections: ["ascend", "descend"],
    sorter: (a, b, { dataIndex, direction }) => {
        if (direction === "ascend") {
            return a[dataIndex] < b[dataIndex] ? -1 : a[dataIndex] > b[dataIndex] ? 1 : 0
        } else {
            return a[dataIndex] < b[dataIndex] ? 1 : a[dataIndex] > b[dataIndex] ? -1 : 0
        }
    }
};

const table = reactive({
    columns: [
        { title: "名称", dataIndex: "name", ellipsis: true, tooltip: { position: "tl" }, sortable },
        { title: "账号", dataIndex: "account", ellipsis: true, tooltip: true, sortable },
        { title: "密码", dataIndex: "password", ellipsis: true, tooltip: true, sortable },
        { title: "备注", dataIndex: "remark", ellipsis: true, tooltip: { position: "tr" }, sortable }
    ],
    data: [],
    paginationProps: {
        pageSize: 20,
        current: 1,
        hideOnSinglePage: true,
        simple: computed(() => appConfigs.client.width < 450)
    },
    pagePosition: computed(() => appConfigs.client.width < 450 ? "br" : "bottom"),
    bodyScrollWrap: null
});

const tableTotalPage = computed(() => Math.ceil(table.data.length / table.paginationProps.pageSize));

onMounted(() => {
    document.body.classList.add("no-scrollbar");
    detectKey();
    table.bodyScrollWrap = document.querySelector('.arco-scrollbar-container.arco-table-body');
});

onUnmounted(() => {
    document.body.classList.remove("no-scrollbar");
    appConfigs.query.history = undefined;
});

const key = ref("");
const searching = ref(false);

async function Search() {
    appConfigs.query.history = key.value;
    searching.value = true;
    try {
        QuerySucceed(await http.query.get(key.value));
    } catch (error) {
        console.error("(Search)", `url:${error.config?.url}`, error);
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
        case 100:
        default: {
            router.push({ name: "login" });
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
            QuerySucceed(await http.query.get(key.value));
        } else {
            let history = appConfigs.query.history;
            if (history !== undefined) {
                key.value = history;
                searching.value = true;
                QuerySucceed(await http.query.get(history));
            }
        }
    } catch (error) {
        console.error("(detectKey)", `url:${error.config?.url}`, error);
        QueryError();
    }
}

function setTableScrollTop(number) {
    table.bodyScrollWrap.scrollTop = number;
}

const { tableMenu } = useTableMenu();

tableMenu.close = () => {
    tableMenu.visible = false;
    removeTableMenuListener();
}

const updateModal = reactive({
    visible: false,
    data: {}
});

function table_cell_contextmenu(column, record, rowIndex, event) {
    if (record.id === -1) return;
    const recordIndex = table.paginationProps.pageSize * (table.paginationProps.current - 1) + rowIndex;

    //复制按钮
    tableMenu.clicks.copy = () => {
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
    tableMenu.clicks.delete = () => {
        Modal.confirm({
            title: "提示",
            content: "确认删除？",
            width: 300,
            okText: "确定",
            cancelText: "取消",
            onOk: async () => {
                let resp = await http.query.Delete(record.id);
                switch (resp.code) {
                    case 0: {
                        table.data.splice(recordIndex, 1);
                        if (table.paginationProps.current > tableTotalPage.value) {
                            table.paginationProps.current--;
                        }
                        break;
                    }
                    case 1: {
                        Message.error("删除失败");
                        break;
                    }
                    case 100:
                    default: {
                        router.push({ name: "login" });
                        break;
                    }
                }
            }
        });
    };

    //编辑按钮
    tableMenu.clicks.edit = async () => {
        updateModal.visible = true;
        updateModal.data = {};
        await nextTick();
        updateModal.data = record;
    };

    //查看按钮
    tableMenu.clicks.see = () => {
        table_cell_dblclick(record);
    }

    //滚动表格消除右键菜单
    table.bodyScrollWrap.addEventListener("scroll", tableMenu.close, { once: true });
    //窗体尺寸变化消除右键菜单
    window.addEventListener("resize", tableMenu.close, { once: true });

    tableMenu.event = event;
    tableMenu.visible = true;
}

function removeTableMenuListener() {
    table.bodyScrollWrap.removeEventListener("scroll", tableMenu.close, { once: true });
    window.removeEventListener("resize", tableMenu.close, { once: true });
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
        let resp = await http.query.add(name, account, password, remark);
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
                    QuerySucceed(await http.query.get(history));
                } catch (error) {
                    console.error("(add_submit)", `url:${error.config?.url}`, error);
                    QueryError();
                }
                break;
            }
            case 1: {
                Message.error({
                    content: () => h("span", null, [
                        "添加失败",
                        h("br"),
                        "可能该名称已存在",
                        h("br"),
                        "请尝试换一个名称再添加"
                    ])
                });
                addModal.visible = false;
                break;
            }
            case 100:
            default: {
                router.push({ name: "login" });
                break;
            }
        }
    } catch (error) {
        console.error("(add_submit)", `url:${error.config?.url}`, error);
        Message.error("服务器错误");
    }
}

function update_submit(form_data) {
    //form_data是有响应性的
    Modal.confirm({
        title: "提示",
        content: "确认修改？",
        width: 300,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
            let id = form_data.id;
            let name = form_data.name;
            let account = form_data.account;
            let password = form_data.password;
            let remark = form_data.remark;
            let resp = await http.query.update(id, name, account, password, remark);
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
                        QuerySucceed(await http.query.get(history));
                    } catch (error) {
                        console.error("(okUpdate)", `url:${error.config?.url}`, error);
                        QueryError();
                    }
                    break;
                }
                case 1: {
                    Message.error(resp["msg"]);
                    break;
                }
                case 100:
                default: {
                    router.push({ name: "login" });
                    break;
                }
            }
        }
    });
}

async function table_page_change(page) {
    table.paginationProps.current = page;
    await nextTick();
    setTableScrollTop(0);
}

const displayModal = reactive({
    visible: false,
    data: {}
});

function table_cell_dblclick(record) {
    displayModal.data = record;
    displayModal.visible = true;
}

watch(() => [addModal.visible, updateModal.visible, displayModal.visible],
    ([v0, v1, v2]) => {
        let visible = v0 || v1 || v2;
        appConfigs.statusBarColor = visible ? appConfigs.darkTheme ? "#17171a" : "#777a7f"
            : window.getComputedStyle(document.body).backgroundColor;
    }
);

</script>

<template>
    <ALayout style="height:100%">
        <ALayoutHeader style="border-bottom: 1px solid #84858d55;max-height: 63px">
            <APageHeader @back="$router.back">
                <template #title>
                    <span> 密码查询 </span>
                </template>
                <template #extra>
                    <ASpace>
                        <span style="color: var(--color-text-1)">数据条数:</span>
                        <ASelect v-model="table.paginationProps.pageSize">
                            <AOption v-for="item in [10, 20, 30, 40, 50]" :value="item">
                                {{ item }}
                            </AOption>
                        </ASelect>
                    </ASpace>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent style="height:calc(100% - 63px)">
            <ALayout style="height:100%">
                <ALayoutHeader style="padding:8px">
                    <ARow justify="center">
                        <ACol :xs="24" :sm="17" :md="15" :lg="13" :xl="11" :xxl="9">
                            <ARow>
                                <ACol flex="105px">
                                    <AButton size="large" @click="addModal.visible = true">
                                        <template #icon>
                                            <i class="fas fa-plus fa-fw"></i>
                                        </template>
                                        添加
                                    </AButton>
                                </ACol>
                                <ACol flex="1">
                                    <AInputSearch v-model="key" size="large" allow-clear
                                        :button-props="{ type: 'secondary' }" search-button @keydown.enter="Search"
                                        @search="Search" :loading="searching">
                                        <template #prefix>
                                            <i class="fas fa-terminal fa-fw"></i>
                                        </template>
                                    </AInputSearch>
                                </ACol>
                            </ARow>
                        </ACol>
                    </ARow>
                </ALayoutHeader>
                <ALayoutContent style="height:calc(100% - 52px)">
                    <ARow justify="center" style="height:100%">
                        <ACol v-bind="{ xs: 24, sm: 22, md: 20, lg: 18, xl: 16, xxl: 14 }"
                            :style="{ height: '100%', overflow: 'hidden' }">
                            <ATable :columns="table.columns" :data="table.data" :scroll="{ y: 'calc(100% - 12px)' }"
                                row-key="id" :pagination="table.paginationProps" :page-position="table.pagePosition"
                                :loading="searching" @page-change="table_page_change">
                                <template #empty>
                                    <AEmpty />
                                </template>
                                <template #td="scope">
                                    <QueryTd :value="scope" @contextmenu="table_cell_contextmenu"
                                        @dblclick="table_cell_dblclick" />
                                </template>
                            </ATable>
                        </ACol>
                    </ARow>
                </ALayoutContent>
            </ALayout>
        </ALayoutContent>
    </ALayout>

    <DSXMenu v-model:visible="tableMenu.visible" :event="tableMenu.event" :menus="tableMenu.menus" min-width="100px"
        :style="tableMenu.style" :z-index="1002" />
    <AddModal v-model:visible="addModal.visible" v-model:cleaning="addModal.cleaning" @submit="add_submit" />
    <UpdateModal v-model:visible="updateModal.visible" :data="updateModal.data" @submit="update_submit" />
    <DisplayModal v-model:visible="displayModal.visible" :data="displayModal.data" />
</template>