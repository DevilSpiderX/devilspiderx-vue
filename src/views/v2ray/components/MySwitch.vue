<script setup lang="ts">
import { computed, CSSProperties, onMounted, ref } from "vue";

const style = ref<CSSProperties>({});

interface Props {
    width?: string;
    height?: string;
    fontSize?: string;
    modalStatus: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    "update:modalStatus": [modalStatus: boolean];
    click: [];
}>();

const status = computed({
    get() {
        return props.modalStatus ? "on" : "off";
    },
    set(newVal) {
        emit("update:modalStatus", newVal === "on");
    },
});

onMounted(() => {
    const _style = style.value;
    if (props.width !== undefined) {
        _style["--width"] = props.width;
    }
    if (props.height !== undefined) {
        _style["--height"] = props.height;
    }
    if (props.fontSize !== undefined) {
        _style["--font-size"] = props.fontSize;
    }
});
</script>

<template>
    <div
        class="switch"
        tabindex="0"
        :data-status="status"
        :style="style"
        @click="emit('click')"
    >
        <div class="switch-container">
            <div class="switch-lever-0">
                <span>
                    <slot name="ON">ON</slot>
                </span>
            </div>
            <div class="switch-lever-1"></div>
            <div class="switch-lever-2">
                <span>
                    <slot name="OFF">OFF</slot>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.switch {
    --width: 10rem;
    --height: 4rem;
    --font-size: 20px;
    --on-bg-color: #28a745;
    --center-bg-color: white;
    --off-bg-color: #eee;
    --background-color: linear-gradient(
        to right,
        var(--on-bg-color) 33.3%,
        var(--center-bg-color) 33.3%,
        var(--center-bg-color) 66.6%,
        var(--off-bg-color) 66.6%
    );
    --border-color: #ccc;
}

.switch {
    width: var(--width);
    height: var(--height);
    padding: 0;
    background: var(--background-color);
    background-size: 150%;
    border: 1px solid var(--border-color);
    border-radius: 0.7rem;
    display: inline-block;
    overflow: hidden;
    cursor: pointer;
    direction: ltr;
    text-align: center;
    box-sizing: border-box;
    font-size: var(--font-size);
    font-weight: 500;
    transition:
        border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out,
        background-position 0.4s ease-in-out;
    user-select: none;
}

.switch[data-status="off"] {
    background-position: right;
}

.switch-container {
    width: 150%;
    height: 100%;
    padding: 0;
    display: flex;
    transition: transform 0.4s ease-in-out 0.05s;
}

.switch[data-status="off"] > .switch-container {
    --X: calc(-1 * var(--width) / 2);
    transform: translateX(var(--X));
}

.switch-lever-0,
.switch-lever-1,
.switch-lever-2 {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.switch-lever-0 {
    color: white;
}

.switch-lever-2 {
    color: rgba(0, 0, 0, 0.87);
}

body[arco-theme="dark"] .switch {
    --on-bg-color: #1d9138;
    --center-bg-color: #eee;
    --off-bg-color: var(--color-bg-3);
}

body[arco-theme="dark"] .switch-lever-2 {
    color: white;
}
</style>
