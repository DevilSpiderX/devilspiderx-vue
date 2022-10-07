<template>
    <el-container style="padding-top: 8px;">
        <el-header>
            <el-row justify="center">
                <el-col :xs="17" :sm="15" :md="13" :lg="11" :xl="9" class="my-xxs-col">
                    <el-button size="large" style="margin-right: 10px;" @click="addButton_click">
                        <template #icon>
                            <i class="fas fa-plus fa-fw"></i>
                        </template>
                        添加
                    </el-button>
                    <el-input v-model="key" size="large" clearable style="max-width: calc(100% - 100px);"
                              @keydown.enter="search">
                        <template #prefix>
                            <i class="fas fa-terminal fa-fw"></i>
                        </template>
                        <template #append>
                            <el-button @click="search">
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
                    <el-table :data="dataList" border stripe max-height="calc(100vh - 80px)" size="large"
                              @cell-contextmenu="table_cell_contextmenu">
                        <el-table-column prop="name" label="名称" header-align="center">
                            <template v-slot="{row}">
                                <span style="user-select: none;">{{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="account" label="账号" header-align="center" show-overflow-tooltip>
                            <template v-slot="{row}">
                                <span style="user-select: none">{{ row.account }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="password" label="密码" header-align="center" show-overflow-tooltip>
                            <template v-slot="{row}">
                                <span style="user-select: none">{{ row.password }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" header-align="center" show-overflow-tooltip>
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
</template>

<script>
import {query} from "@/js/server-api";
import {ElMessage} from 'element-plus';
import {Vue3Menus} from 'vue3-menus';

export default {
    name: "QueryRoute",
    components: {Vue3Menus},
    data() {
        return {
            key: "",
            dataList: [
                // {id: -1, name: "名称", account: "账号", password: "密码", remark: "备注"}
            ],
            tableMenu: {
                open: false,
                event: {},
                menus: [
                    {
                        label: "复制",
                        click: null
                    },
                    {
                        label: "删除",
                        click: null
                    },
                    {
                        label: "修改",
                        click: null
                    }
                ]
            }
        }
    },
    methods: {
        search() {
            window.sessionStorage['history_query_key'] = this.key;
            query(this.key, this.querySucceed.bind(this));
        },

        querySucceed(resp) {
            console.log(resp);
            switch (resp["code"]) {
                case 0: {
                    this.dataList = resp["data"];
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

        addButton_click() {
            ElMessage.error("未完成");
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
                ElMessage.error("未完成");
            }.bind(this);

            let scroller = document.querySelector(".el-table__body-wrapper .el-scrollbar__wrap");
            let scrollEvent = function () {
                this.tableMenu.open = false;
                scroller.removeEventListener("scroll", scrollEvent);
            }.bind(this);
            scroller.addEventListener("scroll", scrollEvent);

            this.tableMenu.open = false;
            this.tableMenu.event = event;
            this.$nextTick(function () {
                this.tableMenu.open = true;
            }.bind(this));
        },

    }, beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
        let routeQuery = this.$router.currentRoute.value.query;
        if (Object.hasOwn(routeQuery, "key")) {
            this.key = routeQuery.key;
            window.sessionStorage['history_query_key'] = this.key;
            query(this.key, this.querySucceed);
        } else {
            let hQKey = window.sessionStorage['history_query_key'];
            if (hQKey !== undefined) {
                query(hQKey, this.querySucceed);
                this.key = hQKey;
            }
        }
    },
    unmounted() {
        window.sessionStorage.removeItem('history_query_key');
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