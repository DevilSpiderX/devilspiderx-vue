import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFjrcStore = defineStore("fjrcStore", () => {
    //setup

    const last = ref<Record<"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H", number>>({
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        H: 0
    });
    const fingerprint = ref<string>();

    interface HistoryItem {
        right: boolean,
        answer: string
    }

    type History = Record<"A" | "B" | "C" | "D" | "E" | "F" | "G" | "H", Array<HistoryItem | undefined | null>>;

    const history = ref<History>({
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: []
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