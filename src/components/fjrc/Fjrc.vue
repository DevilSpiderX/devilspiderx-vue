<script setup>
import { DSXMenuIcon as Icon } from "@/components/dsx-menu";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { Scrollbar as AScrollbar } from "@arco-design/web-vue";
import { IconMoonFill, IconSunFill } from "@arco-design/web-vue/es/icon";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useFjrcStore } from "./store/FjrcStore";

const fjrcStore = useFjrcStore();
const appConfigs = useAppConfigs();
const router = useRouter();

function pushToTopic(bank = "A") {
    const bankID = bank.toUpperCase();
    const lastId = fjrcStore.last[bankID];
    if (lastId) {
        router.push(`/fjrc/${bank}/${lastId}`);
    } else {
        router.push(`/fjrc/${bank}/0`);
    }
}

const buttonList = ref([
    {
        label: "财务会计部",
        onClick: () => pushToTopic('A')
    },
    {
        label: "运营管理部",
        onClick: () => pushToTopic('B')
    },
    {
        label: "办公室",
        onClick: () => pushToTopic('C')
    },
    {
        label: "法律合规类",
        onClick: () => pushToTopic('D')
    },
    {
        label: "风险管理类",
        onClick: () => pushToTopic('E')
    },
    {
        label: "金融市场类",
        onClick: () => pushToTopic('F')
    },
    {
        label: "普惠金融部",
        onClick: () => pushToTopic('G')
    },
    {
        label: "审计部",
        onClick: () => pushToTopic('H')
    }
]);

</script>

<template>
    <AScrollbar class="fill-scrollbar" outer-class="fill-scrollbar-out">
        <ALayout>
            <ALayoutHeader>
                <APageHeader :show-back="false">
                    <template #title>
                        <span> 农商行试题 </span>
                    </template>
                    <template #extra>
                        <ASwitch v-model="appConfigs.darkTheme" :disabled="appConfigs.themeFollowSystem"
                            checked-color="#2f2f2f">
                            <template #unchecked-icon>
                                <span style="color: var(--color-text-3)">
                                    <IconSunFill />
                                </span>
                            </template>
                            <template #checked-icon>
                                <span style="color: #2f2f2f">
                                    <IconMoonFill />
                                </span>
                            </template>
                        </ASwitch>
                    </template>
                </APageHeader>
            </ALayoutHeader>
            <ALayoutContent style="padding:20px 15px;">
                <ARow justify="center">
                    <ACol :xs="24" :sm="21" :md="16" :lg="14" :xl="12" :xxl="10">
                        <ASpace direction="vertical" fill size="large">
                            <template v-for="(btn, index) in buttonList">
                                <AButton v-if="!btn.hidden" class="my-button" :class="btn.class" long :key="index"
                                    @contextmenu.prevent.stop @click="btn.onClick">
                                    <template #icon v-if="btn.icon">
                                        <Icon :icon="btn.icon" />
                                    </template>
                                    {{ btn.label }}
                                </AButton>
                            </template>
                        </ASpace>
                    </ACol>
                </ARow>
            </ALayoutContent>
        </ALayout>
    </AScrollbar>
</template>

<style scoped>
.fill-scrollbar-out {
    width: 100%;
    height: calc(100% - 1px);
}

.fill-scrollbar-out :deep(.fill-scrollbar) {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.my-button {
    --color-text-2: var(--color-text-1);
    --color-secondary: var(--color-bg-1);
    --border-color: #dcdfe6;
    border-color: var(--border-color);
    border-radius: var(--border-radius-large);
    padding: 0.7rem 1.2rem;
    font-size: 1.5rem;
    font-family: "MiSans Normal", system-ui;
    line-height: 1.5;
    height: 60px;
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
}

.my-button:focus,
.my-button:hover {
    --color-text-2: #fff;
    --color-secondary-hover: #343a40;
    --border-color-hover: #343a40;
    background-color: var(--color-secondary-hover);
    border-color: var(--border-color-hover);
}

.my-button:focus :deep(img),
.my-button:hover :deep(img) {
    filter: invert(100%);
}

/*深色模式*/
body[arco-theme=dark] .my-button {
    --color-secondary: rgba(var(--gray-9), .08);
    --border-color: rgba(var(--gray-9), .1);
}

body[arco-theme=dark] .my-button :deep(img) {
    filter: invert(100%);
}

.drawer-close-button {
    --color-secondary: #0000;
}
</style>