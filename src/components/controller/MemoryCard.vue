<template>
    <el-card :body-style="{padding:'20px 30px'}" shadow="hover">
        <template #header>
            <h3 style="text-align: start;margin: 0;"><i class="fa-solid fa-memory fa-fw"></i>内存</h3>
        </template>
        <div class="my-card-body" v-if="!empty">
            <!-- 已用 -->
            <div>已 用：{{ memoryData.usedStr }}</div>
            <!-- 剩余 -->
            <div>剩 余：{{ memoryData.freeStr }}</div>
            <!-- 总量 -->
            <div>总 量：{{ memoryData.totalStr }}</div>
            <br/>
            <!-- 使用率 -->
            <div class="my-card-body-content progress-bar">
                <div style="width: 4em;">使用率：</div>
                <div style="width: calc(100% - 4em)">
                    <el-progress text-inside :stroke-width="22" :percentage="memoryUsedPercentage"
                                 :status="progress.status"/>
                </div>
            </div>
        </div>
        <el-empty image-size="100" v-if="empty"/>
    </el-card>
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
                totalStr: "0 B",
                usedStr: "0 B",
                freeStr: "0 B",
                usage: "0%"
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
        memoryUsedPercentage() {
            return Number((this.memoryData.used / this.memoryData.total * 100).toFixed(2));
        }
    },
    watch: {
        value(newVal) {
            Object.assign(this.memoryData, newVal);
            if (this.memoryUsedPercentage < 70) {
                this.progress.status = "success";
            } else if (this.memoryUsedPercentage < 90) {
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