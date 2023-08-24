<script setup>
import { useAppConfigs } from "@/store/AppConfigsStore";
import axios from "axios";
import { computed, onMounted, ref, toRef, watchEffect } from "vue";
import { useRouter } from "vue-router";
import FjrcTopic from "./FjrcTopic.vue";
import IndexButtonList from "./IndexButtonList.vue";
import { useFjrcStore, useFjrcTopicStore } from "./store/FjrcStore";

const props = defineProps({
    bank: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
});

const fjrcStore = useFjrcStore();
watchEffect(() => {
    fjrcStore.last[props.bank] = props.id;
});

const appConfigs = useAppConfigs();

const TITLE_NAME = {
    A: "财务会计部",
    B: "运营管理部",
    C: "办公室",
    D: "法律合规类",
    E: "风险管理类",
    F: "金融市场类",
    G: "普惠金融部",
    H: "审计部"
}

function getTitleName(bank) {
    const bankID = bank.toUpperCase();
    if (bankID in TITLE_NAME) {
        return TITLE_NAME[bankID];
    }
    return TITLE_NAME.A;
}

const topic = ref({
    itemBank: "题库",
    type: "类型",
    label: "标签",
    title: "题目",
    answer: "",
    a: "选项A",
    b: "选项B",
    c: "选项C",
    d: "选项D",
});
async function getTopic(bank, id) {
    const { data } = await axios.get("/api/fjrc/topic", {
        params: { bank, id }
    });
    topic.value = data;
}

const loading = ref(true);
watchEffect(async () => {
    loading.value = true;
    await getTopic(props.bank, props.id);
    loading.value = false;
})

const count = ref(0);
async function getCount(bank) {
    const { data } = await axios.get("/api/fjrc/count", {
        params: { bank }
    });
    if (count.value == data.count) return;
    count.value = data.count;
}

onMounted(() => {
    getCount(props.bank);
});

const binds = computed(() => {
    return {
        ...props,
        topic: topic.value,
        count: count.value,
        loading: loading.value
    }
});

const drawer = ref({
    visible: false
});

const indexButtonTypes = ref({});

watchEffect(() => {
    indexButtonTypes.value = {};
    indexButtonTypes.value[props.id] = "primary";
});

const fjrcTopicStore = useFjrcTopicStore();
const indexButtonColors = toRef(fjrcTopicStore.indexButtonColors, props.bank);

const router = useRouter();

async function goTopic(id) {
    if (id < 0 || id >= count.value) return;
    await router.push(`${id}`);
    drawer.value.visible = false;
}

function onFjrcTopicAnswer(right) {
    indexButtonColors.value[props.id] = right ? "success" : "danger";
}

const indexButtonCorrectRate = computed(() => {
    const indexs = Object.getOwnPropertyNames(indexButtonColors.value);
    const all = indexs.length;
    if (all === 0) {
        return -1
    }

    let success = 0;
    for (const index of indexs) {
        if (indexButtonColors.value[index] === "success") {
            success++;
        }
    }

    return success / all;
});

</script>

<template>
    <ALayout>
        <ALayout>
            <ALayoutHeader>
                <APageHeader @back="$router.push({ name: 'fjrc' })">
                    <template #title>
                        <span> {{ getTitleName(bank) }} </span>
                    </template>
                    <template #extra>
                        <ASpace>
                            <ATag v-if="indexButtonCorrectRate >= 0" color="green">
                                {{ (indexButtonCorrectRate * 100).toFixed(0) }}%
                            </ATag>
                            <AButton v-if="appConfigs.client.width < 768" type="text" shape="circle"
                                style="color:var(--color-text-2)" @click="drawer.visible = true">
                                <i class="fa-solid fa-bars" />
                            </AButton>
                        </ASpace>
                    </template>
                </APageHeader>
            </ALayoutHeader>
            <ALayoutContent>
                <FjrcTopic :key="props.id" v-bind="binds" @answer="onFjrcTopicAnswer" />
            </ALayoutContent>
        </ALayout>
        <ALayoutSider v-if="appConfigs.client.width >= 768" :width="250">
            <div class="arco-drawer-header">
                <div class="arco-drawer-title">目录</div>
            </div>
            <div class="arco-drawer-body">
                <IndexButtonList :id="props.id" :count="count" :index-button-types="indexButtonTypes"
                    :index-button-colors="indexButtonColors" @click="goTopic" />
            </div>
        </ALayoutSider>
    </ALayout>

    <ADrawer v-if="appConfigs.client.width < 768" title="目录" v-model:visible="drawer.visible" placement="right"
        :footer="false">
        <IndexButtonList v-if="drawer.visible" :id="props.id" :count="count" :index-button-types="indexButtonTypes"
            :index-button-colors="indexButtonColors" @click="goTopic" />
    </ADrawer>
</template>

<style scoped>
.arco-layout,
.arco-layout-content {
    width: 100%;
    height: 100%;
}

.arco-layout-content {
    overflow: hidden;
}

.arco-layout-sider {
    height: 100%;
}

.arco-layout-sider :deep(.arco-layout-sider-children) {
    display: flex;
    flex-direction: column;
}
</style>