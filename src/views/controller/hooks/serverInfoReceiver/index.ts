import { eventBus } from "@/plugins/eventBus.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import type { ValuesType } from "@/types/server-info.ts";
import { isBlank, isDefined } from "@/utils/validate.ts";
import { onUnmounted, ref } from "vue";
import { AjaxServerInfoReceiver } from "./AjaxServerInfoReceiver.ts";
import { SSEServerInfoReceiver } from "./SSEServerInfoReceiver.ts";
import type { ServerInfoReceiver } from "./type/index.ts";
import { WSServerInfoReceiver } from "./WSServerInfoReceiver.ts";

export function useServerInfoReceiver(cd: number) {
    const userStore = useUserStore();

    const values = ref<ValuesType>({
        cpu: undefined,
        memory: undefined,
        networks: [],
        disks: [],
        os: undefined,
    });

    eventBus.on("SIReceiver:update", info => (values.value = info));

    let receiver: ServerInfoReceiver | null = null;

    if ("EventSource" in window) {
        _initSSEServerInfoReceiver();
    } else if ("WebSocket" in window) {
        _initWebSocketServerInfoReceiver();
    } else {
        _initAjaxServerInfoReceiver();
    }

    function _initWebSocketServerInfoReceiver() {
        close();

        if (isBlank(userStore.token)) {
            eventBus.emit("InvalidToken");
            return;
        }

        receiver = new WSServerInfoReceiver(userStore.token, cd, () => {
            _initAjaxServerInfoReceiver();
        });
    }

    function _initSSEServerInfoReceiver() {
        close();

        if (isBlank(userStore.token)) {
            eventBus.emit("InvalidToken");
            return;
        }

        receiver = new SSEServerInfoReceiver(userStore.token, cd, () => {
            _initAjaxServerInfoReceiver();
        });
    }

    function _initAjaxServerInfoReceiver() {
        close();
        receiver = new AjaxServerInfoReceiver(cd);
    }

    function setCD(cd: number) {
        receiver?.setCD(cd);
    }

    function close() {
        if (!isDefined(receiver)) return;

        receiver.close();
        receiver = null;
    }

    onUnmounted(() => {
        close();
    });

    return {
        values,
        setCD,
        close,
    };
}
