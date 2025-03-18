import type { LineSeriesOption } from "echarts/charts";
import type { GridComponentOption, TooltipComponentOption } from "echarts/components";
import type { ComposeOption, EChartsCoreOption } from "echarts/core";

export type ECOption =
    | EChartsCoreOption
    | ComposeOption<LineSeriesOption | TooltipComponentOption | GridComponentOption>;

const imports = Promise.all([
    import("echarts/core"),
    import("echarts/charts"),
    import("echarts/components"),
    import("echarts/renderers"),
]);

export async function getEchartsAsync() {
    const [core, charts, components, renderers] = await imports;

    const { LineChart } = charts;
    const { GridComponent, TooltipComponent } = components;
    const { CanvasRenderer } = renderers;

    core.use([LineChart, TooltipComponent, GridComponent, CanvasRenderer]);
    return core;
}
