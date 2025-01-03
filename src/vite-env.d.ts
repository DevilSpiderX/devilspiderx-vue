/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_WS_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly filePath: string;
    readonly codeLineNum: number;
}
