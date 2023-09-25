<script setup>
import { debounce } from "@/util/util";
import { Message } from "@arco-design/web-vue";
import { useOnlineCount } from "./hooks/online-count";

const { onlineCount, refresh } = useOnlineCount();

/**
 * @param {()=>{}} stopSpining 
 */
async function _onOnlineCountRefresh(stopSpining) {
    try {
        const succ = await refresh();
        if (succ) {
            Message.success({
                id: "online-count-refresh",
                content: "刷新成功"
            });
        } else {
            Message.error({
                id: "online-count-refresh",
                content: "刷新失败"
            });
        }
    } catch (e) {
        Message.error(`错误信息：${e.message}`);
    }
    stopSpining();
}

const onOnlineCountRefresh = debounce(_onOnlineCountRefresh, 2000);

</script>

<template>
    <RouterView :online-count="onlineCount" @online-count-refresh="onOnlineCountRefresh" />
</template>