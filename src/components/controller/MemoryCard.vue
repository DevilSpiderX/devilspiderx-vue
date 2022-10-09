<template>
    <div class="my-card">
        <header>
            <h3><i class="fa-solid fa-memory fa-fw"></i>内存</h3>
        </header>
        <transition name="body">
            <div class="my-card-body" v-if="bodyShow">
                <!-- 已用 -->
                <div>已 用：&nbsp;&nbsp;{{ memoryData_usedStr }}</div>
                <!-- 剩余 -->
                <div>剩 余：&nbsp;&nbsp;{{ memoryData_freeStr }}</div>
                <!-- 总量 -->
                <div>总 量：&nbsp;&nbsp;{{ memoryData_totalStr }}</div>
                <br/>
                <!-- 使用率 -->
                <div class="progress-bar">
                    <div style="width: 4em;">使用率：</div>
                    <div style="width: calc(100% - 4em)">
                        <el-progress :stroke-width="22" :percentage="this.memoryData.used / this.memoryData.total * 100"
                                     :color="progress.colors" v-slot="{percentage}">
                            <span style="font-size: 1rem;">{{ percentage.toFixed(2) }}%</span>
                        </el-progress>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="empty">
            <el-empty :image-size="100" v-if="empty"/>
        </transition>
    </div>
</template>

<script>
export default {
    name: "MemoryCard",
    data() {
        return {
            memoryData: {
                total: 1,
                used: 0,
                free: 0,
                format: {
                    total: {value: 0, unit: "B"},
                    used: {value: 0, unit: "B"},
                    free: {value: 0, unit: "B"}
                }
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
        value: Object
    },
    watch: {
        value(newVal) {
            Object.assign(this.memoryData, newVal);
            this.empty = false;
            setTimeout(function () {
                this.bodyShow = true;
            }.bind(this), 300);
        }
    },
    computed: {
        memoryData_usedStr() {
            let data = this.memoryData.format.used;
            return `${data.value} ${data.unit}`;
        },
        memoryData_freeStr() {
            let data = this.memoryData.format.free;
            return `${data.value} ${data.unit}`;
        },
        memoryData_totalStr() {
            let data = this.memoryData.format.total;
            return `${data.value} ${data.unit}`;
        },
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
    padding: 20px 30px 30px;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    justify-content: space-between;
}

.progress-bar {
    display: -webkit-flex;
    display: flex;
}
</style>