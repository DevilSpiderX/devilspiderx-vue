<script setup lang="ts">
import { computed, CSSProperties, VNode } from 'vue';

interface MenuItemType {
    label?: string,
    class?: string,
    style?: CSSProperties,
    icon?: string | VNode,
    tip?: string,
    divider?: boolean,
    click?: (event: MouseEvent, menu: MenuItemType) => unknown,
    hidden?: boolean,
    disabled?: boolean
}

const props = defineProps<MenuItemType>();

const emit = defineEmits(["click"]);

const Class = computed(() => {
    let result: { [key: string]: boolean | undefined } = {
        "dsx-menu-item-disabled": props.disabled
    };
    if (props.class) {
        result[props.class] = true;
    }
    return result;
});

const iconIsString = computed<boolean>(() => typeof props.icon === "string");

function item_click(event: MouseEvent) {
    if (props.disabled) {
        event.stopPropagation();
    } else {
        if (props.click) {
            props.click(event, props);
        }
        emit("click", event, props);
    }
}

</script>

<template>
    <div v-if="$props.divider" class="dsx-menu-item-divider" :class="Class" :style="$props.style" @contextmenu.prevent>
    </div>

    <div v-else v-show="!$props.hidden" class="dsx-menu-item" :class="Class" :style="$props.style" @click="item_click"
        @contextmenu.prevent>
        <div v-if="$slots.icon || $props.icon" class="dsx-menu-item-icon">
            <template v-if="$slots.icon">
                <slot name="icon" />
            </template>
            <template v-else>
                <span v-if="iconIsString" v-html="$props.icon"></span>
                <span v-else>
                    <component :is="$props.icon" />
                </span>
            </template>
        </div>
        <div class="dsx-menu-item-label">
            <template v-if="$slots.default">
                <slot />
            </template>
            <template v-else>
                {{ $props.label }}
            </template>
        </div>
        <div v-if="$slots.suffix || $props.tip" class="dsx-menu-item-suffix">
            <template v-if="$slots.suffix">
                <slot name="suffix" />
            </template>
            <template v-else>
                {{ $props.tip }}
            </template>
        </div>
    </div>
</template>

<style scoped>
.dsx-menu-item-divider {
    height: 0;
    margin: .5rem 0;
    overflow: hidden;
    border-top: 1px solid var(--color-border);
}

.dsx-menu-item {
    --color-text: #16181b;
    --color-bg: #0000;
    --color-text-hover: var(--color-text);
    --color-bg-hover: #e9ecef;
    --color-text-suffix: #999;
    --color-text-disabled: #999;
}

.dsx-menu-item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    padding: .6rem 1rem;
    /* line-height: 2rem; */
    clear: both;
    font-weight: 400;
    color: var(--color-text);
    text-align: inherit;
    white-space: nowrap;
    background-color: var(--color-bg);
    border: 0;
}

.dsx-menu-item:focus,
.dsx-menu-item:hover {
    color: var(--color-text-hover);
    text-decoration: none;
    background-color: var(--color-bg-hover);
    cursor: pointer;
}

.dsx-menu-item-disabled {
    color: var(--color-text-disabled);
}

.dsx-menu-item-disabled:focus,
.dsx-menu-item-disabled:hover {
    color: var(--color-text-disabled);
    text-decoration: inherit;
    background-color: inherit;
    cursor: inherit;
}

.dsx-menu-item-icon {
    display: flex;
    margin-right: 0.6rem;
    min-width: 1rem;
}

.dsx-menu-item-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.dsx-menu-item-suffix {
    margin-left: 1.5rem;
    font-size: .3rem;
    color: var(--color-text-suffix);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>