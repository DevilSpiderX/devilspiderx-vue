import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFjrcStore = defineStore("fjrcStore", () => {
    //setup

    type Banks = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P";

    const last = ref<Record<Banks, number>>({
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        H: 0,
        I: 0,
        J: 0,
        K: 0,
        L: 0,
        M: 0,
        N: 0,
        O: 0,
        P: 0
    });
    const fingerprint = ref<string>();

    interface HistoryItem {
        right: boolean,
        answer: string | Array<string>
    }

    type History = Record<Banks, Array<HistoryItem | undefined | null>>;

    const history = ref<History>({
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
        I: [],
        J: [],
        K: [],
        L: [],
        M: [],
        N: [],
        O: [],
        P: []
    });

    const historyKey = ref("");

    return {
        last,
        fingerprint,
        history,
        historyKey
    }
}, {
    persist: {
        storage: localStorage,
        paths: [
            "last",
            "fingerprint",
            "history",
            "historyKey"
        ]
    }
});