import type { LineSeriesOption } from "echarts/charts";
import { LineChart } from "echarts/charts";
import type { GridComponentOption, TooltipComponentOption } from "echarts/components";
import { GridComponent, TooltipComponent } from "echarts/components";
import type { ComposeOption, EChartsCoreOption } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

export type ECOption =
    | EChartsCoreOption
    | ComposeOption<LineSeriesOption | TooltipComponentOption | GridComponentOption>;

echarts.use([LineChart, TooltipComponent, GridComponent, CanvasRenderer]);

export default echarts;
