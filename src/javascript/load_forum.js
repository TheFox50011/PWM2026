async function loadForums() {
    try {
        const response = await fetch('../assets/forums.json');
        const forums = await response.json();

        // Supongamos que tienes un contenedor en el HTML con id="forums-container"
        const container = document.querySelector('div[id="forums-container"]');

        forums.forEach(forum => {
            console.log(`Cargando foro: ${forum.forum_title}`);

            // Los posts están dentro de un objeto, usamos Object.values para convertirlo en array
            const postsArray = Object.values(forum.posts);

            postsArray.forEach(post => {
                // Si el contenedor existe, creamos los elementos HTML dinámicamente
                if (container) {
                    const postCard = document.createElement('div');
                    postCard.className = 'post-card'; // Clase que tienes en Favorites.css

                    postCard.innerHTML = `
                        <span class="star-icon">&#9734;</span>
                        <p class="post-title">${post.Description}</p>
                        <p style="font-size:12px; color:#666;">Likes: ${post.Likes} | Comentarios: ${post.Comments}</p>
                    `;

                    container.appendChild(postCard);
                }
            });
        });
    } catch (error) {
        console.error("Error al cargar forums.json:", error);
    }
}