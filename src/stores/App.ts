import { eventBus } from "@/plugins/eventBus";
import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";

const colorMatchMedia = window.matchMedia("(prefers-color-scheme:dark)");

const themeColorMetaElement: HTMLMetaElement = document.querySelector("meta[name=theme-color]")!;
const lightStatusBarColor = "#ffffff";
const darkStatusBarColor = "#17171a";

export const useAppStore = defineStore(
    "appStore",
    () => {
        const width = ref(document.documentElement.clientWidth);
        const height = ref(document.documentElement.clientHeight);

        new ResizeObserver(() => {
            const rect = document.documentElement.getBoundingClientRect();
            width.value = rect.width;
            height.value = rect.height;
            eventBus.emit("ClientResize", width.value, height.value);
        }).observe(document.documentElement);

        const sizeExport = {
            width,
            height,
        };

        /** 是否深色模式 */
        const darkTheme = ref<boolean>(false);
        watchEffect(() => {
            const { classList } = document.documentElement;
            if (darkTheme.value) {
                classList.add("dark");
            } else {
                classList.remove("dark");
            }
        });

        /** 主题是否跟随系统 */
        const themeFollowSystem = ref<boolean>(false);

        watchEffect(() => {
            if (themeFollowSystem.value) {
                darkTheme.value = colorMatchMedia.matches;
            }
        });

        colorMatchMedia.onchange = event => {
            if (themeFollowSystem.value) {
                darkTheme.value = event.matches;
            }
        };

        /** 状态栏颜色 */
        const statusBarColor = ref<string>();

        watchEffect(() => {
            themeColorMetaElement.setAttribute(
                "content",
                statusBarColor.value || (darkTheme.value ? darkStatusBarColor : lightStatusBarColor),
            );
        });

        const themeExport = {
            darkTheme,
            themeFollowSystem,
            statusBarColor,
        };

        /** 版本号 */
        const appVersion = ref("");

        return {
            ...sizeExport,
            ...themeExport,
            appVersion,
        };
    },
    {
        persist: {
            storage: localStorage,
            pick: ["darkTheme", "themeFollowSystem", "appVersion"],
        },
    },
);
