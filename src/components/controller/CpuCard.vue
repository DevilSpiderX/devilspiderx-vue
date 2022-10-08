<template>
    <el-card :body-style="{padding:'20px 30px'}" shadow="hover">
        <template #header>
            <h3 style="text-align: center;margin: 0;"><i class="fa-solid fa-microchip fa-fw"></i>CPU</h3>
        </template>
        <div class="my-card-body" v-if="!empty">
            <!-- 名称 -->
            <div>名 称：{{ cpuData.name }}</div>
            <!-- 物理核心数 -->
            <div>物理核心数：{{ cpuData.physicalNum }}</div>
            <!-- 逻辑核心数 -->
            <div>逻辑核心数：{{ cpuData.logicalNum }}</div>
            <!-- 是否64位CPU -->
            <div>是否64位：{{ cpuData.is64bit ? "是" : "否" }}</div>
            <!-- CPU温度 -->
            <div>
                <i class="fas fa-thermometer-half fa-fw"></i>
                温 度：{{ cpuData.cpuTemperature }} ℃
            </div>
            <!-- CPU使用率 -->
            <div class="my-card-body-content progress-bar">
                <div style="width: 4em;">使用率：</div>
                <div style="width: calc(100% - 4em)">
                    <el-progress text-inside :stroke-width="22" :percentage="cpuUsedPercentage"
                                 :status="progress.status"/>
                </div>
            </div>
        </div>
        <el-empty image-size="100" v-if="empty"/>
    </el-card>
</template>

<script>
export default {
    name: "CpuCard",
    data() {
        return {
            cpuData: {
                cpuTemperature: 0,
                freePercent: "100%",
                is64bit: true,
                logicalNum: 0,
                name: "",
                physicalNum: 0,
                usedPercent: "0%",
                usedRate: 0
            },
            progress: {
                status: "success"
            },
            empty: true
        }
    },
    props: {
        value: Object
    },
    computed: {
        cpuUsedPercentage() {
            return Number((this.cpuData.usedRate * 100).toFixed(2));
        }
    },
    watch: {
        value(newVal) {
            Object.assign(this.cpuData, newVal);
            if (this.cpuUsedPercentage < 70) {
                this.progress.status = "success";
            } else if (this.cpuUsedPercentage < 90) {
                this.progress.status = "warning";
            } else {
                this.progress.status = "exception";
            }
            this.empty = false;
        }
    }
}
</script>

<style scoped>
.my-card-body {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
}

.progress-bar {
    display: flex;
}
</style>