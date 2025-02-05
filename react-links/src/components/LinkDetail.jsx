import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LinkDetail() {
  const { id } = useParams();
  const [link, setLink] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/links/${id}`)
      .then((response) => setLink(response.data))
      .catch((error) => console.error("Error al cargar el enlace:", error));
  }, [id]);

  const vote = async (value) => {
    try {
      const response = await axios.post(`http://localhost:3000/links/${id}/votes`, { value });
      setLink({ ...link, votes: response.data.votes });
    } catch (error) {
      console.error("Error al votar:", error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`http://localhost:3000/links/${id}/comments`, { comment: newComment });
      setLink({ ...link, comments: response.data.comments });
      setNewComment("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const deleteComment = async (index) => {
    try {
    await axios.delete(`http://localhost:3000/links/${id}/comments/${index}`);
    setLink((prevLink) => ({
      ...prevLink,
      comments: prevLink.comments.filter((_, i) => i !== index)
    }))} catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  }
  if (!link) return <h2>Cargando enlace...</h2>;

  return (
    <div>
      <h2>{link.title}</h2>
      <p><strong>URL:</strong> <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a></p>
      <p><strong>Etiquetas:</strong> {link.tags.join(", ")}</p>
      <p><strong>Votos:</strong> {link.votes}</p>
      <button onClick={() => vote(1)}>Upvote</button>
      <button onClick={() => vote(-1)}>Downvote</button>

      <h3>Comentarios</h3>
      <ul>
        {link.comments.map((comment, index) => (
          <li key={index}>
            {comment} 
            <button onClick={() => deleteComment(index)} style={{ marginLeft: "10px", color: "red" }}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
      <button onClick={addComment}>Agregar comentario</button>
    </div>
  );
}
