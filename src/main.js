import {createApp} from 'vue'
import App from './App.vue'
import router from './router.js';
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import MyPlugins from "./plugins/myPlugins.js";

const app = createApp(App);
app.use(router);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(MyPlugins);
app.mount('#app');
