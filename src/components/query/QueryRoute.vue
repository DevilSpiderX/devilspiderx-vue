<script setup>
import SearchNoResultSvg from "@/assets/搜索无结果.svg";
import { DSXMenu } from "@/components/dsx-menu";
import {
    add as addApi,
    deleteApi,
    get as getApi,
    update as updateApi
} from "@/scripts/http/query-api";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { Message, Modal } from "@arco-design/web-vue";
import { computed, h, nextTick, reactive, ref } from "vue";
import { AddModal, DisplayModal, QueryTd, UpdateModal } from "./components";
import { usePasswordSearch } from "./hooks/password-search";
import { useTableBodyScrollWrap } from "./hooks/table-body-scroll-wrap";
import { useTableMenu } from "./hooks/table-menu";

const appConfigs = useAppConfigs();

const sortable = {
    sortDirections: ["ascend", "descend"],
    sorter: (a, b, { dataIndex, direction }) => {
        if (a.id < 0 && b.id < 0) {
            return 0;
        } else if (a.id < 0) {
            return 1;
        } else if (b.id < 0) {
            return -1;
        }

        if (direction === "ascend") {
            return a[dataIndex] < b[dataIndex] ? -1 : a[dataIndex] > b[dataIndex] ? 1 : 0
        } else {
            return a[dataIndex] < b[dataIndex] ? 1 : a[dataIndex] > b[dataIndex] ? -1 : 0
        }
    }
};

const tableColumns = reactive([
    { title: "名称", dataIndex: "name", ellipsis: true, tooltip: { position: "tl" }, sortable },
    { title: "账号", dataIndex: "account", ellipsis: true, tooltip: true, sortable },
    { title: "密码", dataIndex: "password", ellipsis: true, tooltip: true, sortable },
    { title: "备注", dataIndex: "remark", ellipsis: true, tooltip: { position: "tr" }, sortable }
]);

/**
 * @template T
 * @typedef {import("vue").Ref<T>} Ref
 */

/**
 * @typedef {import("@arco-design/web-vue").Table} ATable
 */

/** @type {Ref<InstanceType<ATable> | null>} */
const pwdTableRef = ref(null);
const { tableBodyScrollWrap, setTableScrollTop } = useTableBodyScrollWrap(pwdTableRef);

/**
 * @typedef {import("./hooks/password-search").PasswordDataType} PasswordDataType
 */

const {
    key,
    passwordData,
    tablePaginationCurrent,
    tablePaginationPageSize
} = usePasswordSearch();

const tableData = computed({
    get: () => {
        /** @type {PasswordDataType[]} */
        const data = passwordData.value.map(v => v);
        const len = data.length;
        if (len === 0) {
            return [];
        }
        const onePageLineCount = appConfigs.pwdQuery.onePageLineCount;
        const pageSize = tablePaginationProps.pageSize;
        const n = onePageLineCount - len % pageSize;
        for (let i = 0; i < n && n < onePageLineCount; i++) {
            data.push({
                id: -(i + 1),
                name: "\xA0",
                account: "\xA0",
                password: "\xA0",
                remark: "\xA0",
                disabled: true
            });
        }
        data.splice = (start, deleteCount) => passwordData.value.splice(start, deleteCount);
        return data;
    },
    set: data => passwordData.value = data
});

const tablePaginationProps = reactive({
    pageSize: tablePaginationPageSize,
    "onUpdate:pageSize": newPageSize => tablePaginationProps.pageSize = newPageSize,
    current: tablePaginationCurrent,
    "onUpdate:current": newCurrent => {
        tablePaginationProps.current = newCurrent;
        setTableScrollTop(0);
    },
    hideOnSinglePage: true,
    simple: computed(() => appConfigs.client.width < 450),
    pageSizeOptions: [10, 20, 30, 40, 50, 200, 500, 1000]
});

const tableTotalPage = computed(() => Math.ceil(tableData.value.length / tablePaginationProps.pageSize));

const tablePagePosition = computed(() => appConfigs.client.width < 450 ? "br" : "bottom");

const tableScroll = reactive({
    x: computed(() => {
        if (tableData.value.length === 0) {
            return "100%";
        }
        let winWidth = appConfigs.client.width;
        if (winWidth < 576) {
            //xs [0, 576)
            return "155%";
        } else if (winWidth < 768) {
            //sm [576, 768)
            return "140%";
        } else if (winWidth < 992) {
            //md [768, 992)
            return "125%";
        } else if (winWidth < 1200) {
            //lg [992, 1200)
            return "120%";
        } else {
            //xl & xxl [1200, ∞)
            return "100%";
        }
    }),
    y: "100%"
});

const tablePaddingBottom = computed(() => tableTotalPage.value > 1 ? "12px" : undefined);

