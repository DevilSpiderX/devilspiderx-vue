import { StyleValue, VNodeChild } from "vue";
import DSXMenu from "./DSXMenu.vue";
import { DSXMenuIcon, DSXMenuItem, DSXMenuItemProps } from "./components";

export { DSXMenu, DSXMenuIcon, DSXMenuItem };
export type { DSXMenuItemProps };

export type DSXMenuEvent = { x: number, y: number } | MouseEvent;

export interface MenuItemOption extends DSXMenuItemProps {
    label?: string;
    class?: string;
    style?: StyleValue;
    icon?: VNodeChild;
    tip?: string;
    onClick?: (event: MouseEvent) => any;
}

export interface DSXMenuProps {
    visible?: boolean;
    event?: DSXMenuEvent;
    zIndex?: number;
    menus?: Array<MenuItemOption>;
    minWidth?: number | string;
    maxWidth?: number | string;
}
