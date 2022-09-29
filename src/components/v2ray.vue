<template>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <a href="javascript:void(0)" @click="this.$router.back()" class="nav-back-button">
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
                <li class="nav-item"></li>
            </ul>
        </div>
    </nav>

    <!-- 主体 -->
    <div class="container">
        <div id="card-container" class="row">
            <div class="col-12 col-sm-11 col-md-9 col-lg-7 col-xl-6">
                <div class="card shadow">
                    <div class="card-header">
                        <h3 style="text-align: center;">V2Ray开关</h3>
                    </div>
                    <div class="card-body ">
                        <Switch ref="v2Switch" @click="on_switch_clicked"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Switch from "@/components/v2ray/Switch";
import {v2rayState, v2rayStart, v2rayStop} from "@/js/server-api";
import {setThemeColor} from "@/js/global";

let switch$;
export default {
    name: "v2ray",
    components: {
        Switch
    },
    data() {
        return {}
    },
    methods: {
        on_switch_clicked() {
            if (switch$.is_on()) {
                v2rayStop(function (resp) {
                    switch (resp["code"]) {
                        case 0: {
                            switch$.switch_off();
                            break;
                        }
                        case 1: {
                            alert(resp["msg"]);
                            break;
                        }
                        case 2: {
                            switch$.switch_off();
                            console.log(resp["msg"]);
                            break;
                        }
                        case 101: {
                            alert("没有管理员权限");
                            break;
                        }
                    }
                })
            } else {
                v2rayStart(function (resp) {
                    switch (resp["code"]) {
                        case 0: {
                            switch$.switch_on();
                            break;
                        }
                        case 1: {
                            alert(resp["msg"]);
                            break;
                        }
                        case 2: {
                            switch$.switch_on();
                            console.log(resp["msg"]);
                            break;
                        }
                        case 101: {
                            alert("没有管理员权限");
                            break;
                        }
                    }
                })
            }
        }
    },
    beforeMount() {
        setThemeColor("#343A40");
    },
    mounted() {
        switch$ = this.$refs.v2Switch;
        v2rayState(function (resp) {
            if (resp["code"] === 1) {
                switch$.switch_on();
            } else {
                switch$.switch_off();
            }
        });
    }
}
</script>

<style scoped src="../css/nav-back-button.css"></style>

<style scoped>
#card-container {
    margin-top: 5rem;
    align-items: center;
    justify-content: center;
}

.card-body {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 12rem;
}
</style>