const searching = ref(false);

async function Search() {
    searching.value = true;
    try {
        QuerySucceed(await getApi(key.value));
    } catch (error) {
        console.error("(Search)", `url:${error.config?.url}`, error);
        QueryError();
    }
}

/**
 * @param {import("@/scripts/http").Resp} resp 
 */
function QuerySucceed(resp) {
    console.log("QuerySucceed:", resp);
    searching.value = false;
    tablePaginationProps.current = 1
    if (resp.code === 0) {
        passwordData.value = resp.data;
        setTableScrollTop(0);
    }
}

function QueryError() {
    Message.error("查询出现错误");
    searching.value = false;
}

const { tableMenu, tableMenuIcons, tableMenuItemStyle } = useTableMenu();

/**
 * @param {import("@arco-design/web-vue").TableColumnData} column 
 * @param {PasswordDataType} record 
 * @param {number} rowIndex 
 * @param {MouseEvent} event 
 */
function table_cell_contextmenu(column, record, rowIndex, event) {
    const recordIndex = tablePaginationProps.pageSize * (tablePaginationProps.current - 1) + rowIndex;

    tableMenu.menus = [
        //判断是内容是网址的时候才会出现
        {
            label: "打开",
            onClick: () => window.open(record[column.dataIndex]),
            style: tableMenuItemStyle,
            icon: tableMenuIcons.globe,
            disappeared: !/^http(s)?:\/\/.+(:\d{1,5})?\/?[\w\/\?=&]*$/.test(record[column.dataIndex])
        },
        //复制按钮
        {
            label: "复制",
            onClick: () => {
                if (typeof navigator.clipboard === "object") {
                    navigator.clipboard.writeText(record[column.dataIndex]).then(() => {
                        Message.success({
                            id: "copy_success",
                            content: "复制成功"
                        });
                    }).catch(() => {
                        Message.error({
                            id: "copy_error",
                            content: "复制失败"
                        });
                    });
                }
            },
            style: tableMenuItemStyle,
            icon: tableMenuIcons.copy
        },
        //删除按钮
        {
            label: "删除",
            onClick: () => {
                Modal.confirm({
                    title: "提示",
                    content: `确认删除(${record.name})？`,
                    width: 300,
                    okText: "确定",
                    cancelText: "取消",
                    onOk: async () => {
                        const resp = await deleteApi(record.id);
                        switch (resp.code) {
                            case 0: {
                                tableData.value.splice(recordIndex, 1);
                                if (tablePaginationProps.current > tableTotalPage.value) {
                                    tablePaginationProps.current--;
                                }
                                break;
                            }
                            case 1: {
                                Message.error("删除失败");
                                break;
                            }
                        }
                    }
                });
            },
            style: tableMenuItemStyle,
            icon: tableMenuIcons.trash_xmark
        },
        //编辑按钮
        {
            label: "编辑",
            onClick: async () => {
                updateModal.visible = true;
                updateModal.data = {};
                await nextTick();
                updateModal.data = record;
            },
            style: tableMenuItemStyle,
            icon: tableMenuIcons.pen_to_square
        },
        //查看按钮
        {
            label: "查看",
            onClick: () => {
                table_cell_dblclick(record);
            },
            style: tableMenuItemStyle,
            icon: tableMenuIcons.eye
        }
    ];

    //滚动表格消除右键菜单
    tableBodyScrollWrap.value?.addEventListener("scroll", closeTableMenu, { once: true });
    //窗体尺寸变化消除右键菜单
    window.addEventListener("resize", closeTableMenu, { once: true });

    tableMenu.event = event;
    tableMenu.visible = true;
}

function closeTableMenu() {
    tableMenu.visible = false;
    removeTableMenuListener();
}

function removeTableMenuListener() {
    tableBodyScrollWrap.value?.removeEventListener("scroll", closeTableMenu);
    window.removeEventListener("resize", closeTableMenu);
}

const addModal = reactive({
    visible: false,
    cleaning: false
});

