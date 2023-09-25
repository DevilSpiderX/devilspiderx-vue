import { onMounted, onUnmounted, ref } from "vue";
import { getOnlineCountApi } from "../scripts/fjrc-api";
import { useFjrcStore } from "../stores/FjrcStore";

export function useOnlineCount() {
    const onlineCount = ref(0);
    const fjrcStore = useFjrcStore();

    async function refresh() {
        const fingerprint = fjrcStore.fingerprint;
        const resp = await getOnlineCountApi(fingerprint);
        if (resp.code === 0) {
            const data = resp.data;
            fjrcStore.fingerprint = data.fingerprint;
            onlineCount.value = data.count;
        }
        return resp.code === 0;
    }

    let intervalId: NodeJS.Timer | undefined;
    onMounted(() => {
        refresh();
        intervalId = setInterval(refresh, 300_000);
    });

    onUnmounted(() => {
        clearInterval(intervalId);
    });

    return {
        onlineCount,
        refresh
    };
}