<script setup lang="ts">
import { deleteApi } from "@/api/query-api.ts";
import SearchNoResultSvg from "@/assets/搜索无结果.svg";
import { DSXMenu } from "@/components/dsx-menu";
import { getLogger } from "@/plugins/logger.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { debounce } from "@/utils/util.ts";
import { isDefined } from "@/utils/validate.ts";
import { Table as ATable, Message, Modal, type TableColumnData, type TableSortable } from "@arco-design/web-vue";
import { AxiosError } from "axios";
import { computed, Fragment, h, ref, watch } from "vue";
import { AddModal, DisplayModal, QueryTd, UpdateModal } from "./components";
import { usePasswordSearch } from "./hooks/password-search.ts";
import { useTableBodyScrollWrap } from "./hooks/table-body-scroll-wrap.ts";
import { useTableMenu } from "./hooks/table-menu.tsx";
import type { DataType, PasswordDataType } from "./types/password-data.ts";

const logger = getLogger(import.meta.filePath);
const appConfigs = useAppConfigs();

const sortable: TableSortable = {
    sortDirections: ["ascend", "descend"],
    sorter: (_a, _b, { dataIndex, direction }) => {
        const a = _a as PasswordDataType;
        const b = _b as PasswordDataType;

        if (a.id < 0 && b.id < 0) {
            return 0;
        } else if (a.id < 0) {
            return 1;
        } else if (b.id < 0) {
            return -1;
        }

        const aData = a[dataIndex];
        const bData = b[dataIndex];

        if (direction === "ascend") {
            return aData < bData ? -1 : aData > bData ? 1 : 0;
        } else {
            return aData < bData ? 1 : aData > bData ? -1 : 0;
        }
    },
};

const tableColumns = ref<TableColumnData[]>([
    { title: "名称", dataIndex: "name", ellipsis: true, tooltip: { position: "tl" }, sortable },
    { title: "账号", dataIndex: "account", ellipsis: true, tooltip: true, sortable },
    { title: "密码", dataIndex: "password", ellipsis: true, tooltip: true, sortable },
    { title: "备注", dataIndex: "remark", ellipsis: true, tooltip: { position: "tr" }, sortable },
]);

const pwdTableRef = ref<InstanceType<typeof ATable> | null>(null);
const { tableBodyScrollWrap, setTableScrollTop } = useTableBodyScrollWrap(pwdTableRef);

const {
    key,
    passwordData,
    tablePaginationTotal,
    tablePaginationCurrent,
    tablePaginationPageSize,
    tablePaginationPageCount,
    searching,
    search,
} = usePasswordSearch();

const search_debounce = debounce(search, 100);

watch(tablePaginationPageSize, value => {
    logger.set(import.meta.codeLineNum).debug(`table page size change:${value}`);
    search_debounce();
});

watch(tablePaginationCurrent, async value => {
    logger.set(import.meta.codeLineNum).debug(`table page change:${value}`);
    await search_debounce();
    setTableScrollTop(0);
});

const tableClientDataMinCount = computed(() => {
    const clientHeight = appConfigs.client.height;
    const availableHeight = tablePaginationPageCount.value > 1 ? clientHeight - 200 : clientHeight - 156;

    return Math.floor(availableHeight / 43);
});

const tableData = computed({
    get: () => {
        const data: PasswordDataType[] = passwordData.value.map(v => ({
            id: v.id,
            name: v.name,
            account: v.account || "",
            password: v.password || "",
            remark: v.remark || "",
        }));
        const len = data.length;
        if (len === 0) {
            return [];
        }
        const pageSize = tablePaginationPageSize.value;
        const dataMinCount = tableClientDataMinCount.value;
        const onePageLineCount = Math.min(dataMinCount, pageSize);

        const n = onePageLineCount - (len % pageSize);
        for (let i = 0; i < n && n < onePageLineCount; i++) {
            data.push({
                id: -(i + 1),
                name: "\xA0",
                account: "\xA0",
                password: "\xA0",
                remark: "\xA0",
                disabled: true,
            });
        }
        return data;
    },
    set: data => (passwordData.value = data),
});

const tablePaginationProps = ref({
    total: tablePaginationTotal,
    pageSize: tablePaginationPageSize,
    "onUpdate:pageSize": (newPageSize: number) => (tablePaginationPageSize.value = newPageSize),
    current: tablePaginationCurrent,
    "onUpdate:current": (newCurrent: number) => (tablePaginationCurrent.value = newCurrent),
    hideOnSinglePage: true,
    simple: computed(() => appConfigs.client.width < 450),
    pageSizeOptions: [10, 20, 30, 40, 50, 200, 500, 1000],
});

