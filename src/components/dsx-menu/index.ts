import { DSXMenuIcon, DSXMenuItem, DSXMenuItemProps } from "./components";
import DSXMenu, { Props as DSXMenuProps } from "./DSXMenu.vue";

import { CSSProperties, VNodeChild } from "vue";

export { DSXMenu, DSXMenuItem, DSXMenuIcon };
export type { DSXMenuProps, DSXMenuItemProps };

export interface MenuItemOptionType extends DSXMenuItemProps {
    label?: string,
    class?: string,
    style?: CSSProperties,
    icon?: VNodeChild,
    tip?: string,
    onClick?: (event: MouseEvent) => any
}
