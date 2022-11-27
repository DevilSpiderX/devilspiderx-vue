<script setup lang="ts">
import { computed, CSSProperties, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { MenuItemType } from '.';
import DSXMenuItem from './DSXMenuItem.vue';

interface MenuType {
    class?: string,
    style?: CSSProperties,
    visible: boolean,
    event: { x: number, y: number } | MouseEvent,
    zIndex?: number,
    menus?: Array<MenuItemType>,
    minWidth?: number | string;
    maxWidth?: number | string;
}

const props = withDefaults(defineProps<MenuType>(), {
    visible: false,
    event: () => ({ x: 0, y: 0 }),
    zIndex: 50
});

const emit = defineEmits(["update:visible"]);

const position = reactive({
    top: 0,
    left: 0
});

const style = computed(() => {
    let minWidth;
    if (props.minWidth) {
        if (typeof props.minWidth === "string") {
            minWidth = props.minWidth;
            if (minWidth.indexOf("px") === -1) {
                minWidth += "px";
            }
        } else {
            minWidth = props.minWidth + "px";
        }
    }

    let maxWidth;
    if (props.maxWidth) {
        if (typeof props.maxWidth === "string") {
            maxWidth = props.maxWidth;
            if (maxWidth.indexOf("px") === -1) {
                maxWidth += "px";
            }
        } else {
            maxWidth = props.maxWidth + "px";
        }
    }

    return {
        ...props.style,
        zIndex: props.zIndex,
        top: position.top + 'px',
        left: position.left + 'px',
        minWidth: minWidth,
        maxWidth: maxWidth
    }
});

const DSX_Menu = ref();

watch(() => props.event, async event => {
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    const padding = 7;
    close();
    await nextTick();

    const width = DSX_Menu.value.clientWidth;
    const height = DSX_Menu.value.clientHeight;

    const xRight = event.x + width;
    const yBottom = event.y + height;

    position.left = xRight >= clientWidth ? clientWidth - width - padding : event.x;
    position.top = yBottom >= clientHeight ? clientHeight - height - padding : event.y;
    open();
});

function open() {
    emit("update:visible", true);
}

function close() {
    emit("update:visible", false);
}

onMounted(() => {
    window.addEventListener("click", close);
});

onUnmounted(() => {
    window.removeEventListener("click", close);
});

</script>

<template>
    <Teleport to="body">
        <Transition name='dsx-menu-fade'>
            <div v-if="$props.visible" class="dsx-menu" :class="$props.class" :style="style" ref="DSX_Menu"
                @contextmenu.prevent="close">
                <div class="dsx-menu-body">
                    <template v-if="$slots.default">
                        <slot />
                    </template>
                    <template v-else>
                        <DSXMenuItem v-for="menu_item in $props.menus" v-bind="menu_item" />
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
}

.dsx-menu-body {
    display: block;
}

.dsx-menu-fade-enter-active,
.dsx-menu-fade-leave-active {
    transition: opacity .2s ease-in-out;
}

.dsx-menu-fade-enter-from,
.dsx-menu-fade-leave-to {
    opacity: 0;
}
</style>