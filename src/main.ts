import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';
import '@/static/global.css';
import { initAuth } from '@/data/auth';

// Initialize auth state from localStorage
initAuth();

createApp(App).use(router).mount('#app');
