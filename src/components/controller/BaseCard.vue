<template>
    <div class="base-card">
        <header>
            <slot name="header" />
        </header>
        <slot />
    </div>
</template>

<style scoped>
.base-card {
    --card-bg-color: var(--color-bg-2);
    --card-border-color: var(--color-border);
    --card-border-radius: 4px;
    --card-padding: 20px;
}

.base-card {
    border-radius: var(--card-border-radius);
    border: 1px solid var(--card-border-color);
    background-color: var(--card-bg-color);
    overflow: hidden;
    color: var(--color-text-1);
    transition: 0.3s;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
}

.base-card:hover {
    box-shadow: var(--el-box-shadow-dark);
}

header {
    background-color: #fcfcfc;
    border-bottom: 1px solid var(--card-border-color);
}

body[arco-theme=dark] header {
    background-color: #1e1e1e;
}
</style>