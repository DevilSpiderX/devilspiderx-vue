import { App } from "vue";

declare function setThemeColor(color: string): void;

declare function getTheme(): void;

declare function changeTheme(themeName: string): void;

declare function sleep(duration: number): Promise<any>;

declare const isTouchDevice: boolean;

declare namespace DsxPlugins {
    function install(app: App): void;
}

export default DsxPlugins;
export { setThemeColor, getTheme, changeTheme, sleep, isTouchDevice };
