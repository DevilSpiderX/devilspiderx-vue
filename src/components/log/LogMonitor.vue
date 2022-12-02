<script setup>
import { computed, reactive, ref } from 'vue';
import AScrollbar from "@arco-design/web-vue/es/scrollbar";

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

const scrollbarRef = ref();

function backTop(isSmooth) {
    scrollbarRef.value.scrollTo({ top: 0, behavior: isSmooth ? "smooth" : undefined });
}

const scrollData = reactive({
    left: 0,
    top: 0
});

function scrollbar_scroll(event) {
    scrollData.left = event.target?.scrollLeft;
    scrollData.top = event.target?.scrollTop;
}

const logWrapperRef = ref();
const logWrapperStyle = computed(() => ({
    fontSize: props.fontSize + "px"
}));

function toBottom(isSmooth) {
    scrollbarRef.value.scrollTo({ top: logWrapperRef.value.clientHeight, behavior: isSmooth ? "smooth" : undefined });
}

defineExpose({
    backTop,
    toBottom
});
</script>

<template>
    <ASpin :loading="loading" :style="scrollbarStyle">
        <AScrollbar :style="scrollbarStyle" :outer-style="scrollbarOuterStyle" @scroll="scrollbar_scroll"
            ref="scrollbarRef">
            <AEmpty v-if="text === ''" />
            <div v-else class="log-wrapper" :style="logWrapperStyle" ref="logWrapperRef">
                {{ text }}
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