import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";

const themeColorMetaElement: HTMLMetaElement = document.querySelector("meta[name=theme-color]")!;
const colorMatchMedia = window.matchMedia("(prefers-color-scheme:dark)");

const lightStatusBarColor = "#ffffff",
    darkStatusBarColor = "#17171a";

export const useAppConfigs = defineStore(
    "appConfigs",
    () => {
        //setup

        /** 窗口的宽高 */
        const client = ref<{ width: number; height: number }>({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
        });

        new ResizeObserver(() => {
            const rect = document.documentElement.getBoundingClientRect();
            client.value.width = rect.width;
            client.value.height = rect.height;
        }).observe(document.documentElement);

        /** 是否深色模式 */
        const darkTheme = ref<boolean>(false);

        /** 主题名 */
        const themeName = computed<string>(() => (darkTheme.value ? "dark" : "light"));

        watchEffect(() => {
            document.body.setAttribute("arco-theme", themeName.value);
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

        /** 日志窗口相关配置 */
        const log = ref<{ fontSize: number }>({
            fontSize: 16,
        });

        /** 版本号 */
        const appVersion = ref("");

        axios.get("/api/user/status").then(resp => {
            appVersion.value = resp.headers["application-version"];
        });

        return {
            client,
            darkTheme,
            themeFollowSystem,
            statusBarColor,
            isTouchDevice: ref<boolean>("ontouchstart" in window && navigator.maxTouchPoints !== 0),
            log,
            appVersion,
        };
    },
    {
        persist: {
            storage: localStorage,
            pick: ["darkTheme", "themeFollowSystem", "isTouchDevice", "log", "appVersion"],
        },
    },
);
