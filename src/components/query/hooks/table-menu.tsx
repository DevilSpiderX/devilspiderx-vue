import { MenuItemOptionType } from "@/components/dsx-menu";
import { reactive, toRef } from "vue";

const tableMenuStyle = {
    "--color-bg": "var(--color-bg-3)",
    "--color-border": "var(--color-border-2)"
}

const tableMenuItemStyle = {
    "--color-text": "var(--color-text-1)",
    "--color-bg-hover": "var(--color-secondary-hover)"
}

export function useTableMenu() {
    const menus = reactive<Array<MenuItemOptionType>>([
        { label: "复制", click: undefined, style: tableMenuItemStyle, icon: (<i class="fa-solid fa-copy" />) },
        { label: "删除", click: undefined, style: tableMenuItemStyle, icon: (<i class="fa-solid fa-trash" />) },
        { label: "编辑", click: undefined, style: tableMenuItemStyle, icon: (<i class="fa-solid fa-pen-to-square" />) },
        { label: "查看", click: undefined, style: tableMenuItemStyle, icon: (<i class="fa-solid fa-eye" />) }
    ]);

    const tableMenu = reactive({
        visible: false,
        event: undefined,
        menus,
        clicks: {
            copy: toRef(menus[0], "click"),
            delete: toRef(menus[1], "click"),
            edit: toRef(menus[2], "click"),
            see: toRef(menus[3], "click")
        },
        style: tableMenuStyle
    });

    return {
        tableMenu
    }
}