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
        { label: "复制", onClick: () => { }, style: tableMenuItemStyle, icon: (<i class="fa-regular fa-copy" />) },
        { label: "删除", onClick: () => { }, style: tableMenuItemStyle, icon: (<i class="fa-regular fa-trash" />) },
        { label: "编辑", onClick: () => { }, style: tableMenuItemStyle, icon: (<i class="fa-regular fa-pen-to-square" />) },
        { label: "查看", onClick: () => { }, style: tableMenuItemStyle, icon: (<i class="fa-regular fa-eye" />) }
    ]);

    const tableMenu = reactive({
        visible: false,
        event: undefined,
        menus,
        onClicks: {
            copy: toRef(menus[0], "onClick"),
            delete: toRef(menus[1], "onClick"),
            edit: toRef(menus[2], "onClick"),
            see: toRef(menus[3], "onClick")
        },
        style: tableMenuStyle
    });

    return {
        tableMenu
    }
}