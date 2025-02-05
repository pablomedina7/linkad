
<script>
  //  manejo de la estructura principal y el router 
  import Router from 'svelte-spa-router'; //navegación SPA  
  import { routes } from './routes.js'; //se definen las rutas
</script>

<header>
  <h1>Gestor de Enlaces</h1>
  <nav>
    <!-- Navegación básica -->
    <a href="#/">Inicio</a>
  </nav>
</header>

<main>
  <!-- Montamos el router con nuestras rutas -->
  <Router {routes} />
</main>
