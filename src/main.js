import {createApp} from 'vue'
import App from './App.vue'
import router from './router.js';
import {setThemeColor} from "./js/global.js";

const app = createApp(App);
app.use(router);
app.config.globalProperties.setThemeColor = setThemeColor;
app.config.globalProperties.isTouchDevice = "ontouchstart" in window && navigator.maxTouchPoints !== 0;
app.mount('#app');
