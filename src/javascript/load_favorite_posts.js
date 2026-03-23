async function loadFavoritePosts() {
    const container = document.getElementById('favorites-container');

    const favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
    container.innerHTML = '';

    if (favorites.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #888;">No tienes posts guardados en favoritos aún. ¡Explora los foros y añade algunos!</p>';
        return;
    }


    favorites.forEach(fav => {
        const author = fav.post.author_name || "Usuario";
        const forumTitle = fav.forum;
        const card = document.createElement('div');
        card.className = 'post-card';

        card.innerHTML = `
            <span class="star-icon" style="color: #f39c12;">&#9733;</span> <p class="post-title" style="margin-bottom: 5px;">${author}</p>
            <p style="font-size: 12px; color: #555; text-align: center; padding: 0 10px;">Foro: ${forumTitle}</p>
        `;

        container.appendChild(card);
    });
}
/*function loadFavoritePosts(userId) {

    const users = await fetch(`../assets/users.json`);
    const usersJson=await users.json();

    let favoritePostsIds = usersJson.find(user => user.user_id === userId).Favorite_posts;

    let forums = await fetch(`../assets/forums.json`);
    let forumsJson = await forums.json();

    let container = document.querySelector('section[id="favorite-posts"]');
    container.innerHTML = ``;
    const postTemplateFile = await fetch('../html/components/Post.html');
    const postTemplate = await postTemplateFile.text();

    let current_iter=0;
    for (let i=0; i<favoritePostsIds.length; i++) {
        post=favoritePostsIds[i];
        let postToInsert = forumsJson
            .find(forum => forum.forum_title === post.Forum)
            .posts
            .find(forumPost => forumPost.post_id === post.post_id);

        let postCard = document.createElement('div');
        postCard.id = "post-body";

        postCard.innerHTML = postTemplate;

        container.appendChild(postCard);

        document.querySelectorAll('div[id="like-amount"]')[current_iter].innerHTML = postToInsert.Likes;
        document.querySelectorAll('div[id="post-description"]')[current_iter].innerHTML = postToInsert.Description;

        let user = usersJson.find(user => user.user_id === postToInsert.author_id);

        document.querySelectorAll('div[id="profile-name"]')[current_iter].innerHTML = user.username
        document.querySelectorAll('img[id="profile-photo"]')[current_iter].src = user.Profile_picture;

        for (const file of postToInsert.files) {
            const embedFile=document.createElement("a")
            embedFile.href = file.fileSrc
            embedFile.classList.add('embedded-file');
            embedFile.innerHTML = "<p>"+ file.fileName +"</p>";
            document.querySelectorAll('div[id="files"]')[current_iter].appendChild(embedFile);
        }

        current_iter++;
    }
}*/