import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function LinkList() {
  const [links, setLinks] = useState([]); // Estado para la lista de enlaces
  const [filter, setFilter] = useState(""); // Estado para el filtro
  const [newLink, setNewLink] = useState({ title: "", url: "", tags: "" }); // Estado para el formulario

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      const response = await axios.get("http://localhost:3000/links");
      setLinks(response.data);
    } catch (error) {
      console.error("Error al cargar los enlaces:", error);
    }
  }

  async function addLink(event) {
    event.preventDefault(); // Evita recargar la página

    if (!newLink.title || !newLink.url) {
      alert("El título y la URL son obligatorios");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/links", {
        title: newLink.title,
        url: newLink.url,
        tags: newLink.tags.split(",").map(tag => tag.trim()), // Convierte la cadena en array
      });

      setLinks([...links, response.data]); // Agrega el nuevo enlace a la lista
      setNewLink({ title: "", url: "", tags: "" }); // Limpia el formulario
    } catch (error) {
      console.error("Error al agregar el enlace:", error);
    }
  }

  const filteredLinks = links.filter((link) =>
    link.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div>
      <h2>Listado de Enlaces</h2>

      {/* Formulario para agregar enlaces */}
      <form onSubmit={addLink}>
        <h3>Agregar Nuevo Enlace</h3>
        <label>Título:</label>
        <input
          type="text"
          value={newLink.title}
          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          required
        />

        <label>URL:</label>
        <input
          type=""
          value={newLink.url}
          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          required
        />

        <label>Etiquetas:</label>
        <input
          type="text"
          value={newLink.tags}
          onChange={(e) => setNewLink({ ...newLink, tags: e.target.value })}
        />

        <button type="submit">Agregar</button>
      </form>

      {/* Filtro */}
      <input
        type="text"
        placeholder="Filtrar por etiquetas"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      

      {/* Lista de enlaces */}
      <ul>
        {filteredLinks.map((link) => (
          <li key={link._id}>
            <Link className="botontittle" to={`/link/${link._id}`}>{link.title}</Link>
            <p>URL: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
            <p>Etiquetas: {link.tags.join(", ")}</p>
            <p>Votos: {link.votes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
