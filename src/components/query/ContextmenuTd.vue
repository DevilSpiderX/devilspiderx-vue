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
const emit = defineEmits(["contextmenu"]);

function handle_td_contextmenu(event: MouseEvent) {
    const {value} = props;
    emit("contextmenu", value.column, value.record, value.rowIndex, event);
}

</script>

<template>
    <td class="user-select-none" @contextmenu.prevent="handle_td_contextmenu">
        <slot />
    </td>
</template>

<style scoped>
.user-select-none {
    user-select: none;
}
</style>