<template>
  <div>
    <form @submit.prevent="addLink">
      <h3>Agregar Nuevo Enlace</h3>
      <label>Título:</label>
      <input v-model="newLink.title" required />
      <label class="url-label">URL:</label>
      <input v-model="newLink.url" required />
      <label>Etiquetas:</label>
      <input v-model="newLink.tags" />
      <button type="submit">Agregar</button>
    </form>

    <h2>Listado de Enlaces</h2>
    <input type="text" v-model="filter" placeholder="Filtrar por etiquetas" />
    <button @click="filterLinks">Filtrar</button>
    <ul>
      <li v-for="link in filteredLinks" :key="link._id">
        <!-- Cambiamos `href` por `router-link` para que Vue maneje la navegación -->
        <router-link :to="'/link/' + link._id">{{ link.title }}</router-link>
        <p>URL: <a :href="link.url" target="_blank">{{ link.url }}</a></p>
        <p>Etiquetas: {{ link.tags.join(", ") }}</p>
        <p>Votos: {{ link.votes }}</p>
      </li>
    </ul>

    
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      links: [],
      filter: "",
      newLink: {
        title: "",
        url: "",
        tags: "",
      },
    };
  },
  computed: {
    filteredLinks() {
      if (!this.filter.trim()) return this.links;
      return this.links.filter((link) =>
        link.tags.some((tag) => tag.toLowerCase().includes(this.filter.toLowerCase()))
      );
    },
  },
  async mounted() {
    await this.fetchLinks();
  },
  methods: {
    async fetchLinks() {
      try {
        const response = await axios.get("http://localhost:3000/links");
        this.links = response.data;
      } catch (error) {
        console.error("Error al cargar los enlaces:", error);
      }
    },
    async addLink() {
      try {
        const { title, url, tags } = this.newLink;
        const response = await axios.post("http://localhost:3000/links", {
          title,
          url,
          tags: tags.split(","),
        });
        this.links.push(response.data);
        this.newLink = { title: "", url: "", tags: "" };
      } catch (error) {
        console.error("Error al agregar el enlace:", error);
      }
    },
  },
};

</script>

