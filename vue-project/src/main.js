import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 📌 Importamos Vue Router

createApp(App).use(router).mount("#app"); // 📌 Habilitamos Vue Router
