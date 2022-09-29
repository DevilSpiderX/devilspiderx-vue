<template>
    <div ref="menu" class="dropdown-menu" :style="{left:left,top:top,width:width,height:height}"
         @contextmenu.prevent.stop>
        <button class="dropdown-item" @click="callback1">复制</button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" @click="callback2">删除</button>
        <button class="dropdown-item" @click="callback3">修改</button>
    </div>
</template>

<script>
export default {
    name: "ContextMenu",
    data() {
        return {
            x: 0,
            y: 0,
            width: 158,
            height: 129,
            value: null,
            values: null
        }
    },
    emits: ["updateRecord"],
    methods: {
        callback1() {
            navigator.clipboard.writeText(this.value).then(function () {
                console.log("剪切板写入成功");
            }, function () {
                console.log("剪切板写入失败");
            });
        },
        callback2() {
            if (confirm("确认删除？")) {
                let dataList = this.$parent.$data.dataList;
                dataList.splice(dataList.indexOf(this.values), 1);
            }
        },
        callback3() {
            let values = {};
            Object.assign(values, this.values)
            this.$emit("updateRecord", values);
        }
    },
    computed: {
        left() {
            return this.x + 'px';
        },
        top() {
            return this.y + 'px';
        }
    }
}
</script>

<style scoped>
.dropdown-menu {
    box-shadow: 0 0 10px #646464;
    display: block;
}
</style>