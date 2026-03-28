async function loadFavoritePosts() {
    try {

        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        const loggedId = localStorage.getItem('loggedUserId');
        const userId = urlId || loggedId || 1;
        const allFavoritesDict = JSON.parse(localStorage.getItem('myUserFavorites')) || {};
        const userFavorites = allFavoritesDict[userId] || [];

        let container = document.querySelector('.favorite-posts');
        if (!container) return;

        container.innerHTML = ``;

        const postTemplateFile = await fetch('../html/components/Post.html');
        const postTemplate = await postTemplateFile.text();


        if (userFavorites.length === 0) {
            container.innerHTML = '<h3 style="text-align: center; width: 100%; color: #888; margin-top: 50px;">Aún no tienes posts guardados en favoritos.</h3>';
            return;
        }


        let current_iter = 0;

        userFavorites.reverse().forEach(post => {
            let postCard = document.createElement('div');
            postCard.className = "post-card";
            postCard.id = "post-body";
            postCard.innerHTML = postTemplate;

            container.appendChild(postCard);
            document.querySelectorAll('div[id="like-amount"]')[current_iter].innerHTML = post.Likes || 0;
            document.querySelectorAll('div[id="post-description"]')[current_iter].innerHTML = post.Description || "";
            document.querySelectorAll('div[id="profile-name"]')[current_iter].innerHTML = post.author_name || "Usuario";
            document.querySelectorAll('img[id="profile-photo"]')[current_iter].src = post.author_img || "../assets/dummy_picture.jpeg";


            if (post.files && post.files.length > 0) {
                const filesContainer = document.querySelectorAll('div[id="files"]')[current_iter];
                for (const file of post.files) {
                    const embedFile = document.createElement("a");
                    embedFile.href = file.fileSrc;
                    embedFile.classList.add('embedded-file');
                    embedFile.innerHTML = "<p>" + file.fileName + "</p>";
                    filesContainer.appendChild(embedFile);
                }
            }


            const favBtn = document.querySelectorAll('.add-to-fav-btn')[current_iter];
            if (favBtn) {
                favBtn.innerHTML = "❌ Quitar de Favoritos";
            }

            current_iter++;
        });

    } catch (error) {
        console.error("Error al cargar favoritos:", error);
    }
}