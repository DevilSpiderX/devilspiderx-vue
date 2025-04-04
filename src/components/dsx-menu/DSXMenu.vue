<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { DSXMenuProps as Props, MenuItemOption } from ".";
import { DSXMenuIcon as Icon, DSXMenuItem } from ".";

defineOptions({
    inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    event: () => ({ x: 0, y: 0 }),
    zIndex: 100,
});

const emit = defineEmits<{
    (e: "update:visible", visible: boolean): void;
}>();

function close() {
    if (props.visible) {
        emit("update:visible", false);
    }
}

const isMoving = ref(false);

const classObj = computed(() => ({
    "dsx-menu-fade-enter-active": isMoving.value,
}));

const position = ref({
    x: 0,
    y: 0,
});

watch(position, async () => {
    isMoving.value = true;
});

function onDSXMenuAnimationEnd() {
    isMoving.value = false;
}

const transformOrigin = ref("left top");

const styleObj = computed(() => ({
    zIndex: props.zIndex,
    "--p-x": position.value.x + "px",
    "--p-y": position.value.y + "px",
    minWidth: props.minWidth
        ? typeof props.minWidth === "string"
            ? props.minWidth
            : props.minWidth + "px"
        : undefined,
    maxWidth: props.maxWidth
        ? typeof props.maxWidth === "string"
            ? props.maxWidth
            : props.maxWidth + "px"
        : undefined,
    "--t-origin": transformOrigin.value,
}));

const DSXMenuRef = ref<HTMLDivElement | null>(null);

watch(
    () => props.event,
    async event => {
        const clientWidth = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;

        await nextTick();
        if (DSXMenuRef.value) {
            const width = DSXMenuRef.value.clientWidth;
            const height = DSXMenuRef.value.clientHeight;

            const xRight = event.x + width;
            const yBottom = event.y + height;

            position.value = {
                x: xRight >= clientWidth ? event.x - width : event.x,
                y: yBottom >= clientHeight ? event.y - height : event.y,
            };

            transformOrigin.value = xRight >= clientWidth ? "right" : "left";
            transformOrigin.value += " ";
            transformOrigin.value += yBottom >= clientHeight ? "bottom" : "top";
        }
    },
);

onMounted(() => {
    window.addEventListener("click", close);
});

onUnmounted(() => {
    window.removeEventListener("click", close);
});

function getItemBinds(item: MenuItemOption) {
    const binds = { ...item };
    delete binds.icon;
    delete binds.label;
    delete binds.tip;
    return binds;
}
</script>

<template>
    <Teleport to="body">
        <Transition name="dsx-menu-fade">
            <div
                v-if="visible"
                v-bind="$attrs"
                class="dsx-menu"
                :class="classObj"
                :style="styleObj"
                ref="DSXMenuRef"
                @contextmenu.prevent="close"
                @animationend="onDSXMenuAnimationEnd"
            >
                <div class="dsx-menu-body">
                    <template v-if="$slots.default">
                        <slot />
                    </template>
                    <template v-else>
                        <DSXMenuItem
                            v-for="item in menus"
                            v-bind="getItemBinds(item)"
                        >
                            <!-- 图标 -->
                            <template
                                #icon
                                v-if="item.icon"
                            >
                                <Icon :icon="item.icon" />
                            </template>
                            <!-- 标签 -->
                            {{ item.label }}
                            <!-- 后缀 -->
                            <template
                                #suffix
                                v-if="item.tip"
                            >
                                {{ item.tip }}
                            </template>
                        </DSXMenuItem>
                    </template>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
@import url(./styles/menu-transition.css);

.dsx-menu {
    --color-bg: #fff;
    --color-border: #00000026;
    --p-x: 0;
    --p-y: 0;
    --t-origin: left top;
}

.dsx-menu {
    position: fixed;
    z-index: 50;
    float: left;
    min-width: 1rem;
    padding: 0.5rem 0;
    font-size: 0.8rem;
    text-align: left;
    background-color: var(--color-bg);
    background-clip: padding-box;
    border: 1px solid var(--color-border);
    border-radius: 0.25rem;
    user-select: none;
    overflow: hidden;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    left: var(--p-x);
    top: var(--p-y);
    transform-origin: var(--t-origin);
}

.dsx-menu-body {
    display: block;
}
</style>
