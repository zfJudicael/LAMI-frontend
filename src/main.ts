import './assets/main.css';
import '/node_modules/primeflex/primeflex.css';
import './assets/style.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Primevue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Primevue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.use(ConfirmationService)

app.mount('#app');