async function add_submit(form_data) {
    const name = form_data.name;
    const account = form_data.account;
    const password = form_data.password;
    const remark = form_data.remark;
    try {
        const resp = await addApi(name, account, password, remark);
        console.log("addPasswords:", resp);
        switch (resp.code) {
            case 0: {
                const keys = key.value.split(/[.\s]/);
                if (keys.indexOf(name) === -1) {
                    key.value = key.value.length === 0 ? name : `${key.value} ${name}`;
                }

                searching.value = true;
                addModal.visible = false;
                addModal.clean = true;
                Message.success("添加成功");
                try {
                    QuerySucceed(await getApi(val));
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
        }
    } catch (error) {
        console.error("(add_submit)", `url:${error.config?.url}`, error);
        Message.error("服务器错误");
    }
}

const updateModal = reactive({
    visible: false,
    data: {}
});


/**
 * 提交修改
 * 
 * @param {PasswordDataType} form_data 
 */
function update_submit(form_data) {
    Modal.confirm({
        title: "提示",
        content: "确认修改？",
        width: 300,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
            const id = form_data.id;
            const name = form_data.name;
            const account = form_data.account;
            const password = form_data.password;
            const remark = form_data.remark;
            const resp = await updateApi(id, name, account, password, remark);
            console.log("updatePasswords:", resp);
            switch (resp.code) {
                case 0: {
                    searching.value = true;
                    updateModal.visible = false;
                    Message.success("修改成功");
                    try {
                        const getResp = await getApi(key.value);
                        searching.value = false;
                        if (getResp.code === 0) {
                            passwordData.value = getResp.data;
                        }
                    } catch (error) {
                        console.error("(okUpdate)", `url:${error.config?.url}`, error);
                        QueryError();
                    }
                    break;
                }
                case 1: {
                    console.log("updatePasswords:", `修改失败，返回信息：${resp.msg}`)
                    Message.error("修改失败");
                    Message.error("可能存在相同名称的数据");
                    break;
                }
            }
        }
    });
}

const displayModal = reactive({
    visible: false,
    data: {}
});

/**
 * @param {PasswordDataType} record 
 */
function table_cell_dblclick(record) {
    displayModal.data = record;
    displayModal.visible = true;
}

</script>

<template>
    <ALayout>
        <ALayoutHeader>
            <APageHeader @back="$router.push({ name: 'index' })">
                <template #title>
                    <span> 密码查询 </span>
                </template>
                <template #extra>
                    <ASpace>
                        <span>数据条数:</span>
                        <ASelect v-model="tablePaginationProps.pageSize">
                            <AOption v-for="item in tablePaginationProps.pageSizeOptions" :value="item">
                                {{ item }} 条/页
                            </AOption>
                        </ASelect>
                    </ASpace>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent>
            <ALayout>
                <ALayoutHeader style="padding:8px">
                    <ARow justify="center">
                        <ACol :xs="24" :sm="17" :md="15" :lg="13" :xl="11" :xxl="9">
                            <ARow>
                                <ACol flex="105px">
                                    <AButton size="large" @click="addModal.visible = true">
                                        <template #icon>
                                            <i class="fa-solid fa-plus fa-fw"></i>
                                        </template>
                                        添加
                                    </AButton>
                                </ACol>
                                <ACol flex="1">
                                    <AInputSearch v-model="key" size="large" allow-clear
                                        :button-props="{ type: 'secondary' }" search-button @keydown.enter="Search"
                                        @search="Search" :loading="searching">
                                        <template #prefix>
                                            <i class="fa-duotone fa-terminal fa-fw"></i>
                                        </template>
                                        <template #button-icon>
                                            <i class="fa-solid fa-magnifying-glass fa-fw"></i>
                                        </template>
                                    </AInputSearch>
                                </ACol>
                            </ARow>
                        </ACol>
                    </ARow>
                </ALayoutHeader>
                <ALayoutContent>
                    <ARow justify="center" style="height:100%">
                        <ACol v-bind="{ xs: 24, sm: 22, md: 20, lg: 18, xl: 16, xxl: 14 }" style="height: 100%">
                            <ATable ref="pwdTableRef" :columns="tableColumns" :data="tableData" row-key="id"
                                :scroll="tableScroll" :loading="searching" :pagination="tablePaginationProps"
                                :page-position="tablePagePosition">
                                <template #empty>
                                    <AEmpty>
                                        <template #image>
                                            <img :src="SearchNoResultSvg" style="width: 300px;height: 300px" />
                                        </template>
                                    </AEmpty>
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

    <!-- 右键菜单 -->
    <DSXMenu v-bind="tableMenu" v-model:visible="tableMenu.visible" min-width="100px" :z-index="1002" />
    <!-- 添加信息模态框 -->
    <AddModal v-model:visible="addModal.visible" v-model:cleaning="addModal.cleaning" @submit="add_submit" />
    <!-- 更新信息模态框 -->
    <UpdateModal v-model:visible="updateModal.visible" :data="updateModal.data" @submit="update_submit" />
    <!-- 展示信息模态框 -->
    <DisplayModal v-model:visible="displayModal.visible" :data="displayModal.data" />
</template>

<style scoped>
.arco-layout,
.arco-layout-content {
    width: 100%;
    height: 100%;
}

.arco-layout-content {
    overflow: hidden;
}

.arco-table {
    box-sizing: border-box;
    padding-bottom: v-bind(tablePaddingBottom);
}

.arco-table :deep(.arco-spin) {
    justify-content: space-between;
}
</style>