const tablePagePosition = computed(() => (appConfigs.client.width < 450 ? "br" : "bottom"));

const tableScroll = ref({
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
    y: "100%",
});

const tablePaddingBottom = computed(() => (tablePaginationPageCount.value > 1 ? "12px" : undefined));

async function onSearch() {
    try {
        await search_debounce(0);
        setTableScrollTop(0);
    } catch (error) {
        logger.set(import.meta.codeLineNum).error("出现错误", error);
    }
}

const { tableMenu, tableMenuIcons, tableMenuItemStyle } = useTableMenu();

function onTableCellContextmenu(
    _column: TableColumnData,
    record: PasswordDataType,
    rowIndex: number,
    event: MouseEvent,
) {
    const column = _column as TableColumnData & { dataIndex: string };

    tableMenu.value.menus = [
        //判断是内容是网址的时候才会出现
        {
            label: "打开",
            onClick: () => window.open(record[column.dataIndex]),
            style: tableMenuItemStyle,
            icon: tableMenuIcons.globe,
            disappeared: !/^http(s)?:\/\/.+(:\d{1,5})?\/?[\w\/\?=&]*$/.test(record[column.dataIndex]),
        },
        //复制按钮
        {
            label: "复制",
            onClick: () => {
                if (typeof navigator.clipboard === "object") {
                    navigator.clipboard
                        .writeText(record[column.dataIndex])
                        .then(() => {
                            Message.success({
                                id: "copy_success",
                                content: "复制成功",
                            });
                        })
                        .catch(() => {
                            Message.error({
                                id: "copy_error",
                                content: "复制失败",
                            });
                        });
                }
            },
            style: tableMenuItemStyle,
            icon: tableMenuIcons.copy,
        },
        //删除按钮
        {
            label: "删除",
            onClick: () => {
                Modal.confirm({
                    title: "提示",
                    // content: `确认删除(${record.name})？`,
                    content: () => h(Fragment, ["确认删除( ", h("strong", record.name), " )？"]),
                    width: 300,
                    okText: "确定",
                    cancelText: "取消",
                    onOk: async () => {
                        const resp = await deleteApi(record.id);
                        if (resp) {
                            tablePaginationTotal.value--;
                            if (tablePaginationCurrent.value > tablePaginationPageCount.value) {
                                tablePaginationCurrent.value--;
                            }
                            search_debounce();
                        } else {
                            Message.error("删除失败");
                        }
                    },
                });
            },
            style: tableMenuItemStyle,
            icon: tableMenuIcons.trash_xmark,
        },
        //编辑按钮
        {
            label: "编辑",
            onClick: async () => {
                updateModal.value = {
                    visible: true,
                    data: record,
                };
            },
            style: tableMenuItemStyle,
            icon: tableMenuIcons.pen_to_square,
        },
        //查看按钮
        {
            label: "查看",
            onClick: () => {
                onTableCellDblclick(record);
            },
            style: tableMenuItemStyle,
            icon: tableMenuIcons.eye,
        },
    ];

    //滚动表格消除右键菜单
    tableBodyScrollWrap.value?.addEventListener("scroll", closeTableMenu, { once: true });
    //窗体尺寸变化消除右键菜单
    window.addEventListener("resize", closeTableMenu, { once: true });

    tableMenu.value.event = event;
    tableMenu.value.visible = true;
}

function closeTableMenu() {
    tableMenu.value.visible = false;
    removeTableMenuListener();
}

function removeTableMenuListener() {
    tableBodyScrollWrap.value?.removeEventListener("scroll", closeTableMenu);
    window.removeEventListener("resize", closeTableMenu);
}

const addModal = ref({
    visible: false,
});

async function onAddModalSuccess(name: string) {
    const keys = key.value.split(/[.\s]/);
    if (keys.indexOf(name) === -1) {
        key.value = key.value.length === 0 ? name : `${key.value} ${name}`;
    }

    searching.value = true;
    addModal.value.visible = false;
    Message.success("添加成功");
    try {
        await search_debounce(0);
        setTableScrollTop(0);
    } catch (error) {
        if (error instanceof AxiosError) {
            logger.set(import.meta.codeLineNum).error(`url:${error.config?.url}`, error);
        } else {
            logger.set(import.meta.codeLineNum).error("", error);
        }
    }
}

