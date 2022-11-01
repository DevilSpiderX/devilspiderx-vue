<template>
    <div class="my-card">
        <header>
            <h3><i class="fa-solid fa-microchip fa-fw"></i>CPU</h3>
        </header>
        <transition name="body">
            <div class="my-card-body" v-if="bodyShow">
                <!-- 名称 -->
                <div>名 称：{{ cpuData.name }}</div>
                <!-- 物理核心数 -->
                <div>物理核心数：&nbsp;{{ cpuData.physicalNum }}</div>
                <!-- 逻辑核心数 -->
                <div>逻辑核心数：&nbsp;{{ cpuData.logicalNum }}</div>
                <!-- 是否64位CPU -->
                <div>处理器位宽：&nbsp;{{ cpuData.is64bit ? "64" : "32" }}</div>
                <!-- CPU温度 -->
                <div>
                    <i class="fas fa-thermometer-half fa-fw"></i>
                    温 度：&nbsp;{{ cpuData.cpuTemperature }} ℃
                </div>
                <br/>
                <!-- CPU使用率 -->
                <div class="progress-bar">
                    <div style="width: 4em;">使用率：</div>
                    <div style="width: calc(100% - 4em)">
                        <el-progress :stroke-width="22" :percentage="this.cpuData.usedRate * 100"
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
    name: "CpuCard",
    data() {
        return {
            cpuData: {
                name: "",
                physicalNum: 0,
                logicalNum: 0,
                usedRate: 0,
                is64bit: true,
                cpuTemperature: 0
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
        async value(newVal) {
            Object.assign(this.cpuData, newVal);
            this.empty = false;
            await sleep(300);
            this.bodyShow = true;
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
    justify-content: space-between;
}

.progress-bar {
    display: -webkit-flex;
    display: flex;
}
</style>