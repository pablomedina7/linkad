const API_URL = 'http://localhost:3000'; // Backend URL

// SPA: Controla la navegación sin recargar la página
window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// ✅ Función para renderizar la página de inicio
async function renderHome() {
  const main = document.getElementById('app');
  main.className = 'main';

  main.innerHTML = `
    <form id="add-link-form" class="add-link-form">
      <h3>Agregar Nuevo Enlace</h3>
      <label>Título: <input name="title" required></label><br />
      <label>URL: <input name="url" required></label><br />
      <label>Etiquetas (separadas por comas): <input name="tags"></label><br />
      <button type="submit">Agregar</button>
    </form>

    <input type="text" id="filter-tags" placeholder="Filtrar por etiquetas" />
    <button id="filter-button">Filtrar</button>

    <div id="links-list"></div>
  `;

  try {
    const links = await fetch(`${API_URL}/links`).then((res) => res.json());
    displayLinks(links);

    // ✅ Evento para filtrar etiquetas
    document.getElementById('filter-button').addEventListener('click', () => {
      const filterText = document.getElementById('filter-tags').value.trim().toLowerCase();
      const filteredLinks = links.filter(link =>
        link.tags.some(tag => tag.toLowerCase().includes(filterText))
      );
      displayLinks(filteredLinks); // Mostrar solo los enlaces filtrados
    });

  } catch (error) {
    console.error('Error al cargar los enlaces:', error);
    main.innerHTML += '<p>Error al cargar los enlaces. Inténtalo más tarde.</p>';
  }
}

// ✅ Función para mostrar los enlaces en la lista
function displayLinks(links) {
  const listContainer = document.getElementById('links-list');

  if (!listContainer) {
    console.error("Error: 'links-list' no encontrado en el DOM.");
    return;
  }

  listContainer.innerHTML = links
    .map(
      (link) => `
      <div class="link-card">
        <a href="#/link/${link._id}">${link.title}</a>
        <p>URL: <a href="${link.url}" target="_blank">${link.url}</a></p>
        <p>Etiquetas: ${link.tags.join(', ')}</p>
        <p>Votos: ${link.votes}</p>
      </div>`
    )
    .join('');
}

// ✅ Definir `router()` después de `renderHome()`
function router() {
  const main = document.getElementById('app');
  const hash = window.location.hash || '#/';
  main.innerHTML = ''; // Limpiar contenido anterior

  if (hash === '#/') {
    setTimeout(() => { 
      renderHome();
    }, 50);
  } else if (hash.startsWith('#/link/')) {
    const linkId = hash.split('/')[2];
    if (linkId && linkId !== 'undefined' && linkId.trim() !== '') {
      renderLinkDetail(linkId);
    } else {
      main.innerHTML = '<h2>Error: ID del enlace no válido</h2>';
    }
  } else {
    main.innerHTML = '<h2>Página no encontrada</h2>';
  }
}

// ✅ Renderizar los detalles de un enlace
async function renderLinkDetail(id) {
  const main = document.getElementById('app');
  try {
    const response = await fetch(`${API_URL}/links/${id}`);
    if (!response.ok) throw new Error('Enlace no encontrado');
    const link = await response.json();

    main.innerHTML = `
      <button id="home-button">Inicio</button>
      <h2>${link.title}</h2>
      <p>URL: <a href="${link.url}" target="_blank">${link.url}</a></p>
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
              <button class="delete-comment" data-index="${index}" data-id="${id}">Eliminar</button>
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

    document.getElementById('home-button').addEventListener('click', () => {
      window.location.hash = '#/';
      router();
    });

  } catch (error) {
    console.error('Error al cargar el enlace:', error);
    main.innerHTML = '<p>Error al cargar el enlace. Inténtalo más tarde.</p>';
  }
}
