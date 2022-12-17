<script setup lang="ts">
import { TableColumnData, TableData } from "@arco-design/web-vue";

interface Props {
    value: {
        column: TableColumnData,
        record: TableData,
        rowIndex: number
    }
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: "contextmenu", column: TableColumnData, record: TableData, rowIndex: number, event: MouseEvent): void,
    (e: "dblclick", record: TableData, event: MouseEvent): void
}>();

function handle_td_contextmenu(event: MouseEvent) {
    const { value } = props;
    emit("contextmenu", value.column, value.record, value.rowIndex, event);
}

function handle_td_dblclick(event: MouseEvent) {
    const { value } = props;
    emit("dblclick", value.record, event);
}

</script>

<template>
    <td class="query-td" @contextmenu.prevent="handle_td_contextmenu" @dblclick="handle_td_dblclick">
        <slot />
    </td>
</template>

<style scoped>
.query-td {
    user-select: none;
    -webkit-user-select: none;
    font-size: 15px;
}
</style>