import { computed, ref, watch, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { useEventListener } from '@/scripts/event';

export const useAppConfigs = defineStore("appConfigs", () => {
    //setup
    const client = ref<{ width: number, height: number }>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEventListener(window, "resize", () => {
        client.value.width = document.documentElement.clientWidth;
        client.value.height = document.documentElement.clientHeight;
    });

    const darkTheme = ref<boolean>(false);

    const themeName = computed<string>(() => darkTheme.value ? "dark" : "light");

    watchEffect(() => {
        document.body.setAttribute("arco-theme", themeName.value);
    });

    const themeFollowSystem = ref<boolean>(false);

    watchEffect(() => {
        if (themeFollowSystem.value) {
            darkTheme.value = window.matchMedia('(prefers-color-scheme:dark)').matches;
        }
    });

    const statusBarColor = ref<string>("");

    const themeColorMetaElement = document.createElement("meta");
    themeColorMetaElement.setAttribute("name", "theme-color");
    document.head.append(themeColorMetaElement);
    watch(statusBarColor, statusBarColor => {
        themeColorMetaElement.setAttribute("content", statusBarColor);
    });

    function backgroundColor2StatusBarColor() {
        statusBarColor.value = window.getComputedStyle(document.body).backgroundColor;
    }

    const user = ref<{ uid: string | undefined, admin: boolean, login: boolean, checkIntervalTime: number }>({
        uid: undefined,
        admin: false,
        login: false,
        checkIntervalTime: 600 * 1000 //ms
    });

    const query = ref<{ history: string | undefined }>({
        history: undefined
    });

    const log = ref<{ fontSize: number }>({
        fontSize: 16
    });

    return {
        client,
        darkTheme,
        themeName,
        themeFollowSystem,
        statusBarColor,
        backgroundColor2StatusBarColor,
        user,
        query,
        isTouchDevice: ref<boolean>("ontouchstart" in window && navigator.maxTouchPoints !== 0),
        log
    }
}, {
    persist: {
        storage: localStorage,
        paths: [
            "darkTheme",
            "themeFollowSystem",
            "user.uid",
            "isTouchDevice",
            "log"
        ]
    }
});