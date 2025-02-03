function linkList() {
    return {
        links: [],
        filter: '',
        newLink: { title: '', url: '', tags: '' },

        get filteredLinks() {
            if (!this.filter) return this.links;
            return this.links.filter(link =>
                link.tags.some(tag => tag.toLowerCase().includes(this.filter.toLowerCase()))
            );
        },

        async fetchLinks() {
            try {
                const response = await fetch('http://localhost:3000/links');
                this.links = await response.json();
            } catch (error) {
                console.error('Error al cargar los enlaces:', error);
            }
        },

        async addLink() {
            try {
                const response = await fetch('http://localhost:3000/links', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...this.newLink,
                        tags: this.newLink.tags.split(',').map(tag => tag.trim()),
                    }),
                });
                const newLink = await response.json();
                this.links.push(newLink);
                this.newLink = { title: '', url: '', tags: '' };
            } catch (error) {
                console.error('Error al agregar el enlace:', error);
            }
        }
    };
}

function linkDetail() {
    return {
        link: { title: '', url: '', tags: [], votes: 0, comments: [] },
        newComment: '',

        async fetchLink() {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');

            try {
                const response = await fetch(`http://localhost:3000/links/${id}`);
                this.link = await response.json();
            } catch (error) {
                console.error('Error al obtener detalles del enlace:', error);
            }
        },

        async vote(value) {
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');

            try {
                await fetch(`http://localhost:3000/links/${id}/votes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ value }),
                });
                this.link.votes += value;
            } catch (error) {
                console.error('Error al votar:', error);
            }
        },

        async addComment() {
            if (!this.newComment.trim()) return;
            const params = new URLSearchParams(window.location.search);
            const id = params.get('id');

            try {
                await fetch(`http://localhost:3000/links/${id}/comments`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: this.newComment.trim() }),
                });
                this.link.comments.push(this.newComment.trim());
                this.newComment = '';
            } catch (error) {
                console.error('Error al agregar comentario:', error);
            }
        }
    };
}
