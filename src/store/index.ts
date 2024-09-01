import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

export default pinia;

if (import.meta.env.DEV) {
    //@ts-ignore
    window.$pinia = pinia;
}
