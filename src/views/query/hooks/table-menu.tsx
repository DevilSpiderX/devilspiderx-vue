import type { DSXMenuEvent, MenuItemOption } from "@/components/dsx-menu";
import type { CSSProperties } from "vue";
import { ref } from "vue";

type TableMenuType = {
    visible: boolean;
    event?: DSXMenuEvent;
    menus: MenuItemOption[];
    style: CSSProperties;
};

export function useTableMenu() {
    const tableMenuStyle = {
        "--color-bg": "var(--color-bg-3)",
        "--color-border": "var(--color-border-2)",
    };

    const tableMenuItemStyle = {
        "--color-text": "var(--color-text-1)",
        "--color-bg-hover": "var(--color-secondary-hover)",
    };

    const tableMenuIcons = {
        copy: <i class="fa-regular fa-copy" />,
        trash_xmark: <i class="fa-regular fa-trash-xmark" />,
        pen_to_square: <i class="fa-regular fa-pen-to-square" />,
        eye: <i class="fa-regular fa-eye" />,
        globe: <i class="fa-solid fa-globe" />,
    };

    const tableMenu = ref<TableMenuType>({
        visible: false,
        event: undefined,
        menus: [],
        style: tableMenuStyle,
    });

    return {
        tableMenuItemStyle,
        tableMenuIcons,
        tableMenu,
    };
}
