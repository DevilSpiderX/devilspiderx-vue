import type { LineSeriesOption } from "echarts/charts";
import { LineChart } from "echarts/charts";
import type { GridComponentOption, TitleComponentOption, TooltipComponentOption } from "echarts/components";
import { GridComponent, TitleComponent, TooltipComponent } from "echarts/components";
import type { ComposeOption } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

export type ECOption = ComposeOption<
    LineSeriesOption | TitleComponentOption | TooltipComponentOption | GridComponentOption
>;

echarts.use([LineChart, TitleComponent, TooltipComponent, GridComponent, CanvasRenderer]);

export default echarts;
