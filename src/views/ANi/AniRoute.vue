<script setup lang="ts">
import defaultSettings from "@/settings.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import { formatBytes } from "@/utils/format-util.ts";
import { isBlank, isDefined } from "@/utils/validate.ts";
import { TableColumnData, TableData } from "@arco-design/web-vue";
import { computed, onMounted, ref } from "vue";
import { getXML as getXMLApi } from "./scripts/api.ts";

type Torrent = {
    title: string;
    link: string;
    size: number;
    date: Date;
    success: boolean;
    downloadLink: string;
};

const userStore = useUserStore();
const torrentList = ref<Torrent[]>([]);

async function getList() {
    loading.value = true;
    const xmlStr = await getXMLApi();
    const parse = new DOMParser();
    const mDom = parse.parseFromString(xmlStr, "text/xml");
    const nodeList = mDom.querySelectorAll("item");
    torrentList.value = [];
    for (const node of nodeList) {
        const title = node.querySelector("title")?.textContent;
        const link = node.querySelector("link")?.textContent;
        const date = node.querySelector("pubDate")?.textContent;
        const size = node.querySelector("enclosure")?.getAttribute("length");
        let downloadLink: string | undefined = undefined;
        if (isDefined(title) && isDefined(link)) {
            const downloadLinkUrl = new URL(`/api/ani/file/${encodeURIComponent(title)}`, location.href);
            const urlParams = new URLSearchParams({ fileUrl: link });
            if (!isBlank(userStore.token)) {
                urlParams.set(defaultSettings.tokenName, userStore.token);
            }
            downloadLinkUrl.search = urlParams.toString();
            downloadLink = downloadLinkUrl.toString();
        }
        torrentList.value.push({
            title: title ?? "加载失败",
            link: link ?? "javascript:void(0)",
            date: date ? new Date(date) : new Date(0),
            size: size ? Number(size) : 0,
            success: isDefined(title) && isDefined(link) && isDefined(date) && isDefined(size),
            downloadLink: downloadLink ?? "",
        });
    }
    loading.value = false;
}

onMounted(getList);

const nowDate = new Date();
const yestDate = new Date(nowDate.getTime() - 864_000_00);

function isToday(date: Date) {
    return dateEquals(date, nowDate);
}

function isYesterday(date: Date) {
    return dateEquals(date, yestDate);
}

function dateEquals(date: Date, anoDate: Date) {
    return (
        date.getFullYear() === anoDate.getFullYear() &&
        date.getMonth() === anoDate.getMonth() &&
        date.getDate() === anoDate.getDate()
    );
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
        title: "大小",
        dataIndex: "size",
        bodyCellStyle: record => {
            const { size } = record as Data;
            return {
                minWidth: `${size.length * 14}px`,
            };
        },
    },
]);

type Data = TableData & {
    title: string;
    link: string;
    date: string;
    size: string;
    downloadLink: string;
};

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
            downloadLink: torrent.downloadLink,
        });
    }
    return list;
});

const loading = ref(false);
</script>

<template>
    <ALayout :class="$style.root">
        <ALayoutHeader>
            <APageHeader @back="$router.push({ name: 'index' })">
                <template #title>
                    <span> ANi番剧列表 </span>
                </template>
                <template #extra></template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent :class="$style.content">
            <AScrollbar
                :class="$style.fillScrollbar"
                :outer-class="$style.fillScrollbarOut"
            >
                <ATable
                    :columns="tableColumns"
                    :data="tableData"
                    :pagination="false"
                    :loading="loading"
                >
                    <template #title="{ record }: { record: Data }">
                        <ALink
                            :href="record.downloadLink"
                            download
                        >
                            {{ record.title }}
                        </ALink>
                    </template>
                </ATable>
            </AScrollbar>
        </ALayoutContent>
    </ALayout>

    <ABackTop
        :target-container="`.${$style.fillScrollbar}`"
        :style="{ bottom: '80px' }"
    >
        <AButton
            :class="$style.siteBacktopBtn"
            size="large"
            shape="circle"
        >
            <IconUp />
        </AButton>
    </ABackTop>
</template>

<style module>
.root,
.content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.content {
    overflow: hidden;
}

.fillScrollbarOut,
.fillScrollbarOut .fillScrollbar {
    width: 100%;
    height: 100%;
}

.fillScrollbarOut .fillScrollbar {
    overflow: auto;
}

.siteBacktopBtn {
    background: var(--color-bg-5) !important;
    border: 1px solid var(--color-fill-3) !important;
    box-shadow: 0 2px 12px #0000001a;
    opacity: 0.6;
}

.siteBacktopBtn:hover,
.siteBacktopBtn:active {
    opacity: 1;
}
</style>
