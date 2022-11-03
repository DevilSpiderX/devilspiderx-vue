import {App} from "vue";

declare function setThemeColor(color: string): void;

declare function getTheme(): void;

declare function changeTheme(themeName: string): void;

declare function sleep(duration: number): Promise<any>;

export {setThemeColor, getTheme, changeTheme, sleep};

declare namespace MyPlugins {
    function install(app: App): void;
}

export default MyPlugins;
