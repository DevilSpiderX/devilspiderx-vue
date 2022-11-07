import { createApp } from 'vue'
import "@arco-design/web-vue/dist/arco.min.css";
import App from './App.vue'
import router from './router/router';
import pinia from './store/pinia';
import DsxPlugins from "./plugins/dsxPlugins";

const app = createApp(App);
app.use(router)
    .use(pinia)
    .use(DsxPlugins);
app.mount('#app');
