import { eventBus } from "@/plugins/eventBus.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import type { ValuesType } from "@/types/server-info.ts";
import { isBlank, isDefined } from "@/utils/validate.ts";
import { onUnmounted, readonly, ref } from "vue";
import { AjaxServerInfoReceiver } from "./AjaxServerInfoReceiver.ts";
import { SSEServerInfoReceiver } from "./SSEServerInfoReceiver.ts";
import type { ServerInfoReceiver } from "./type/index.ts";
import { WSServerInfoReceiver } from "./WSServerInfoReceiver.ts";

export type ProtocolType = "WebSocket" | "SSE" | "Ajax";

export function useServerInfoReceiver(cd: number) {
    const userStore = useUserStore();

    let _cd = cd;
    const protocol = ref<ProtocolType>("SSE");
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

        receiver = new WSServerInfoReceiver(userStore.token, _cd, () => {
            _initAjaxServerInfoReceiver();
        });
        protocol.value = "WebSocket";
    }

    function _initSSEServerInfoReceiver() {
        close();

        if (isBlank(userStore.token)) {
            eventBus.emit("InvalidToken");
            return;
        }

        receiver = new SSEServerInfoReceiver(userStore.token, _cd, () => {
            _initAjaxServerInfoReceiver();
        });
        protocol.value = "SSE";
    }

    function _initAjaxServerInfoReceiver() {
        close();
        receiver = new AjaxServerInfoReceiver(_cd);
        protocol.value = "Ajax";
    }

    function setCD(cd: number) {
        receiver?.setCD(cd);
        _cd = cd;
    }

    function close() {
        if (!isDefined(receiver)) return;

        receiver.close();
        receiver = null;
    }

    onUnmounted(() => {
        close();
    });

    function changeProtocol(protocol: "WebSocket" | "SSE" | "Ajax") {
        switch (protocol) {
            case "WebSocket": {
                _initWebSocketServerInfoReceiver();
                break;
            }
            case "SSE": {
                _initSSEServerInfoReceiver();
                break;
            }
            case "Ajax": {
                _initAjaxServerInfoReceiver();
                break;
            }
            default: {
                throw new Error("不支持的协议类型: " + protocol);
            }
        }
    }

    return {
        values,
        protocol: readonly(protocol),
        setCD,
        close,
        changeProtocol,
    };
}
