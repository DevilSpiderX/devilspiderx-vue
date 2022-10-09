<template>
    <div class="my-card">
        <header>
            <h3><i class="fa-solid fa-rss fa-fw"></i>网络信息</h3>
        </header>
        <transition name="body">
            <div class="my-card-body" v-if="bodyShow">
                <div style="min-width: 200px;padding: 10px 0;">
                    <div>
                        <i class="fas fa-cloud-upload-alt fa-fw"></i>
                        <span id="network-upload">上传速度：{{ networkData.uploadSpeedStr }}</span>
                    </div>
                    <br>
                    <div>
                        <i class="fas fa-cloud-download-alt fa-fw"></i>
                        <span id="network-download">下载速度：{{ networkData.downloadSpeedStr }}</span>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="empty">
            <el-empty image-size="100" v-if="empty"/>
        </transition>
    </div>
</template>

<script>
export default {
    name: "NetworkCard",
    data() {
        return {
            networkData: {
                downloadSpeed: 0,
                downloadSpeedStr: "0 B/s",
                uploadSpeed: 0,
                uploadSpeedStr: "0 B/s"
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
            Object.assign(this.networkData, newVal);
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
    align-items: center;
}
</style>