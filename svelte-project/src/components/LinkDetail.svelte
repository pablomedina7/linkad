<script>
  import { onMount } from 'svelte';
  import { push, location } from 'svelte-spa-router';

  const API_URL = 'http://localhost:3000';

  let link = null;
  let newComment = '';
  let error = '';
  let isLoading = true;

  // ✅ Obtener el ID desde la URL de forma correcta usando `$location`
  $: id = $location?.split('/')[2] || null;

  onMount(async () => {
    console.log("🔍 Obteniendo enlace con ID:", id);

    try {
      if (!id || id === "undefined") {
        throw new Error('ID no proporcionado');
      }

      const response = await fetch(`${API_URL}/links/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      link = await response.json();
      console.log("✅ Datos obtenidos:", link);
    } catch (err) {
      error = `Error al cargar: ${err.message}`;
      console.error('❌ Detalles del error:', { id, error: err });
    } finally {
      isLoading = false;
    }
  });

  // ✅ Función para votar
  async function handleVote(value) {
    try {
      const response = await fetch(`${API_URL}/links/${id}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      if (!response.ok) throw new Error('Error en el voto');
      const updated = await response.json();
      link.votes = updated.votes;
    } catch (err) {
      error = `Error al votar: ${err.message}`;
    }
  }

  // ✅ Función para añadir un comentario
  async function addComment(e) {
    e.preventDefault();
    try {
      if (!newComment.trim()) return;

      const response = await fetch(`${API_URL}/links/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: newComment }),
      });

      if (!response.ok) throw new Error('Error en el servidor');

      const updated = await response.json();
      link.comments = updated.comments;
      newComment = '';
    } catch (err) {
      error = `Error al comentar: ${err.message}`;
    }
  }
</script>

<button on:click={() => push('/')}>← Volver</button>

{#if isLoading}
  <p>Cargando enlace...</p>
{:else if error}
  <div>
    <h3>Error</h3>
    <p>{error}</p>
    {#if id}
      <small>ID usado: {id}</small>
    {/if}
  </div>
{:else if link}
  <h1>{link.title}</h1>
  <p>
    <a href={link.url} target="_blank" rel="noopener noreferrer">
      {link.url}
    </a>
  </p>

  <!-- ✅ Votos fuera del botón -->
  <p>Votos: {link.votes}</p>
  <button on:click={() => handleVote(1)}>Upvote +1</button>
  <button on:click={() => handleVote(-1)}>Downvote -1</button>

  <h2>Comentarios ({link.comments.length})</h2>
  
  {#each link.comments as comment}
    <div>{comment}</div>
  {/each}

  <form on:submit={addComment}>
    <textarea bind:value={newComment} placeholder="Nuevo comentario..."></textarea>
    <button type="submit">Agregar comentario</button>
  </form>
{/if}
