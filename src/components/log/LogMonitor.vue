<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';

const props = defineProps({
    text: {
        type: String,
        default: "",
        request: true
    },
    fontSize: {
        type: Number,
        default: 16,
        request: false
    },
    loading: {
        type: Boolean,
        default: false,
        request: false
    }
});

const scrollbarStyle = {
    overflow: "auto",
    width: "100%",
    height: "100%",
    borderRadius: ".25rem"
};

const scrollbarOuterStyle = {
    boxSizing: "border-box",
    boxShadow: "var(--shadow2-center)",
    border: "1px solid #ced4da",
    ...scrollbarStyle,
    overflow: "hidden"
};

const logWrapperStyle = computed(() => ({
    fontSize: props.fontSize + "px"
}));

const scrollbarRef = ref();
const scrollbarContainerRef = ref();
onMounted(() => {
    scrollbarContainerRef.value = scrollbarRef.value.$refs.containerRef
})
function backTop() {
    scrollbarContainerRef.value.scrollTo({ top: 0, behavior: "smooth" });
}
defineExpose({
    backTop
});
</script>

<template>
    <ASpin :loading="$props.loading" :style="scrollbarStyle">
        <AScrollbar :style="scrollbarStyle" :outer-style="scrollbarOuterStyle" ref="scrollbarRef">
            <AEmpty v-if="$props.text === ''" />
            <div v-else class="log-wrapper" :style="logWrapperStyle">
                {{ $props.text }}
            </div>
        </AScrollbar>
    </ASpin>
</template>

<style scoped>
.log-wrapper {
    color: var(--color-text-1);
    background-color: var(--color-bg-2);
    box-sizing: border-box;
    width: 100%;
    height: auto;
    min-height: 100%;
    padding: 1rem;
    word-break: normal;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.5;
}
</style>