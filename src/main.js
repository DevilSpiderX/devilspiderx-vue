import {createApp} from 'vue';
import router from './router';
import App from './App.vue';
import {setThemeColor} from "@/js/global";

const app = createApp(App);
app.use(router);
app.config.globalProperties.setThemeColor = setThemeColor;
app.mount('#app');
