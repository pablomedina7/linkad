const API_URL = 'http://localhost:3000'; // Backend URL

// Cambia la vista en función de la ruta
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

function router() {
  const main = document.getElementById('app');
  const hash = window.location.hash || '#/';
  main.innerHTML = '';

  if (hash === '#/') {
    renderHome();
  } else if (hash.startsWith('#/link/')) {
    const linkId = hash.split('/')[2]; // Obtén el ID del enlace desde el hash
    if (linkId && linkId !== 'undefined' && linkId.trim() !== '') {
      renderLinkDetail(linkId);
    } else {
      main.innerHTML = '<h2>Error: ID del enlace no válido</h2>';
    }
  } else {
    main.innerHTML = '<h2>Página no encontrada</h2>';
  }
}

// Renderiza la página de inicio
async function renderHome() {
  const main = document.getElementById('app');
  main.className = 'main';
  main.innerHTML = `
    <h2>Listado de Enlaces</h2>
    <input type="text" id="filter-tags" placeholder="Filtrar por etiquetas" />
    <button id="filter-button">Filtrar</button>
    <div id="links-list"></div>
  `;

  try {
    const links = await fetch(`${API_URL}/links`).then((res) => res.json());
    displayLinks(links);
// Formulario para agregar un enlace
    const form = document.createElement('form');
    form.className = 'add-link-form';
    form.innerHTML = `
      <h3>Agregar Nuevo Enlace</h3>
      <label>Título: <input name="title" required></label><br />
      <label>URL: <input name="url" required></label><br />
      <label>Etiquetas (separadas por comas): <input name="tags"></label><br />
      <button type="submit">Agregar</button>
    `;
    // Filtrar enlaces
    document.getElementById('filter-button').addEventListener('click', () => {
      const filter = document.getElementById('filter-tags').value.toLowerCase();
      const filteredLinks = links.filter((link) =>
        link.tags.some((tag) => tag.toLowerCase().includes(filter))
      );
      displayLinks(filteredLinks);
    });

    // Mostrar enlaces
    function displayLinks(links) {
      const listContainer = document.getElementById('links-list');
      className = 'links-list';
      listContainer.innerHTML = links
        .map(
          (link) => `
          <div>
            <a href="#/link/${link._id}">${link.title}</a>
            <p>URL: <a href="${link.url}" target="_blank">${link.url}</a></p>
            <p>Etiquetas: ${link.tags.join(', ')}</p>
            <p>Votos: ${link.votes}</p>
          </div>`
        )
        .join('');
    }

    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      try {
        await fetch(`${API_URL}/links`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.get('title'),
            url: data.get('url'),
            tags: data.get('tags').split(','),
          }),
        });
        router(); // Recarga la lista
      } catch (error) {
        alert('Error al agregar el enlace. Inténtalo más tarde.');
      }
    });
    main.appendChild(form);
  } catch (error) {
    console.error('Error al cargar los enlaces:', error);
    main.innerHTML = '<p>Error al cargar los enlaces. Inténtalo más tarde.</p>';
  }
}

async function renderLinkDetail(id) {
  const main = document.getElementById('app');
  try {
    const response = await fetch(`${API_URL}/links/${id}`);
    if (!response.ok) throw new Error('Enlace no encontrado');
    const link = await response.json();
    main.innerHTML = `
      <h2>${link.title}</h2>
      <p>URL:<a href="${link.url}" target="_blank">${link.url}</a></p>
      <p><strong>Etiquetas:</strong> ${link.tags.join(', ')}</p>
      <p><strong>Votos:</strong> <span id="votes-count">${link.votes}</span></p>
      <button id="upvote">Upvote</button>
      <button id="downvote">Downvote</button>
      <h3>Comentarios</h3>
      <ul id="comments-list">
        ${link.comments
          .map(
            (comment, index) => `
            <li>
              ${comment}
              <button class="delete-comment" data-index="${index}">Eliminar</button>
            </li>`
          )
          .join('')}
      </ul>
      <form id="comment-form">
        <label>Nuevo comentario:</label><br />
        <textarea name="comment" required></textarea><br />
        <button type="submit">Agregar comentario</button>
      </form>
    `;

    // Manejo de votos
    document.getElementById('upvote').addEventListener('click', async () => {
      await fetch(`${API_URL}/links/${id}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: 1 }),
      });
      document.getElementById('votes-count').textContent = ++link.votes;
    });

    document.getElementById('downvote').addEventListener('click', async () => {
      await fetch(`${API_URL}/links/${id}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: -1 }),
      });
      document.getElementById('votes-count').textContent = --link.votes;
    });

    // Manejo del formulario de comentarios
    document.getElementById('comment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const comment = new FormData(e.target).get('comment');
      try {
        await fetch(`${API_URL}/links/${id}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment }),
        });
        router(); // Recargar la vista
      } catch (error) {
        alert('Error al agregar el comentario. Inténtalo más tarde.');
      }
    });

    // Manejo de eliminación de comentarios
    document.querySelectorAll('.delete-comment').forEach((button) => {
      button.addEventListener('click', async () => {
        const commentIndex = button.dataset.index;
        try {
          await fetch(`${API_URL}/links/${id}/comments/${commentIndex}`, {
            method: 'DELETE',
          });
          router(); // Recargar la vista
        } catch (error) {
          alert('Error al eliminar el comentario. Inténtalo más tarde.');
        }
      });
    });
  } catch (error) {
    console.error('Error al cargar el enlace:', error);
    main.innerHTML = '<p>Error al cargar el enlace. Inténtalo más tarde.</p>';
  }
}
