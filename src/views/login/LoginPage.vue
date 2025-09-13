<script setup lang="ts">
import { debounce, sleep } from "@/utils/util";
import { onMounted } from "vue";

const func = debounce(async () => {
    console.log(new Date());
    await sleep(500);
    console.log(new Date());
    return true;
}, 1000);

onMounted(() => {
    func().then(resp => console.log(1, resp));
    func().then(resp => console.log(2, resp));
    func().then(resp => {
        console.log(3, resp);
        func().then(resp => console.log(4, resp));
        func().then(resp => console.log(5, resp));
        func().then(resp => console.log(6, resp));
    });
});
</script>

<template>
    <div></div>
</template>

<style scoped lang="scss"></style>
