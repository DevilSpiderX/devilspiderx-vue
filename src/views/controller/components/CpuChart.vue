<script setup lang="ts">
import echarts, { ECOption } from "@/components/echarts/index.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { isDefined } from "@/utils/validate.ts";
import { EChartsType } from "echarts/core";
import { onMounted, onUnmounted, ref, shallowRef, useTemplateRef, watch } from "vue";

const dataMaxCount = 100;

const appConfigs = useAppConfigs();

interface Props {
    data: {
        usedRate: number;
        temperature: number;
    };
}

const props = defineProps<Props>();

watch(
    () => props.data,
    ({ usedRate, temperature }) => {
        const now = new Date();
        usedRateData.value.shift();
        usedRateData.value.push({
            name: now.toString(),
            value: [now.getTime(), usedRate * 100],
        });
        cpuTempData.value.shift();
        cpuTempData.value.push({
            name: now.toString(),
            value: [now.getTime(), temperature],
        });
    },
);

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

type DataItem = {
    name: string;
    value: [number, number];
};

const usedRateData = ref<Array<DataItem>>([]);
const cpuTempData = ref<Array<DataItem>>([]);
{
    const now = new Date().getTime();
    for (let i = dataMaxCount; i > 0; i--) {
        const date = new Date(now - i * 1000);
        usedRateData.value.push({
            name: date.toString(),
            value: [date.getTime(), 0],
        });
        cpuTempData.value.push({
            name: date.toString(),
            value: [date.getTime(), 0],
        });
    }
}

watch(
    [usedRateData, cpuTempData],
    ([val0, val1]) => {
        if (!isDefined(myChart.value)) return;
        myChart.value.setOption<ECOption>({
            series: [
                {
                    name: "使用率",
                    data: val0,
                },
                {
                    name: "温度",
                    data: val1,
                },
            ],
        });
    },
    {
        deep: 2,
    },
);

const defaultOption: ECOption = {
    darkMode: appConfigs.darkTheme,
    tooltip: {
        trigger: "axis",
    },
    xAxis: [
        {
            name: "时间",
            type: "time",
            axisLabel: {
                hideOverlap: true,
            },
            axisLine: {
                symbol: "none",
            },
            splitLine: {
                show: true,
            },
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
                symbol: "none",
            },
            splitLine: {
                show: false,
            },
        },
        {
            name: "温度",
            type: "value",
            axisLine: {
                show: true,
                symbol: "none",
            },
            splitLine: {
                show: false,
            },
            scale: true,
        },
    ],
    series: [
        {
            type: "line",
            name: "使用率",
            data: usedRateData.value,
            showSymbol: false,
            areaStyle: {},
            tooltip: {
                valueFormatter(value) {
                    return `${(value as number).toFixed(2)}%`;
                },
            },
        },
        {
            type: "line",
            name: "温度",
            data: cpuTempData.value,
            showSymbol: false,
            tooltip: {
                valueFormatter(value) {
                    return `${value}℃`;
                },
            },
        },
    ],
};

function initMyChart(dom: HTMLElement) {
    const { clientWidth, clientHeight } = dom;

    myChart.value = echarts.init(dom, null, {
        width: clientWidth,
        height: clientHeight,
    });
    myChart.value.setOption(defaultOption);
}

function disposeMyChart() {
    if (isDefined(myChart.value)) {
        myChart.value.dispose();
    }
}

onMounted(() => {
    if (!isDefined(containerRef.value)) {
        return;
    }
    initMyChart(containerRef.value);
    containerObserver.observe(containerRef.value);
});

onUnmounted(() => {
    disposeMyChart();
    containerObserver.disconnect();
});

watch(
    () => appConfigs.darkTheme,
    val => {
        if (!isDefined(myChart.value)) return;
        myChart.value.setOption({
            darkMode: val,
        });
    },
);
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
