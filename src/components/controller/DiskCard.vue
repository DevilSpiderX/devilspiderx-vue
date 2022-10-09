<template>
    <div class="my-card">
        <header>
            <h3><i class="fa-solid fa-hdd fa-fw"></i>硬盘分区 {{ diskIndex }}</h3>
        </header>
        <transition name="body">
            <div class="my-card-body" v-if="bodyShow">
                <div>{{ diskData.label }}({{ diskData.mount }})</div>
                <el-progress :show-text="false" :stroke-width="22" :color="progress.colors"
                             :percentage="this.diskData.used / this.diskData.total * 100"/>
                <div>{{ diskData.freeStr }}可用，共 {{ diskData.totalStr }}</div>
            </div>
        </transition>
        <transition name="empty">
            <el-empty image-size="100" v-if="empty"/>
        </transition>
    </div>
</template>

<script>
export default {
    name: "DiskCard",
    data() {
        return {
            diskData: {
                fSType: "",
                free: 0,
                freeStr: "0 B",
                label: "",
                mount: "",
                name: "",
                total: 1,
                totalStr: "0 B",
                usage: "0%",
                used: 0,
                usedStr: "0 B"
            },
            progress: {
                colors: [
                    {color: '#28a745', percentage: 70},
                    {color: '#ffc107', percentage: 90},
                    {color: '#dc3545', percentage: 100},
                ]
            },
            empty: true,
            bodyShow: false
        }
    },
    props: {
        value: Object,
        diskIndex: Number
    },
    watch: {
        value(newVal) {
            Object.assign(this.diskData, newVal);
            this.empty = false;
            setTimeout(function () {
                this.bodyShow = true;
            }.bind(this), 300);
        }
    }
}
</script>

<style scoped>
@import url(/src/css/controller/card-transition.css);

.my-card {
    --el-card-border-color: var(--el-border-color-light);
    --el-card-border-radius: 4px;
    --el-card-padding: 20px;
    --el-card-bg-color: var(--el-fill-color-blank);
    border-radius: var(--el-card-border-radius);
    border: 1px solid var(--el-card-border-color);
    background-color: var(--el-card-bg-color);
    overflow: hidden;
    color: var(--el-text-color-primary);
    transition: var(--el-transition-duration);
    z-index: 100;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
}

.my-card:hover {
    z-index: 101;
    box-shadow: var(--el-box-shadow-dark);
}

header {
    padding: 18px 20px;
    background-color: #fcfcfc;
    border-bottom: 1px solid var(--el-card-border-color);
}

header > h3 {
    text-align: center;
    margin: 0;
    user-select: none;
}

.my-card-body {
    height: 100%;
    min-height: 10px;
    padding: 20px 30px 30px;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    justify-content: center;
}
</style>