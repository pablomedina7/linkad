<script>
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';

  const API_URL = 'http://localhost:3000';

  let links = []; // Lista de enlaces originales
  let filteredLinks = []; // Lista de enlaces filtrados
  let filter = '';
  let error = '';
  let newTitle = '';
  let newUrl = '';
  let newTags = '';

  // Cargar enlaces desde la API cuando se monta el componente
  onMount(async () => {
    try {
      const response = await fetch(`${API_URL}/links`);
      links = await response.json();
      filteredLinks = links; // Inicialmente, todos los enlaces están visibles
    } catch (err) {
      error = 'Error cargando enlaces';
    }
  });

  async function addLink(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          url: newUrl,
          tags: newTags.split(',').map(tag => tag.trim()),
        }),
      });

      if (response.ok) {
        const newLink = await response.json();
        links = [...links, newLink];
        filteredLinks = links; // Actualizar lista filtrada
        newTitle = '';
        newUrl = '';
        newTags = '';
      }
    } catch (err) {
      error = 'Error al agregar el enlace';
    }
  }

  // Función para aplicar el filtro en tiempo real
  function applyFilter() {
    if (!filter.trim()) {
      filteredLinks = links; // Si no hay filtro, mostrar todos los enlaces
      return;
    }
    filteredLinks = links.filter(link =>
      link.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );
  }
</script>

<div class="container">
  <div class="filter-section">
    <input 
      type="text" 
      id="filter"
      name="filter"
      bind:value={filter} 
      on:input={applyFilter}  
      placeholder="Filtrar por etiquetas..."
    />
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <form on:submit|preventDefault={addLink} class="add-form">
    <h2>Agregar Nuevo Enlace</h2>
    
    <label for="title">
      Título:
      <input type="text" id="title" name="title" bind:value={newTitle} required />
    </label>
    
    <label for="url">
      URL:
      <input type="url" id="url" name="url" bind:value={newUrl} required pattern="https?://.+" />
    </label>
    
    <label for="tags">
      Etiquetas:
      <input type="text" id="tags" name="tags" bind:value={newTags} />
    </label>
    
    <button type="submit">Agregar</button>
  </form>
</div>

<div class="link-list">
  {#each filteredLinks as link}
    <div 
      class="link-item"
      role="button"
      tabindex="0"
      on:click={() => {
        console.log("➡️ Navegando a:", `/link/${link._id}`);
        push(`/link/${link._id}`);
      }}
      on:keydown={(e) => { if (e.key === 'Enter') push(`/link/${link._id}`); }}
    >
      <h3>{link.title || 'Sin título'}</h3>
      <p class="url">
        <a href={link.url} target="_blank">{link.url}</a> 
      </p>
      <div class="meta">
        <span class="tags">Etiquetas: {link.tags?.join(', ') || 'Ninguna'}</span>
        <br>
        <span class="votes">Votos: {link.votes || 0}</span>
      </div>
    </div>
  {/each}
</div>
