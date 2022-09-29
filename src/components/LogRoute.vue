<template>
    <h1>未完成</h1>
</template>

<script>
export default {
    name: "LogRoute",
    beforeCreate() {
        window.open("/log.html", "_self");
    }
}
</script>

<style scoped>

</style>