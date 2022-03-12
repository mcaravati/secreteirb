import { createApp } from 'vue'
import App from './App.vue'
import store from "./store.js";
import router from "./routes.js";

createApp(App)
    .use(store)
    .use(router)
    .mount('#app')
