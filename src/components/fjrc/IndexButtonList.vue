<script setup lang="ts">
import { useAppConfigs } from "@/store/AppConfigsStore";
import { sleep } from "@/util/util";
import { Scrollbar as AScrollbar } from "@arco-design/web-vue";
import { computed, onMounted, ref, useCssModule, watchEffect, watchPostEffect } from "vue";

const props = defineProps<{
    id: number;
    count: number;
    indexButtonTypes: Record<number, "text" | "dashed" | "outline" | "primary" | "secondary">;
    indexButtonColors: Record<number, "normal" | "success" | "warning" | "danger">;
}>();

const emit = defineEmits<{
    click: [id: number]
}>();

const appConfigs = useAppConfigs();
const $style = useCssModule();

const scrollbarRef = ref<InstanceType<typeof AScrollbar> | null>(null);
const scrollbarContainerRef = ref<HTMLDivElement | null>(null);
watchPostEffect(() => {
    scrollbarRef.value;
    scrollbarContainerRef.value = document.querySelector(`.${$style.scrollbar}`);
});

const containerWidth = ref(0);
const containerHeight = ref(0);

watchEffect(() => {
    appConfigs.client.width;
    appConfigs.client.height;
    if (scrollbarContainerRef.value) {
        containerWidth.value = scrollbarContainerRef.value.clientWidth;
        containerHeight.value = scrollbarContainerRef.value.clientHeight;
    }
});


const columnCount = computed(() => Math.floor(containerWidth.value / 40));

const rowCount = computed(() => columnCount.value === 0 ? 0 : Math.ceil(props.count / columnCount.value));

const listHeight = computed(() => rowCount.value * 40);

const scrollTop = ref(0);

function onScroll(ev: Event) {
    if (ev.target && ev.target instanceof HTMLDivElement) {
        const target = ev.target as HTMLDivElement;
        scrollTop.value = target.scrollTop;
    }
}

const showCount = computed(() => Math.ceil(containerHeight.value / 40));
const firstRowIndex = computed(() => Math.floor(scrollTop.value / 40));
const lastRowIndex = computed(() => firstRowIndex.value + showCount.value - 1);

function isRowInView(index: number): boolean {
    const start = firstRowIndex.value - 5 < 0 ? 0 : firstRowIndex.value - 5;
    const end = lastRowIndex.value + 5 > rowCount.value ? rowCount.value - 1 : lastRowIndex.value + 5;
    return index >= start && index <= end;
}

const rows = computed(() => {
    const data = [];
    for (let index = 0; index < rowCount.value; index++) {
        data.push({
            show: isRowInView(index),
            style: {
                top: `${index * 40}px`
            }
        });
    }
    return data;
});

onMounted(() => {
    const scrollWatchStop = watchPostEffect(async () => {
        if (listHeight.value !== 0 && scrollbarRef.value) {
            const rowIndex = Math.floor(props.id / columnCount.value);
            // 很奇怪，不加这个，滑块就不会自动下滑
            await sleep(0);
            scrollbarRef.value.scrollTop(rowIndex * 40);
            scrollWatchStop?.apply(this);
        }
    });
});

</script>

<template>
    <AScrollbar :class="$style.scrollbar" :outer-class="$style.scrollbarOuter" ref="scrollbarRef" @scroll="onScroll">
        <div :style="{ width: '100%', height: listHeight + 'px' }">
            <template v-for="(row, rI) in rows">
                <div v-if="row.show" class="list-row" :style="row.style">
                    <template v-for="cI in columnCount">
                        <AButton v-if="rI * columnCount + cI <= count" shape="circle"
                            @click="emit('click', rI * columnCount + cI - 1)"
                            :type="indexButtonTypes[rI * columnCount + cI - 1]"
                            :status="indexButtonColors[rI * columnCount + cI - 1]">
                            {{ rI * columnCount + cI }}
                        </AButton>
                    </template>
                </div>
                <template v-else />
            </template>
        </div>
    </AScrollbar>
</template>

<style scoped>
.list-row {
    width: 100%;
    height: 40px;
    position: absolute;
}

.list-row > button {
    margin-right: 8px;
    margin-bottom: 8px;
}
</style>

<style module>
.scrollbarOuter,
.scrollbar {
    width: 100%;
    height: 100%;
}

.scrollbar {
    overflow: auto;
}
</style>