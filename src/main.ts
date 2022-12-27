import { createApp } from 'vue';
import App from './App.vue';
import "./style.css";
import "./styles/box-shadow.css";
import router from './router/router';
import pinia from './store/pinia';

const app = createApp(App);
app.use(router)
    .use(pinia)
    .mount('#app');
