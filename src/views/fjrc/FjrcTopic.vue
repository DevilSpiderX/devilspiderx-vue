<script setup>
import { debounce } from "@/utils/util.ts";
import { Scrollbar as AScrollbar } from "@arco-design/web-vue";
import { computed, nextTick, ref, toRefs } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
    bank: String,
    id: Number,
    topic: Object,
    count: Number,
    loading: Boolean
});

const emits = defineEmits(["answer", "reset"]);

const defaultTopic = {
    itemBank: "题库",
    type: "题型",
    label: "标签",
    title: "加载中......",
    answer: "",
    a: "加载中...",
    b: "加载中...",
    c: "加载中...",
    d: "加载中...",
}

const { count } = toRefs(props);

const topic = computed(() => props.loading ? defaultTopic : props.topic);

const buttonStatus = ref({
    A: "normal",
    B: "normal",
    C: "normal",
    D: "normal",
    E: "normal",
    F: "normal",
    G: "normal",
});

const buttonType = ref({
    A: "secondary",
    B: "secondary",
    C: "secondary",
    D: "secondary",
    E: "secondary",
    F: "secondary",
    G: "secondary",
});

const answerStatus = ref(false);

/**
 * 
 * @param {string} answer 
 */
function answerTopic(answer) {
    if (answerStatus.value) return;
    if (topic.value.type === "多选题") {
        if (multipleAnswer.value.has(answer)) {
            multipleAnswer.value.delete(answer);
            buttonType.value[answer] = "secondary";
        } else {
            multipleAnswer.value.add(answer);
            buttonType.value[answer] = "primary";
        }
        return;
    }
    answerStatus.value = true;

    const rightAnswer = topic.value.answer.match(/[a-zA-Z]/g)[0];
    if (answer !== rightAnswer) {
        buttonStatus.value[answer] = "danger";
        buttonType.value[answer] = "primary";
        emits("answer", false, [answer]);
    } else {
        emits("answer", true, [answer]);
    }
    buttonStatus.value[rightAnswer] = "success";
    buttonType.value[rightAnswer] = "primary";
}

const multipleAnswer = ref(new Set());

function answerMultipleTopic() {
    if (answerStatus.value) return;
    if (topic.value.type !== "多选题") return;
    answerStatus.value = true;

    const rightAnswers = topic.value.answer.match(/[a-zA-Z]/g);

    let right = true;
    for (const answer of multipleAnswer.value) {
        if (!rightAnswers.includes(answer)) {
            buttonStatus.value[answer] = "danger";
            buttonType.value[answer] = "primary";
            right = false;
        }
    }

    for (const answer of rightAnswers) {
        buttonStatus.value[answer] = "success";
        buttonType.value[answer] = "primary";
        if (!multipleAnswer.value.has(answer)) {
            right = false;
        }
    }
    emits("answer", right, [...multipleAnswer.value]);
}

const router = useRouter();

function goTopic(id) {
    if (id < 0 || id >= count.value) return;
    router.replace(`${id}`);
}

const lastTopic = debounce(() => {
    goTopic(props.id - 1);
}, 30);

const nextTopic = debounce(() => {
    goTopic(props.id + 1);
}, 30);

/**
 * 
 * @param {Array<string>} answers 
 */
async function answer(answers) {
    if (answerStatus.value) return;
    await nextTick();
    if (topic.value.type === "多选题") {
        multipleAnswer.value = new Set(answers);
        answerMultipleTopic();
        return;
    }

    const answer = answers[0];
    answerTopic(answer);
}

defineExpose({
    answer
});

</script>

<template>
    <ASpin class="loading-container" :loading="loading" tip="加载试题中......">
        <div class="topic-container">
            <AScrollbar class="main-scrollbar" outer-class="main-scrollbar-out">
                <h2>{{ props.id + 1 }}.{{ topic.type }}:</h2>
                <p style="font-size: 1rem;">
                    {{ topic.title }}
                    <ATag v-if="topic.label" color="blue">{{ topic.label }}</ATag>
                </p>
                <ASpace direction="vertical" fill>
                    <div class="answer-item" v-if="topic.a" @click="answerTopic('A')">
                        <AButton :type="buttonType.A" shape="circle" :status="buttonStatus.A">A</AButton>
                        {{ topic.a }}
                    </div>
                    <div class="answer-item" v-if="topic.b" @click="answerTopic('B')">
                        <AButton :type="buttonType.B" shape="circle" :status="buttonStatus.B">B</AButton>
                        {{ topic.b }}
                    </div>
                    <div class="answer-item" v-if="topic.c" @click="answerTopic('C')">
                        <AButton :type="buttonType.C" shape="circle" :status="buttonStatus.C">C</AButton>
                        {{ topic.c }}
                    </div>
                    <div class="answer-item" v-if="topic.d" @click="answerTopic('D')">
                        <AButton :type="buttonType.D" shape="circle" :status="buttonStatus.D">D</AButton>
                        {{ topic.d }}
                    </div>
                    <div class="answer-item" v-if="topic.e" @click="answerTopic('E')">
                        <AButton :type="buttonType.E" shape="circle" :status="buttonStatus.E">E</AButton>
                        {{ topic.e }}
                    </div>
                    <div class="answer-item" v-if="topic.f" @click="answerTopic('F')">
                        <AButton :type="buttonType.F" shape="circle" :status="buttonStatus.F">F</AButton>
                        {{ topic.f }}
                    </div>
                    <div class="answer-item" v-if="topic.g" @click="answerTopic('G')">
                        <AButton :type="buttonType.G" shape="circle" :status="buttonStatus.G">G</AButton>
                        {{ topic.g }}
                    </div>
                </ASpace>
                <div v-if="answerStatus" style="margin-top: 20px;">
                    <AButton type="text" @click="emits('reset')">重做本题</AButton>
                </div>
                <div v-if="answerStatus" style="margin-top: 10px;">
                    出题依据: <br />
                    <p>{{ topic.topicBasis }}</p>
                </div>
            </AScrollbar>
            <div class="operation">
                <div>
                    <AButton v-if="props.id !== 0" long @click="lastTopic">上一题</AButton>
                </div>
                <div style="padding: 0 10px;">
                    <AButton v-if="topic?.type === '多选题' && !answerStatus" type="primary" long @click="answerMultipleTopic">
                        提 交
                    </AButton>
                </div>
                <div>
                    <AButton v-if="props.id !== count - 1" long @click="nextTopic">下一题</AButton>
                </div>
            </div>
        </div>
    </ASpin>
</template>

<style scoped>
.main-scrollbar-out {
    flex: 1;
    width: 100%;
    height: 1px;
}

.main-scrollbar-out :deep(.main-scrollbar) {
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0 20px;
    box-sizing: border-box;
}

.loading-container {
    width: 100%;
    height: 100%;
}

.topic-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.answer-item {
    cursor: pointer;
    width: 100%;
    user-select: none;
}

.operation {
    flex: 0 0;
    padding: 10px;
    display: flex;
}

.operation > div {
    flex: 1;
}
</style>