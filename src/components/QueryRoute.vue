<template>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <a href="javascript:void(0)" @click="on_backA_clicked" class="nav-back-button">
            <i class="fas fa-arrow-left" style="font-size: 1.2rem;"></i>
        </a>
        <!-- 导航栏LOGO -->
        <a class="navbar-brand font-weight-bold">DevilSpiderX</a>

        <!-- 自适应弹出按钮 -->
        <button class="navbar-toggler" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 导航栏菜单 -->
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <button type="button" class="btn btn-success" @click="$refs.addPM.open()">
                        <i class="fas fa-plus fa-fw" style="font-size: 20px;"></i>
                        添加
                    </button>
                </li>
            </ul>
        </div>
    </nav>

    <!-- 主体 -->
    <div class="container">
        <div class="card">
            <div class="card-header">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text"><i class="fas fa-terminal fa-fw"></i></span>
                    </div>
                    <input class="form-control" type="text" placeholder="查询值" v-model="key"
                           @keydown.enter="on_searchButton_clicked">
                    <div class="input-group-append">
                        <!-- 搜索按钮 -->
                        <button class="btn btn-secondary" @click="on_searchButton_clicked">
                            <i class="fas fa-search fa-fw"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body my-card-body overflow-auto">
                <table class="table table-hover table-bordered">
                    <thead class="thead-dark">
                    <tr>
                        <th>名称</th>
                        <th>账号</th>
                        <th>密码</th>
                        <th>备注</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(data,index) in dataList" :key="index" :data-id="data.id">
                        <td @contextmenu.prevent.stop="tableRow_contextmenu($event,data.name,data)">
                            {{ data.name }}
                        </td>
                        <td @contextmenu.prevent.stop="tableRow_contextmenu($event,data.account,data)">
                            {{ data.account }}
                        </td>
                        <td @contextmenu.prevent.stop="tableRow_contextmenu($event,data.password,data)">
                            {{ data.password }}
                        </td>
                        <td @contextmenu.prevent.stop="tableRow_contextmenu($event,data.remark,data)">
                            {{ data.remark }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <ContextMenu ref="rowMenu" v-if="rowMenuData.show" @updateRecord="open_updatePasswordModal"/>

    <!-- 添加密码模态框 -->
    <AddPasswordModal ref="addPM" @addSuc="add_update_PM_Success" @querySuc="querySucceed"/>

    <!-- 修改密码模态框 -->
    <UpdatePasswordModal ref="updatePM" @updateSuc="add_update_PM_Success" @querySuc="querySucceed"/>
</template>

<script>
import {setThemeColor} from "@/js/global";
import {query} from "@/js/server-api";
import router from "@/router";
import ContextMenu from "@/components/query/ContextMenu";
import AddPasswordModal from "@/components/query/AddPasswordModal";
import UpdatePasswordModal from "@/components/query/UpdatePasswordModal";


export default {
    name: "QueryRoute",
    components: {ContextMenu, AddPasswordModal, UpdatePasswordModal},
    data() {
        return {
            key: "",
            dataList: [
                // {id: -1, name: "名称", account: "账号", password: "密码", remark: "备注"}
            ],
            rowMenuData: {
                show: false
            }
        }
    }, methods: {
        on_backA_clicked() {
            window.sessionStorage.removeItem('history_query_key');
            router.back();
        },
        on_searchButton_clicked() {
            window.sessionStorage['history_query_key'] = this.key;
            query(this.key, this.querySucceed);
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
                    this.dataList = [{id: -1, name: "查", account: "无", password: "此", remark: "项"}];
                    break;
                }
            }
        },
        add_update_PM_Success(key) {
            this.key = key;
        },
        tableRow_contextmenu(ev, value, data) {
            if (data.id < 0) return;
            this.rowMenuData.show = true;
            this.$nextTick(function () {
                let menu = this.$refs.rowMenu;
                menu.value = value;
                menu.values = data;
                let rightX = ev.clientX + menu.width;
                let bottomY = ev.clientY + menu.height;
                if (rightX >= window.innerWidth - 10) {
                    menu.x = ev.pageX - menu.width;
                } else {
                    menu.x = ev.pageX;
                }
                if (bottomY >= window.innerHeight - 10) {
                    menu.y = ev.pageY - menu.height;
                } else {
                    menu.y = ev.pageY;
                }
                this.addEventListener();
            });
        },
        windowCloseMenu() {
            this.rowMenuData.show = false;
            this.removeEventListener();
        },
        addEventListener() {
            window.addEventListener("scroll", this.windowCloseMenu);
            window.addEventListener("click", this.windowCloseMenu);
            window.addEventListener("resize", this.windowCloseMenu);
        },
        removeEventListener() {
            window.removeEventListener("scroll", this.windowCloseMenu);
            window.removeEventListener("click", this.windowCloseMenu);
            window.removeEventListener("resize", this.windowCloseMenu);
        },
        open_updatePasswordModal(values) {
            this.$refs.updatePM.open();
            this.$refs.updatePM.values = values;
        }
    }, beforeMount() {
        setThemeColor("#343A40");
    },
    mounted() {
        window.queryVue = this;
        let routeQuery = router.currentRoute.value.query;
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
        this.removeEventListener();
    }
}
</script>

<style scoped src="../css/nav-back-button.css"></style>

<style scoped>
.container {
    margin-top: 10px;
    user-select: none;
}

.my-card-body {
    padding: 0;
}

.my-card-body::-webkit-scrollbar {
    display: none;
}

tr[data-id] td {
    min-width: 8em;
}
</style>