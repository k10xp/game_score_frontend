import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import '@/static/global.css';
import { initAuth } from '@/data/auth';
import { VuePlotly } from '@clalarco/vue3-plotly';

// Initialize auth state from localStorage
initAuth();

createApp(App).use(router).component('VuePlotly', VuePlotly).mount('#app');
