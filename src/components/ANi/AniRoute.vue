<script setup lang="ts">
import { formatBytes } from "@/util/format-util";
import { TableColumnData, TableData } from "@arco-design/web-vue";
import { computed, onMounted, ref } from "vue";
import { getXML as getXMLApi } from "./scripts/api";

type torrent = {
    title: string;
    link: string;
    size: number;
    date: Date;
    success: boolean;
}

const torrentList = ref<torrent[]>([]);

async function getList() {
    loading.value = true;
    const xmlStr = await getXMLApi();
    const parse = new DOMParser();
    const mDom = parse.parseFromString(xmlStr, "text/xml");
    const nodeList = mDom.querySelectorAll("item");
    torrentList.value = new Array(nodeList.length);
    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList.item(i);
        const title = node.querySelector("title")?.textContent;
        const link = node.querySelector("link")?.textContent;
        const date = node.querySelector("pubDate")?.textContent;
        const size = node.querySelector("enclosure")?.getAttribute("length");
        torrentList.value.push({
            title: title ?? "加载失败",
            link: link ?? "javascript:void(0)",
            date: date ? new Date(date) : new Date(0),
            size: size ? Number(size) : 0,
            success: title != null && link != null && date != null && size != null
        });
    }
    loading.value = false;
}

onMounted(getList);

const nowDate = new Date();
const yestDate = new Date(nowDate.getTime() - 864_000_00);

function isToday(date: Date) {
    return nowDate.getFullYear() === date.getFullYear()
        && nowDate.getMonth() === date.getMonth()
        && nowDate.getDay() === date.getDay();
}

function isYesterday(date: Date) {
    return yestDate.getFullYear() === date.getFullYear()
        && yestDate.getMonth() === date.getMonth()
        && yestDate.getDay() === date.getDay();
}

function formatDate(date: Date) {
    const hours = `0${date.getHours()}`.slice(-2);
    const minutes = `0${date.getMinutes()}`.slice(-2);

    if (isToday(date)) {
        return `今天\n${hours}:${minutes}`;
    } else if (isYesterday(date)) {
        return `昨天\n${hours}:${minutes}`;
    }

    const year = `${date.getFullYear()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}/${month}/${day}\n${hours}:${minutes}`;
}

const tableColumns = ref<TableColumnData[]>([
    { title: "资源名称", slotName: "title" },
    { title: "发布时间", dataIndex: "date", cellStyle: { wordBreak: "normal" } },
    {
        title: "大小", dataIndex: "size", bodyCellStyle: (record) => {
            const { size } = record as Data;
            return {
                minWidth: `${size.length * 14}px`
            }
        },
    }
]);

type Data = TableData & {
    title: string;
    link: string;
    date: string;
    size: string;
}

const tableData = computed<Data[]>(() => {
    const list: Data[] = [];
    for (let i = torrentList.value.length - 1; i >= 0; i--) {
        const torrent = torrentList.value[i];
        if (!torrent.success) continue;
        list.push({
            title: torrent.title,
            link: torrent.link,
            date: formatDate(torrent.date),
            size: formatBytes(torrent.size, 1),
        });
    }
    return list;
});

const loading = ref(false);

</script>

<template>
    <div :class="$style.root">
        <ATable :columns="tableColumns" :data="tableData" :pagination="false" :loading="loading">
            <template #title="{ record }: { record: Data }">
                <ALink :href="record.link">
                    {{ record.title }}
                </ALink>
            </template>
        </ATable>
    </div>
</template>

<style module>
.root {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
</style>