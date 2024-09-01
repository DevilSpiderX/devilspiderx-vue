<script setup lang="ts">
import { TableColumnData } from "@arco-design/web-vue";
import { PasswordDataType } from "../types/password-data";

type Props = {
    value: {
        column: TableColumnData;
        record: PasswordDataType;
        rowIndex: number;
    };
};

const props = defineProps<Props>();
const emit = defineEmits<{
    contextmenu: [column: TableColumnData, record: PasswordDataType, rowIndex: number, event: MouseEvent];
    dblclick: [record: PasswordDataType, event: MouseEvent];
}>();

function handle_td_contextmenu(event: MouseEvent) {
    const { value } = props;
    if (value.record.disabled) return;
    event.preventDefault();
    emit("contextmenu", value.column, value.record, value.rowIndex, event);
}

function handle_td_dblclick(event: MouseEvent) {
    const { value } = props;
    if (value.record.disabled) return;
    emit("dblclick", value.record, event);
}
</script>

<template>
    <td
        class="query-td"
        @contextmenu="handle_td_contextmenu"
        @dblclick="handle_td_dblclick">
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
