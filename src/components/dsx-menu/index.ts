import type { CSSProperties, VNode } from "vue";
import DSXMenu from "./DSXMenu.vue";
import type { DSXMenuItemProps } from "./components";
import { DSXMenuIcon, DSXMenuItem } from "./components";

export { DSXMenu, DSXMenuIcon, DSXMenuItem };
export type { DSXMenuItemProps };

export type DSXMenuEvent = { x: number; y: number } | MouseEvent;

export interface MenuItemOption extends DSXMenuItemProps {
    label?: string;
    class?: string;
    style?: CSSProperties;
    icon?: VNode | string;
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
