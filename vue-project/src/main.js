import { createApp } from "vue";    //se importa el createApp de Vue para inicializar la app
import App from "./App.vue";         //se importa el componente App
import router from "./router"; // 📌 Importamos Vue Router
import './style.css'//deberian de estar los estilos
createApp(App).use(router).mount("#app"); // 📌 Habilitamos Vue Router
