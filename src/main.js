import {createApp} from 'vue'
import App from './App.vue'
import router from './router.js';
import MyPlugins from "./plugins/myPlugins.js";
import sleep from "/src/js/timeout.js";

const app = createApp(App);
app.use(router);
app.use(MyPlugins)
app.mount('#app');

window.sleep = sleep;