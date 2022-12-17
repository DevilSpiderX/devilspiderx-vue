<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useAppConfigs } from "@/store/AppConfigsStore";

const props = defineProps({
    visible: Boolean,
    cleaning: Boolean
})
const emit = defineEmits(["submit", "update:visible", "update:cleaning"]);

const _visible = computed({
    get: () => props.visible,
    set: value => emit("update:visible", value)
});

watch(() => props.cleaning, cleaning => {
    if (cleaning) {
        cleanData();
    }
});

const form = reactive({
    name: "",
    account: "",
    password: "",
    remark: ""
});

function cleanData() {
    for (let key in form) form[key] = "";
    emit("update:cleaning", false);
}

const inputNameStatus = ref(false);

function form_submit() {
    inputNameStatus.value = false;
    if (form.name === "") {
        inputNameStatus.value = true;
        return;
    }
    emit('submit', form);
}

const appConfigs = useAppConfigs();

const width = computed(() => {
    let winWidth = appConfigs.client.width;
    if (winWidth < 576) {//xs [0, 576)
        return "90%";
    } else if (winWidth < 768) {//sm [576, 768)
        return "83.3%";
    } else if (winWidth < 992) {//md [768, 992)
        return "62.5%";
    } else if (winWidth < 1200) {//lg [992, 1200)
        return "48%";
    } else if (winWidth < 1600) {//xl [1200, 1600)
        return "40%";
    } else {//xxl [1600, ∞)
        return "30%";
    }
});

function cancel_click() {
    cleanData();
    _visible.value = false;
}
</script>

<template>
    <AModal v-model:visible="_visible" title="添加密码记录" :width="width">
        <AForm :model="form" @submit="form_submit">
            <AFormItem field="name" hide-label>
                <AInput placeholder="名称" v-model="form.name" allow-clear :error="inputNameStatus">
                    <template #prefix>
                        <i class="fas fa-tag fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="account" hide-label>
                <AInput placeholder="账号" v-model="form.account" allow-clear>
                    <template #prefix>
                        <i class="fas fa-user fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="password" hide-label>
                <AInput placeholder="密码" v-model="form.password" allow-clear>
                    <template #prefix>
                        <i class="fas fa-key fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <AFormItem field="remark" hide-label>
                <AInput placeholder="备注" v-model="form.remark" allow-clear>
                    <template #prefix>
                        <i class="fas fa-info fa-fw"></i>
                    </template>
                </AInput>
            </AFormItem>
            <button type="submit" v-show="false"></button>
        </AForm>
        <template #footer>
            <AButton type="primary" @click="form_submit">
                添 加
            </AButton>
            <AButton @click="cancel_click">取 消</AButton>
        </template>
    </AModal>
</template>