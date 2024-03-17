<script setup lang="ts">
import { useModalWidth } from "@/components/query/hooks/modal-width";
import { ref } from "vue";

const { width: cardWidth } = useModalWidth();

type FormData = {
    mode: "Individual" | "Company",
    amount?: number
};

const formData = ref<FormData>({
    mode: "Individual",
    amount: undefined
});

function numberInputFormatter(value: string) {
    const values = value.split('.');
    values[0] = values[0].replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');

    return values.join('.')
}

function numberInputParser(value: string) {
    return value.replaceAll(",", "");
}

const fee = ref(0);

function onFormSubmit() {
    const mode = formData.value.mode;
    const amount = formData.value.amount;

    if (amount === undefined) {
        return;
    }

    if (mode === "Individual") {
        fee.value = feeInIndividual(amount);
    } else {
        fee.value = feeInCompany(amount);
    }
}

function feeInIndividual(amount: number) {
    let result = 0;

    if (amount <= 2000) {
        result = 2;
    } else if (amount <= 5000) {
        result = 5;
    } else if (amount <= 10000) {
        result = 10;
    } else if (amount <= 50000) {
        result = 15;
    } else {
        result = amount * 0.0003;
    }

    return result <= 50 ? result : 50;
}

function feeInCompany(amount: number) {
    let result = 0;

    if (amount <= 10_000) {
        result = 4.5;
    } else if (amount <= 100_000) {
        result = 9;
    } else if (amount <= 500_000) {
        result = 15;
    } else if (amount <= 1_000_000) {
        result = 20;
    } else {
        result = amount * 0.00002;
    }

    return result <= 200 ? result : 200;
}

function onSelectionChange() {
    onFormSubmit();
}

function onNumberInputFocus(ev: FocusEvent) {
    if (ev.target && ev.target instanceof HTMLInputElement) {
        const target = ev.target as HTMLInputElement;
        target.select();
        fee.value = 0;
    }
}

</script>

<template>
    <ALayout class="root">
        <ALayoutHeader>
            <APageHeader @back="$router.push({ name: 'index' })">
                <template #title>
                    <span> 跨行转账手续费计算器 </span>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent class="content">
            <ACard class="card">
                <AForm :model="formData" @submit="onFormSubmit">
                    <AFormItem field="mode" label="类型">
                        <ASelect v-model="formData.mode" @change="onSelectionChange">
                            <AOption value="Individual">个人</AOption>
                            <AOption value="Company">对公</AOption>
                        </ASelect>
                    </AFormItem>
                    <AFormItem field="amount" label="金额">
                        <AInputNumber class="number-input" v-model="formData.amount" placeholder="请输入计算金额" :min="0.01"
                            :precision="2" :formatter="numberInputFormatter" :parser="numberInputParser"
                            @focus="onNumberInputFocus" :input-attrs="{ type: 'tel' }" />
                    </AFormItem>
                    <AFormItem>
                        <div style="display: flex;justify-content: end;width: 100%;">
                            <AButton html-type="submit">计算</AButton>
                        </div>
                    </AFormItem>
                </AForm>
                <div class="statisticWrapper" v-show="fee !== 0">
                    <AStatistic :value="fee" :precision="2">
                        <template #prefix> ￥ </template>
                    </AStatistic>
                </div>
            </ACard>
        </ALayoutContent>
    </ALayout>
</template>

<style scoped>
.root {
    box-sizing: border-box;
    width: 100dvw;
    height: 100dvh;
}

.content {
    display: flex;
    justify-content: center;
    align-items: start;
}

.card {
    width: v-bind(cardWidth);
}

.statisticWrapper {
    display: flex;
    justify-content: center;
    margin: 10px auto 10px auto;
}
</style>