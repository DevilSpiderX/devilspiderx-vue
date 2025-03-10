<script setup lang="ts">
import echarts, { ECOption } from "@/components/echarts/index.ts";
import { isDefined } from "@/utils/validate.ts";
import { EChartsType } from "echarts/core";
import { onMounted, onUnmounted, ref, shallowRef, useTemplateRef, watch } from "vue";

const dataMaxCount = 100;

interface Props {
    data: {
        value: number;
    };
}

const props = defineProps<Props>();

watch(
    () => props.data,
    ({ value }) => {
        const now = new Date();
        const { x: xData, line: lineData } = data.value;
        xData.push(formatDate(now));
        if (xData.length > dataMaxCount) {
            xData.shift();
        }
        lineData.push(value * 100);
        if (lineData.length > dataMaxCount) {
            lineData.shift();
        }
    },
);

function formatDate(date: Date) {
    const hour = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    const sec = date.getSeconds().toString().padStart(2, "0");
    return `${hour}:${min}:${sec}`;
}

const containerRef = useTemplateRef("containerRef");

const myChart = shallowRef<EChartsType | null>(null);

const containerObserver = new ResizeObserver(() => {
    if (!isDefined(myChart.value) || !isDefined(containerRef.value)) {
        return;
    }
    const { clientWidth, clientHeight } = containerRef.value;

    myChart.value.resize({
        width: clientWidth,
        height: clientHeight,
    });
});

const data = ref<{
    x: Array<string>;
    line: Array<number>;
}>({
    x: [],
    line: [],
});
{
    const now = new Date().getTime();
    for (let i = dataMaxCount; i > 0; i--) {
        const date = new Date(now - i * 1000);
        data.value.x.push(formatDate(date));
        data.value.line.push(0);
    }
}

watch(
    data,
    ({ x, line }) => {
        if (!isDefined(myChart.value)) return;
        myChart.value.setOption<ECOption>({
            xAxis: [
                {
                    data: x,
                },
            ],
            series: [
                {
                    name: "使用率",
                    data: line,
                },
            ],
        });
    },
    {
        deep: 2,
    },
);

const defaultOption: ECOption = {
    xAxis: [
        {
            name: "时间",
            type: "category",
            axisLine: {
                symbol: ["none", "arrow"],
            },
            axisLabel: {
                hideOverlap: true,
            },
            data: data.value.x,
        },
    ],
    yAxis: [
        {
            name: "使用率",
            type: "value",
            min: 0,
            max: 100,
            axisLabel: {
                formatter: "{value}%",
            },
            axisLine: {
                show: true,
                symbol: ["none", "arrow"],
            },
        },
    ],
    series: [
        {
            type: "line",
            name: "使用率",
            data: data.value.line,
            symbol: "none",
            areaStyle: {},
        },
    ],
};

onMounted(() => {
    if (!isDefined(containerRef.value)) {
        return;
    }
    myChart.value = echarts.init(containerRef.value, null, {
        width: 0,
        height: 0,
    });
    myChart.value.setOption(defaultOption);
    containerObserver.observe(containerRef.value);
});

onUnmounted(() => {
    if (isDefined(myChart.value)) {
        myChart.value.dispose();
    }
    containerObserver.disconnect();
});
</script>

<template>
    <div
        class="container"
        ref="containerRef"
    ></div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
