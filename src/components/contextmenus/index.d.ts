import { CSSProperties, VNode } from "vue";

export interface MenuItemType {
    label?: string,
    class?: ClassType,
    style?: CSSProperties,
    icon?: string | VNode,
    tip?: string,
    divider?: boolean,
    click?: (event: MouseEvent, menu: MenuItemType) => unknown,
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