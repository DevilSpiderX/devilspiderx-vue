import { CSSProperties, VNodeChild } from "vue";
import DSXMenu from "./DSXMenu.vue";
import DSXMenuItem from "./DSXMenuItem.vue";
import DSXMenuIcon from "./DSXMenuIcon";

export interface MenuItemOptionType {
    label?: string,
    class?: string,
    style?: CSSProperties,
    icon?: VNodeChild,
    tip?: string,
    divider?: boolean,
    onClick?: (event: MouseEvent) => unknown,
    hidden?: boolean,
    disabled?: boolean
}

export interface DSXMenuProps {
    style?: CSSProperties,
    visible: boolean,
    event: MouseEvent | { x: number, y: number },
    zIndex?: number,
    menus?: Array<MenuItemOptionType>,
    minWidth?: number | string;
    maxWidth?: number | string;
}

export interface DSXMenuItemProps {
    style?: CSSProperties,
    divider?: boolean,
    hidden?: boolean,
    disabled?: boolean
}

export { DSXMenu, DSXMenuItem, DSXMenuIcon }