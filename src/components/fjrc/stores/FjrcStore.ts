import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFjrcStore = defineStore("fjrcStore", () => {
    //setup

    const last = ref<Record<string, number>>({});
    const fingerprint = ref<string>();

    return {
        last,
        fingerprint
    }
}, {
    persist: {
        storage: localStorage,
        paths: [
            "last",
            "fingerprint"
        ]
    }
});

export const useFjrcTopicStore = defineStore("fjrcTopicStore", () => {
    //setup

    const indexButtonColors = ref<Record<string, Record<number, string>>>({
        A: {}, B: {}, C: {}, D: {}, E: {}, F: {}, G: {}, H: {}
    });

    return {
        indexButtonColors,
    }
}, {
    persist: {
        storage: sessionStorage,
        paths: [
            "indexButtonColors"
        ]
    }
});