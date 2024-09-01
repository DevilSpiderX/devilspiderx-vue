import { onMounted, onUnmounted, ref } from "vue";
import { getOnlineCountApi } from "../api/fjrc-api";
import { useFjrcStore } from "../stores/FjrcStore";

export function useOnlineCount() {
    const onlineCount = ref(0);
    const fjrcStore = useFjrcStore();

    async function refresh() {
        const fingerprint = fjrcStore.fingerprint;
        const resp = await getOnlineCountApi(fingerprint);
        fjrcStore.fingerprint = resp.fingerprint;
        onlineCount.value = resp.count;
        return true;
    }

    let intervalId: NodeJS.Timeout | undefined;
    onMounted(() => {
        refresh();
        intervalId = setInterval(refresh, 300_000);
    });

    onUnmounted(() => {
        clearInterval(intervalId);
    });

    return {
        onlineCount,
        refresh,
    };
}
