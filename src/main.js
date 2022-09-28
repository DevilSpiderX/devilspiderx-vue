import {createApp} from 'vue';
import router from './router';
import App from './App.vue';

const app = createApp(App);
app.use(router);
const instance = app.mount('#app');

export default instance;
