/// <reference types="vite/client" />

declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

interface ImportMetaEnv {
    readonly VITE_HOSTNAME: string;
    readonly VITE_APP_API_URL: string;
    readonly VITE_APP_WS_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
    /**
     * 当前文件相对于/src的路径
     */
    readonly filePath: string;
    /**
     * 当前代码所在行数
     */
    readonly codeLineNum: number;
}
