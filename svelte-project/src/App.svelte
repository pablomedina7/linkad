<script>
  import Router from 'svelte-spa-router';  // ✅ CORRECTO
  import { routes } from './routes.js';
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
