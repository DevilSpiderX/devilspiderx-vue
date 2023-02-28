import { MenuItemOptionType } from "@/components/dsx-menu";
import { reactive, StyleValue } from "vue";

interface tableMenuType {
    visible: boolean,
    event?: { x: number, y: number } | MouseEvent,
    menus: Array<MenuItemOptionType>,
    style: StyleValue
}

export function useTableMenu() {
    const tableMenuStyle = {
        "--color-bg": "var(--color-bg-3)",
        "--color-border": "var(--color-border-2)"
    }

    const tableMenuItemStyle = {
        "--color-text": "var(--color-text-1)",
        "--color-bg-hover": "var(--color-secondary-hover)"
    }

    const tableMenuIcons = {
        copy: (<i class="fa-regular fa-copy" />),
        delete: (<i class="fa-regular fa-trash-xmark" />),
        edit: (<i class="fa-regular fa-pen-to-square" />),
        see: (<i class="fa-regular fa-eye" />)
    }

    const tableMenu = reactive<tableMenuType>({
        visible: false,
        event: undefined,
        menus: [],
        style: tableMenuStyle
    });

    return {
        tableMenuStyle,
        tableMenuItemStyle,
        tableMenuIcons,
        tableMenu
    }
}