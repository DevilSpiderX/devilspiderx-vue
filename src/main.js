import {createApp} from 'vue'
import App from './App.vue'
import router from './router.js';
import {setThemeColor} from "./js/global.js";
import sleep from "/src/js/timeout.js";

const app = createApp(App);
app.use(router);
app.config.globalProperties.setThemeColor = setThemeColor;
app.config.globalProperties.isTouchDevice = "ontouchstart" in window && navigator.maxTouchPoints !== 0;
app.mount('#app');

window.sleep = sleep;