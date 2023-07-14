import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFjrcStore = defineStore("fjrcStore", () => {
    //setup

    const last = ref<Record<string, number>>({});

    return {
        last,
    }
}, {
    persist: {
        storage: localStorage,
        paths: [
            "last"
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