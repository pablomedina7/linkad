import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function LinkList() {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/links").then((response) => {
      setLinks(response.data);
    });
  }, []);

  const filteredLinks = links.filter((link) =>
    link.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div>
      <h2>Listado de Enlaces</h2>
      <input
        type="text"
        placeholder="Filtrar por etiquetas"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <button>Filtrar</button>

      <ul>
        {filteredLinks.map((link) => (
          <li key={link._id}>
            <Link to={`/link/${link._id}`}>{link.title}</Link>
            <p>URL: <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
            <p>Etiquetas: {link.tags.join(", ")}</p>
            <p>Votos: {link.votes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