function onAddModalError(error: any) {
    Message.error({
        content: () => h("span", null, ["添加失败", h("br"), "可能该名称已存在", h("br"), "请尝试换一个名称再添加"]),
    });
    if (isDefined(error)) {
        Message.error({ content: error });
    }
    addModal.value.visible = false;
}

const updateModal = ref({
    visible: false,
    data: {
        id: -1,
        name: "",
        account: "",
        password: "",
        remark: "",
    },
});

function onUpdateModalSuccess(data: DataType) {
    updateModal.value.visible = false;
    Message.success("修改成功");
    for (const _data of passwordData.value) {
        if (_data.id === data.id) {
            _data.name = data.name;
            _data.account = data.account;
            _data.password = data.password;
            _data.remark = data.remark;
            break;
        }
    }
}

function onUpdateModalError(error: any) {
    Message.error("修改失败");
    if (isDefined(error)) {
        Message.error({ content: error });
    } else {
        Message.error("可能存在相同名称的数据");
    }
}

const displayModal = ref({
    visible: false,
    data: { name: "", account: "", password: "", remark: "" },
});

function onTableCellDblclick(record: PasswordDataType) {
    displayModal.value = {
        data: record,
        visible: true,
    };
}
</script>

<template>
    <ALayout>
        <ALayoutHeader>
            <APageHeader @back="$router.push({ name: 'index' })">
                <template #title>
                    <span>密码查询</span>
                </template>
                <template #extra>
                    <ASpace>
                        <span>数据条数:</span>
                        <ASelect v-model="tablePaginationPageSize">
                            <AOption
                                v-for="item in tablePaginationProps.pageSizeOptions"
                                :value="item"
                            >
                                {{ item }} 条/页
                            </AOption>
                        </ASelect>
                    </ASpace>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent>
            <ALayout>
                <ALayoutHeader style="padding: 8px">
                    <ARow justify="center">
                        <ACol v-bind="{ xs: 24, sm: 17, md: 15, lg: 13, xl: 11, xxl: 9 }">
                            <ARow>
                                <ACol flex="105px">
                                    <AButton
                                        size="large"
                                        @click="addModal.visible = true"
                                    >
                                        <template #icon>
                                            <i class="fa-solid fa-plus fa-fw"></i>
                                        </template>
                                        添加
                                    </AButton>
                                </ACol>
                                <ACol flex="1">
                                    <AInputSearch
                                        v-model="key"
                                        size="large"
                                        allow-clear
                                        :button-props="{ type: 'secondary' }"
                                        search-button
                                        @keydown.enter="onSearch"
                                        @search="onSearch"
                                        :loading="searching"
                                    >
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
                    <ARow
                        justify="center"
                        style="height: 100%"
                    >
                        <ACol
                            v-bind="{ xs: 24, sm: 22, md: 20, lg: 18, xl: 16, xxl: 14 }"
                            style="height: 100%"
                        >
                            <ATable
                                ref="pwdTableRef"
                                :columns="tableColumns"
                                :data="tableData"
                                row-key="id"
                                :scroll="tableScroll"
                                :loading="searching"
                                :pagination="tablePaginationProps"
                                :page-position="tablePagePosition"
                            >
                                <template #empty>
                                    <AEmpty>
                                        <template #image>
                                            <img
                                                :src="SearchNoResultSvg"
                                                style="width: 300px; height: 300px"
                                            />
                                        </template>
                                    </AEmpty>
                                </template>
                                <template #td="scope">
                                    <QueryTd
                                        :value="scope"
                                        @contextmenu="onTableCellContextmenu"
                                        @dblclick="onTableCellDblclick"
                                    />
                                </template>
                            </ATable>
                        </ACol>
                    </ARow>
                </ALayoutContent>
            </ALayout>
        </ALayoutContent>
    </ALayout>

    <!-- 右键菜单 -->
    <DSXMenu
        v-bind="tableMenu"
        v-model:visible="tableMenu.visible"
        min-width="100px"
        :z-index="1002"
    />
    <!-- 添加信息模态框 -->
    <AddModal
        v-model:visible="addModal.visible"
        @success="onAddModalSuccess"
        @error="onAddModalError"
    />
    <!-- 更新信息模态框 -->
    <UpdateModal
        v-model:visible="updateModal.visible"
        :data="updateModal.data"
        @success="onUpdateModalSuccess"
        @error="onUpdateModalError"
    />
    <!-- 展示信息模态框 -->
    <DisplayModal
        v-model:visible="displayModal.visible"
        :data="displayModal.data"
    />
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
