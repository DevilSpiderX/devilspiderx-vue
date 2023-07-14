<script setup>
import { useRouter } from "vue-router";
import { useFjrcStore } from "./store/FjrcStore";

const fjrcStore = useFjrcStore();
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

</script>

<template>
    <ALayout>
        <ALayoutHeader>
            <APageHeader :show-back="false">
                <template #title>
                    <span> 农商行试题 </span>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent>
            <div class="container" style="box-sizing: border-box;">
                <ASpace direction="vertical" fill>
                    <AButton type="primary" long size="large" @click="pushToTopic('A')"> 财务会计部 </AButton>
                    <AButton type="primary" long size="large" @click="pushToTopic('B')"> 运营管理部 </AButton>
                    <AButton type="primary" long size="large" @click="pushToTopic('C')"> 办公室 </AButton>
                    <AButton type="primary" long size="large" @click="pushToTopic('D')"> 法律合规类 </AButton>
                    <AButton type="primary" long size="large" @click="pushToTopic('E')"> 风险管理类 </AButton>
                    <AButton type="primary" long size="large" @click="pushToTopic('F')"> 金融市场类 </AButton>
                    <AButton type="primary" long size="large" @click="pushToTopic('G')"> 普惠金融部 </AButton>
                    <AButton type="primary" long size="large" @click="pushToTopic('H')"> 审计部 </AButton>
                </ASpace>
            </div>
        </ALayoutContent>
    </ALayout>
</template>

<style scoped>
.arco-layout,
.arco-layout-content {
    width: 100%;
    height: 100%;
}

.container {
    padding: 20px 10px;
}
</style>./store/FjrcStore