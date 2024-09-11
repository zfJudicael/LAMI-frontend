import './assets/main.css';
import './assets/style.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Primevue from 'primevue/config';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Primevue);

app.mount('#app');
