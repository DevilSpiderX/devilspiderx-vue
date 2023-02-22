import { Scrollbar as AScrollbar } from "@arco-design/web-vue";
import { ref } from "vue";
import { LogMonitor } from "../components";

export function useLogMonitorRef() {
    return ref<InstanceType<typeof LogMonitor> | null>(null)
}

export function useScrollbarRef() {
    return ref<InstanceType<typeof AScrollbar> | null>(null);
}

export function useLogWrapperRef() {
    return ref<HTMLDivElement | null>(null);
}