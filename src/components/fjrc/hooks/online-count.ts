import axios from "axios";
import { onMounted, onUnmounted, ref } from "vue";
import { useFjrcStore } from "../stores/FjrcStore";

export function useOnlineCount() {
    const onlineCount = ref(0);
    const fjrcStore = useFjrcStore();

    async function getOnlineCount() {
        const fingerprint = fjrcStore.fingerprint;
        const { data } = await axios.get("/api/fjrc/onlineCount", {
            params: { fingerprint }
        });
        fjrcStore.fingerprint = data.fingerprint;
        onlineCount.value = data.count;
    }

    let intervalId: NodeJS.Timer | undefined;
    onMounted(() => {
        getOnlineCount();
        intervalId = setInterval(getOnlineCount, 300_000);
    });

    onUnmounted(() => {
        clearInterval(intervalId);
    });

    return {
        onlineCount
    };
}