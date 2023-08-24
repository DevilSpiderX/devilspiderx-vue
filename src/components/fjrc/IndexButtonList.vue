<script setup lang="ts">
import { useAppConfigs } from "@/store/AppConfigsStore";
import { computed, nextTick, ref, watchEffect } from "vue";

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

const containerRef = ref<HTMLDivElement>();
const containerWidth = ref(0);
const containerHeight = ref(0);

watchEffect(() => {
    appConfigs.client.width;
    appConfigs.client.height;
    if (containerRef.value) {
        containerWidth.value = containerRef.value.clientWidth;
        containerHeight.value = containerRef.value.clientHeight;
    }
});


const columnCount = computed(() => Math.floor(containerWidth.value / 40));

const rowCount = computed(() => columnCount.value === 0 ? 0 : Math.ceil(props.count / columnCount.value));

const listHeight = computed(() => rowCount.value * 40);

const scrollTop = ref(0);

function onContainerScroll(ev: UIEvent) {
    if (ev.target) {
        //@ts-ignore
        scrollTop.value = ev.target.scrollTop;
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

const scrollWatchStop = watchEffect(async () => {
    if (listHeight.value !== 0 && containerRef.value) {
        await nextTick();
        const rowIndex = Math.floor(props.id / columnCount.value);
        containerRef.value.scrollTo({ top: rowIndex * 40 });
        scrollWatchStop();
    }
});

</script>

<template>
    <div class="container" ref="containerRef" @scroll="onContainerScroll">
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
            </template>
        </div>
    </div>
</template>

<style scoped>
.container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;
}

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