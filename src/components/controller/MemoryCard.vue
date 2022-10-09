<template>
    <el-card :body-style="{padding:'20px 30px'}" shadow="hover">
        <template #header>
            <h3 style="margin: 0;"><i class="fa-solid fa-memory fa-fw"></i>内存</h3>
        </template>
        <transition name="body">
            <div class="my-card-body" v-if="bodyShow">
                <!-- 已用 -->
                <div>已 用：&nbsp;&nbsp;{{ memoryData.usedStr }}</div>
                <!-- 剩余 -->
                <div>剩 余：&nbsp;&nbsp;{{ memoryData.freeStr }}</div>
                <!-- 总量 -->
                <div>总 量：&nbsp;&nbsp;{{ memoryData.totalStr }}</div>
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
        </transition>
        <transition name="empty">
            <el-empty image-size="100" v-if="empty"/>
        </transition>
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
            empty: true,
            bodyShow: false
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
            setTimeout(function () {
                this.bodyShow = true;
            }.bind(this), 300);
        }
    }
}
</script>

<style scoped>
@import url(/src/css/controller/card-transition.css);

.my-card-body {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
}

.progress-bar {
    display: flex;
}
</style>