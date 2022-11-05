import { createApp } from 'vue'
import App from './App.vue'
import "@arco-design/web-vue/dist/arco.min.css";
import router from './router';
import MyPlugins from "./plugins/myPlugins";

const app = createApp(App);
app.use(router);
app.use(MyPlugins);
app.mount('#app');
