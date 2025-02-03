import Home from './components/Home.svelte';
import LinkDetail from './components/LinkDetail.svelte';

export const routes = {
  '/': Home,
  '/link/:id': LinkDetail // ✅ Correcto
};
