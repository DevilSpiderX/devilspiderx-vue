<script setup lang="ts">
import { sleep } from '@/util/util';
import {
    computed,
    CSSProperties,
    nextTick,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    toRef,
    toRefs,
    useAttrs,
    watch
} from 'vue';
import { DSXMenuItem, DSXMenuIcon as Icon, MenuItemOptionType } from '.';

interface Props {
    style?: CSSProperties,
    visible: boolean,
    event: { x: number, y: number } | MouseEvent,
    zIndex?: number,
    menus?: Array<MenuItemOptionType>,
    minWidth?: number | string;
    maxWidth?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    event: () => ({ x: 0, y: 0 }),
    zIndex: 100
});

const emit = defineEmits(["update:visible"]);

function close() {
    if (props.visible) {
        emit("update:visible", false);
    }
}

const attrs = useAttrs();

const isMoving = ref(false);

const classObj = computed(() => {
    return [
        attrs.class,
        {
            "dsx-menu-fade-enter-active": isMoving.value,
        }
    ]
});

const position = ref({
    x: 0,
    y: 0
});

watch(position, async () => {
    isMoving.value = true;
    await sleep(200);
    isMoving.value = false;
});

const transformOrigin = ref("top left");

const styleObj = computed(() => {
    let minWidth = props.minWidth ? typeof props.minWidth === "string" ? props.minWidth : props.minWidth + "px" : undefined;
    let maxWidth = props.maxWidth ? typeof props.maxWidth === "string" ? props.maxWidth : props.maxWidth + "px" : undefined;

    return {
        ...props.style,
        zIndex: props.zIndex,
        "--p-x": position.value.x + 'px',
        "--p-y": position.value.y + 'px',
        minWidth: minWidth,
        maxWidth: maxWidth,
        "--t-origin": transformOrigin.value
    }
});

const DSX_Menu = ref();

watch(() => props.event, async event => {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    await nextTick();
    const width = DSX_Menu.value.clientWidth;
    const height = DSX_Menu.value.clientHeight;

    const xRight = event.x + width;
    const yBottom = event.y + height;

    position.value = {
        x: xRight >= clientWidth ? event.x - width : event.x,
        y: yBottom >= clientHeight ? event.y - height : event.y
    };

    transformOrigin.value = xRight >= clientWidth ? "right " : "left ";
    transformOrigin.value += yBottom >= clientHeight ? "bottom" : "top";
});

onMounted(() => {
    window.addEventListener("click", close);
});

onUnmounted(() => {
    window.removeEventListener("click", close);
});

function getItemBinds(item: MenuItemOptionType) {
    const { style, divider, hidden, disabled } = toRefs(item);
    return reactive({
        class: toRef(item, "class"),
        style,
        divider,
        hidden,
        disabled
    });
}

</script>

<template>
    <Teleport to="body">
        <Transition name='dsx-menu-fade'>
            <div v-if="visible" class="dsx-menu" :class="classObj" :style="styleObj" ref="DSX_Menu"
                @contextmenu.prevent="close">
                <div class="dsx-menu-body">
                    <template v-if="$slots.default">
                        <slot />
                    </template>
                    <template v-else>
                        <DSXMenuItem v-for="item in menus" v-bind="getItemBinds(item)" @click="item.onClick">
                            <!-- 图标 -->
                            <template #icon v-if="item.icon">
                                <Icon :icon="item.icon" />
                            </template>
                            <!-- 标签 -->
                            {{ item.label }}
                            <!-- 后缀 -->
                            <template #suffix v-if="item.tip">
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
.dsx-menu {
    --color-bg: #fff;
    --color-border: #00000026;
    --p-x: 0;
    --p-y: 0;
    --t-origin: left top;
}

.dsx-menu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
    float: left;
    min-width: 1rem;
    padding: .5rem 0;
    font-size: .8rem;
    text-align: left;
    background-color: var(--color-bg);
    background-clip: padding-box;
    border: 1px solid var(--color-border);
    border-radius: .25rem;
    user-select: none;
    overflow: hidden;
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
    left: var(--p-x);
    top: var(--p-y);
    transform-origin: var(--t-origin);
}

.dsx-menu-body {
    display: block;
}

.dsx-menu-fade-enter-active {
    animation: moving .2s ease-in-out;
}

.dsx-menu-fade-leave-active {
    animation: moving .2s ease-in-out reverse;
}

@keyframes moving {
    from {
        opacity: 0;
        transform: scale(0, 0);
    }

    to {
        opacity: 1;
        transform: scale(1, 1);
    }
}
</style>