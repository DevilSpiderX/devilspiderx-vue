<script setup>
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    text: {
        type: String,
        default: ""
    },
    fontSize: {
        type: Number,
        default: 16
    }
});

const scrollbarOuterStyle = {
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
    boxShadow: "var(--shadow2-center)",
    border: "1px solid #ced4da",
    borderRadius: ".25rem"
};

const scrollbarStyle = {
    overflow: "auto",
    width: "100%",
    height: "100%",
    borderRadius: ".25rem"
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
    <a-scrollbar :outer-style="scrollbarOuterStyle" :style="scrollbarStyle" ref="scrollbarRef">
        <div class="log-wrapper" :style="logWrapperStyle">
            {{ $props.text }}
        </div>
    </a-scrollbar>
</template>

<style scoped>
.log-wrapper {
    color: var(--color-text-1);
    background-color: var(--color-bg-2);
    box-sizing: border-box;
    width: 100%;
    height: auto;
    padding: 1rem;
    word-break: normal;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.5;
}
</style>