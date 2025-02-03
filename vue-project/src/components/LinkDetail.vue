<template>
  <div v-if="link">
    <h2>{{ link.title }}</h2>
    <p><strong>URL:</strong> <a :href="link.url" target="_blank">{{ link.url }}</a></p>
    <p><strong>Etiquetas:</strong> {{ link.tags.join(", ") }}</p>
    <p><strong>Votos:</strong> <span id="votes-count">{{ link.votes }}</span></p>
    <button @click="vote(1)">Upvote</button>
    <button @click="vote(-1)">Downvote</button>

    <h3>Comentarios</h3>
    <ul>
      <li v-for="(comment, index) in link.comments" :key="index">{{ comment }}</li>
    </ul>

    <form @submit.prevent="addComment">
      <label>Nuevo comentario:</label><br />
      <textarea v-model="newComment" required></textarea><br />
      <button type="submit">Agregar comentario</button>
    </form>
  </div>
  <div v-else>
    <h2>Cargando enlace...</h2>
  </div>
</template>

<script>
import axios from "axios";    //para que sirve axios 

export default {
  props: ["id"], // Recibimos el ID correctamente
  data() {
    return {
      link: null,
      newComment: "",
    };
  },
  async mounted() {
    console.log("ID recibido:", this.id); // Depuración
    await this.fetchLink();
  },
  methods: {
    async fetchLink() {
      try {
        const response = await axios.get(`http://localhost:3000/links/${this.id}`);
        this.link = response.data;
      } catch (error) {
        console.error("Error al cargar el enlace:", error);
        alert("Error al cargar el enlace. Por favor, inténtalo de nuevo.");
      }
    },
    async vote(value) {
      try {
        const response = await axios.post(`http://localhost:3000/links/${this.id}/votes`, { value });
        this.link.votes = response.data.votes;
      } catch (error) {
        console.error("Error al votar:", error);
        alert("Error al votar.");
      }
    },
    async addComment() {
      if (!this.newComment.trim()) return;
      try {
        const response = await axios.post(`http://localhost:3000/links/${this.id}/comments`, {
          comment: this.newComment.trim(),
        });
        this.link.comments = response.data.comments;
        this.newComment = "";
      } catch (error) {
        console.error("Error al agregar comentario:", error);
        alert("Error al agregar comentario.");
      }
    },
  },
};
</script>
