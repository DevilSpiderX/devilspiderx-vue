<template>
    <div class="base-card">
        <header>
            <slot name="header"/>
        </header>
        <transition name="body">
            <slot v-if="bodyShow"/>
        </transition>
        <transition name="empty">
            <a-empty v-if="emptyShow"/>
        </transition>
    </div>
</template>

<script>
export default {
    name: "BaseCard",
    data() {
        return {
            bodyShow: false,
            emptyShow: true
        }
    },
    props: {
        empty: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    watch: {
        async empty(newVal) {
            if (newVal) {
                this.bodyShow = false;
                await this.sleep(0);
                this.emptyShow = true;
            } else {
                this.emptyShow = false;
                await this.sleep(300);
                this.bodyShow = true;
            }
        }
    }
}
</script>

<style scoped>
@import url(/src/components/controller/styles/card-transition.css);

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
    z-index: 100;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
}

.base-card:hover {
    z-index: 101;
    box-shadow: var(--box-shadow-dark);
}

header {
    background-color: #fcfcfc;
    border-bottom: 1px solid var(--card-border-color);
}

body[arco-theme='dark'] header {
    background-color: #1e1e1e;
}
</style>