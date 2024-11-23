declare module "vue" {
    interface GlobalComponents {
        AScrollbar: (typeof import("@arco-design/web-vue"))["Scrollbar"];
    }
}

export {};
