import DSXMenuIcon from "./DSXMenuIcon";
import DSXMenuItem from "./DSXMenuItem.vue";

export { DSXMenuItem, DSXMenuIcon };

export interface DSXMenuItemProps {
    divider?: boolean;
    hidden?: boolean;
    disappeared?: boolean;
    disabled?: boolean;
}
