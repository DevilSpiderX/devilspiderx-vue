<script setup lang="ts">
import { isDefined } from "@/utils/validate.ts";
import { computed, ref, useTemplateRef } from "vue";

const props = withDefaults(
    defineProps<{
        text: string;
        fontSize?: number;
        loading?: boolean;
    }>(),
    {
        fontSize: 16,
        loading: false,
    },
);

const textLines = computed(() => {
    return props.text.split(/\n|\r\n/);
});

const scrollbarRef = useTemplateRef("scrollbarRef");

function backTop(isSmooth?: boolean) {
    const option = { top: 0, behavior: isSmooth ? "smooth" : undefined };
    scrollbarRef.value?.scrollTo(option);
}

function toBottom(isSmooth?: boolean) {
    const option = { top: logWrapperRef.value?.clientHeight, behavior: isSmooth ? "smooth" : undefined };
    scrollbarRef.value?.scrollTo(option);
}

const scrollData = ref({
    left: 0,
    top: 0,
});

function onScrollbarScroll(event: Event) {
    if (!isDefined(event.target)) {
        return;
    }
    const target = event.target as HTMLElement;
    scrollData.value = {
        left: target.scrollLeft,
        top: target.scrollTop,
    };
}

const logWrapperRef = useTemplateRef("logWrapperRef");
const logWrapperStyle = computed(() => ({
    fontSize: props.fontSize + "px",
}));

defineExpose({
    backTop,
    toBottom,
});
</script>

<template>
    <ASpin
        :loading="loading"
        class="log-monitor-spin"
    >
        <AScrollbar
            ref="scrollbarRef"
            class="log-monitor-scrollbar"
            outer-class="log-monitor-scrollbar-outer"
            @scroll="onScrollbarScroll"
        >
            <AEmpty v-if="text === ''" />
            <div
                v-else
                ref="logWrapperRef"
                class="log-wrapper"
                :style="logWrapperStyle"
            >
                <div
                    v-for="(item, index) of textLines"
                    class="text-line"
                >
                    <span class="serial"> {{ index + 1 }} </span>
                    <div class="text-content">{{ item }}</div>
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
    border-radius: 0.25rem;
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
    overflow-wrap: break-word;
    line-height: 1.5;
}

.text-line {
    display: flex;
    display: -webkit-flex;
}

.serial {
    color: var(--color-text-3);
    font-size: 0.8em;
    line-height: 1.875;
    margin-right: 1em;
    user-select: none;
}

.text-content {
    flex-basis: 100%;
}
</style>
