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
                    <a class="btn btn-success" href="#addPasswordModal" data-toggle="modal">
                        <i class="fas fa-plus fa-fw" style="font-size: 20px;"></i>
                        添加
                    </a>
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
                    <tr v-for="data in dataList" :data-id="data.id" @contextmenu.prevent.stop="tableRow_contextmenu">
                        <td>{{ data.name }}</td>
                        <td>{{ data.account }}</td>
                        <td>{{ data.password }}</td>
                        <td>{{ data.remark }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <context-menu ref="rowMenu"></context-menu>

    <!-- 添加密码模态框 -->
    <div class="modal fade" id="addPasswordModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- 添加密码模态框头部 -->
                <div class="modal-header justify-content-center">
                    <h4 class="modal-title">添加密码记录</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>

                <!-- 添加密码模态框主体 -->
                <div class="modal-body">
                    <div class="col-12">
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-tag fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" id="add_name" placeholder="名称">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-user fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" id="add_account" placeholder="账号">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-key fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" id="add_password" placeholder="密码">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-info fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" id="add_remark" placeholder="备注">
                        </div>
                    </div>
                </div>

                <!-- 添加密码模态框底部 -->
                <div class="modal-footer justify-content-around">
                    <button type="button" class="btn btn-success btn-lg shadow" onclick="on_addButton_clicked()">
                        添加
                    </button>
                    <button type="button" class="btn btn-danger btn-lg shadow" data-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>

    <!-- 修改密码模态框 -->
    <div class="modal fade" id="updatePasswordModal">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- 修改密码模态框头部 -->
                <div class="modal-header justify-content-center">
                    <h4 class="modal-title">修改密码记录</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                </div>

                <!-- 修改密码模态框主体 -->
                <div class="modal-body">
                    <div class="col-12">
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fab fa-orcid fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="number" id="update_id" placeholder="ID" disabled>
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-tag fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" id="update_name" placeholder="名称">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-user fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" id="update_account" placeholder="账号">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-key fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" id="update_password" placeholder="密码">
                        </div>
                        <div class="input-group shadow">
                            <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fas fa-info fa-fw"></i></span>
                            </div>
                            <input class="form-control" type="text" id="update_remark" placeholder="备注">
                        </div>
                    </div>
                </div>

                <!-- 修改密码模态框底部 -->
                <div class="modal-footer justify-content-around">
                    <button type="button" class="btn btn-success btn-lg shadow" onclick="on_updateButton_clicked()">
                        修改
                    </button>
                    <button type="button" class="btn btn-danger btn-lg shadow" data-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {setThemeColor} from "@/js/global";
import {query} from "@/js/server-api";
import contextMenu from "@/components/widget/contextMenu";
import router from "@/router";

export default {
    name: "query",
    components: {contextMenu},
    data() {
        return {
            key: "",
            dataList: [
                {id: "-1", name: "无", account: "无", password: "无", remark: "无"}
            ]
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
                    this.dataList = [];
                    break;
                }
            }
        },
        tableRow_contextmenu(ev) {
            let menu = this.$refs.rowMenu;
            menu.target = ev.target;
            menu.currentTarget = ev.currentTarget;
            let x = 0;
            let y = 0;
            let rightX = ev.clientX + menu.width;
            let bottomY = ev.clientY + menu.height;
            if (rightX >= window.innerWidth - 10) {
                x = ev.pageX - menu.width;
            } else {
                x = ev.pageX;
            }
            if (bottomY >= window.innerHeight - 10) {
                y = ev.pageY - menu.height;
            } else {
                y = ev.pageY;
            }
            menu.setLocation(x, y);
            menu.show();
            this.addEventListener();
        },
        windowCloseMenu() {
            this.$refs.rowMenu.hide();
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
        open_updatePasswordModal() {
            console.log("update");
        }
    }, beforeMount() {
        setThemeColor("#343A40");
    },
    mounted() {
        window.queryVue = this;
        let routeQuery = router.currentRoute.value.query;
        if (routeQuery.hasOwnProperty("key")) {
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

<style scoped>
@import "@/css/nav-back-button.css";

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
</style>