<template>
    <div ref="menu" class="dropdown-menu" :style="{left:x,top:y,display:display}" @contextmenu.prevent.stop>
        <button class="dropdown-item" @click="callback1">复制</button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" @click="callback2">删除</button>
        <button class="dropdown-item" @click="callback3">修改</button>
    </div>
</template>

<script>
export default {
    name: "contextMenu",
    data() {
        return {
            x: 0,
            y: 0,
            display: "none",
            width: 158,
            height: 129,
            target: null,
            currentTarget: null
        }
    },
    methods: {
        setLocation(x, y) {
            this.x = x + "px";
            this.y = y + "px";
        },
        show() {
            this.display = "block";
        },
        hide() {
            this.display = "none";
        },
        callback1() {
            navigator.clipboard.writeText(this.target.innerText).then(function () {
                console.log("剪切板写入成功");
            }, function () {
                console.log("剪切板写入失败");
            });
        },
        callback2() {
            if (confirm("确认删除？")) {
                let id = Number(this.currentTarget.attributes["data-id"].value);
                let dataList = this.$parent.$data.dataList;
                for (let key in dataList) {
                    let i = Number(key);
                    if (dataList[i].id === id) {
                        dataList.splice(i, 1);
                        return;
                    }
                }
            }
        },
        callback3() {
            let id = Number(this.currentTarget.attributes["data-id"].value);
            let dataList = this.$parent.$data.dataList;
            for (let data of dataList) {
                if (data.id === id) {
                    window.sessionStorage['update_id'] = id;
                    window.sessionStorage['update_name'] = data.name;
                    window.sessionStorage['update_account'] = data.account;
                    window.sessionStorage['update_password'] = data.password;
                    window.sessionStorage['update_remark'] = data.remark;
                    this.$parent.$options.methods.open_updatePasswordModal();
                    return;
                }
            }
        }
    }
}
</script>

<style scoped>
.dropdown-menu {
    box-shadow: 0 0 10px #646464;
}
</style>