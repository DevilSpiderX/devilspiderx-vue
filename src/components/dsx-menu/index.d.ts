import { CSSProperties, VNodeChild } from "vue";
import DSXMenu from "./DSXMenu.vue";
import DSXMenuItem from "./DSXMenuItem.vue";

export interface MenuItemType {
    label?: string,
    class?: ClassType,
    style?: CSSProperties,
    icon?: VNodeChild,
    tip?: string,
    divider?: boolean,
    click?: (event: MouseEvent) => unknown,
    hidden?: boolean,
    disabled?: boolean
}

export interface MenuType {
    class?: ClassType,
    style?: CSSProperties,
    visible: boolean,
    event: MouseEvent | { x: number, y: number },
    zIndex?: number,
    menus?: Array<MenuItemType>,
    minWidth?: number | string;
    maxWidth?: number | string;
}

export { DSXMenu, DSXMenuItem }