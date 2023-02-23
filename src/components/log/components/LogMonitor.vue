<script setup>
import { Scrollbar as AScrollbar } from "@arco-design/web-vue";
import { computed, reactive } from 'vue';
import { useLogWrapperRef, useScrollbarRef } from "../hooks/refs";

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

const textLines = computed(() => {
    return props.text.split(/\n|\r\n/);
});

const scrollbarRef = useScrollbarRef();

function backTop(isSmooth) {
    scrollbarRef.value?.scrollTo({ top: 0, behavior: isSmooth ? "smooth" : undefined });
}

const scrollData = reactive({
    left: 0,
    top: 0
});

function on_scrollbar_scroll(event) {
    scrollData.left = event.target?.scrollLeft;
    scrollData.top = event.target?.scrollTop;
}

const logWrapperRef = useLogWrapperRef();
const logWrapperStyle = computed(() => ({
    fontSize: props.fontSize + "px"
}));

function toBottom(isSmooth) {
    scrollbarRef.value?.scrollTo({ top: logWrapperRef.value?.clientHeight, behavior: isSmooth ? "smooth" : undefined });
}

defineExpose({
    backTop,
    toBottom
});
</script>

<template>
    <ASpin :loading="loading" class="log-monitor-spin">
        <AScrollbar class="log-monitor-scrollbar" outer-class="log-monitor-scrollbar-outer" @scroll="on_scrollbar_scroll"
            ref="scrollbarRef">
            <AEmpty v-if="text === ''" />
            <div v-else class="log-wrapper" :style="logWrapperStyle" ref="logWrapperRef">
                <div v-for="(item, index) of textLines" class="text-line">
                    <span class="serial"> {{ index + 1 }} </span>
                    <div class="text-content"> {{ item }} </div>
                </div>
            </div>
        </AScrollbar>
    </ASpin>
</template>

<style scoped>
.log-monitor-spin,
.log-monitor-scrollbar-outer,
.log-monitor-scrollbar-outer :deep(.log-monitor-scrollbar) {
    width: 100%;
    height: 100%;
    border-radius: .25rem;
}

.log-monitor-scrollbar-outer {
    border: 1px solid #ced4da;
    box-sizing: border-box;
    box-shadow: var(--shadow2-center);
}

.log-monitor-scrollbar-outer :deep(.log-monitor-scrollbar) {
    overflow: auto;
}

.log-wrapper {
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

.text-line {
    display: flex;
    display: -webkit-flex;
}

.serial {
    color: var(--color-text-3);
    font-size: .8em;
    line-height: 1.875;
    margin-right: 1em;
}

.text-content {
    flex-basis: 100%;
}
</style>