import { defineStore } from 'pinia';

interface State {
    darkTheme: boolean,
    themeFollowSystem: boolean,
    user: {
        uid: string | undefined,
        admin: boolean,
        login: boolean
    },
    query: {
        history: string | undefined
    }
}

export const useAppConfigs = defineStore("appConfigs", {
    state: (): State => ({
        darkTheme: false,
        themeFollowSystem: false,
        user: {
            uid: undefined,
            admin: false,
            login: false
        },
        query: {
            history: undefined
        }
    }),
    getters: {
        themeName: (state): string => state.darkTheme ? "dark" : "light"
    },
    actions: {
        setThemeFollowSystem() {
            this.darkTheme = window.matchMedia('(prefers-color-scheme:dark)').matches;
        }
    },
    persist: {
        storage: localStorage,
        paths: [
            "darkTheme",
            "themeFollowSystem",
            "user.uid"
        ]
    }
});