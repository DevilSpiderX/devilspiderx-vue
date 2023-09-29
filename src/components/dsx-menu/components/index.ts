import type { VNodeChild } from "vue";
import DSXMenuIcon from "./DSXMenuIcon";
import DSXMenuItem from "./DSXMenuItem.vue";

export { DSXMenuIcon, DSXMenuItem };

export interface DSXMenuItemProps {
    divider?: boolean;
    hidden?: boolean;
    disappeared?: boolean;
    disabled?: boolean;
}

export interface DSXMenuIconProps {
    icon: VNodeChild;
}