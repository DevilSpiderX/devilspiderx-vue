import { createApp } from 'vue'
import App from './App.vue'
import "@arco-design/web-vue/dist/arco.min.css";
import router from './router';
import DsxPlugins from "./plugins/dsxPlugins";

const app = createApp(App);
app.use(router);
app.use(DsxPlugins);
app.mount('#app');
