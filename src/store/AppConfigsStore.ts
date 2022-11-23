import { defineStore } from 'pinia';

interface State {
    window: {
        width: number,
        height: number
    },
    darkTheme: boolean,
    themeFollowSystem: boolean,
    statusBarColor: string,
    user: {
        uid: string | undefined,
        admin: boolean,
        login: boolean,
        checkIntervalTime: number
    },
    query: {
        history: string | undefined
    },
    isTouchDevice: boolean,
    log: {
        fontSize: number
    }
}

const stateDefault: State = {
    window: {
        width: window.innerWidth,
        height: window.innerHeight
    },
    darkTheme: false,
    themeFollowSystem: false,
    statusBarColor: "",
    user: {
        uid: undefined,
        admin: false,
        login: false,
        checkIntervalTime: 600 * 1000 //ms
    },
    query: {
        history: undefined
    },
    isTouchDevice: "ontouchstart" in window && navigator.maxTouchPoints !== 0,
    log: {
        fontSize: 16
    }
};

export const useAppConfigs = defineStore("appConfigs", {
    state: (): State => stateDefault,
    getters: {
        themeName: (state): string => state.darkTheme ? "dark" : "light"
    },
    actions: {
        setThemeFollowSystem() {
            this.darkTheme = window.matchMedia('(prefers-color-scheme:dark)').matches;
        },
    },
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