async function loadForums(forum_title) {
    try {
        const response = await fetch('../assets/forums.json');
        const forums = await response.json();
        const postTemplateFile = await fetch('../html/components/Post.html');
        const postTemplate = await postTemplateFile.text();
        const usersJSON = await fetch('../assets/users.json');
        const defaultUsers = await usersJSON.json();
        const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers')) || [];
        const users = [...defaultUsers, ...localUsers]; // Juntamos todos los usuarios
        const container = document.querySelector('div[id="forums-container"]');
        forums
            .filter(forum => forum_title === forum.forum_title)
            .forEach(forum => {

                let postsArray = Object.values(forum.posts);
                const customPosts = JSON.parse(localStorage.getItem('myCustomPosts')) || [];
                postsArray = [...customPosts.reverse(), ...postsArray];
                let current_iter = 0;
                postsArray.forEach(post => {
                    if (container) {
                        const postCard = document.createElement('div');
                        postCard.id = "post-body";
                        postCard.innerHTML = postTemplate;

                        container.appendChild(postCard);


                        document.querySelectorAll('div[id="like-amount"]')[current_iter].innerHTML = post.Likes;
                        document.querySelectorAll('div[id="post-description"]')[current_iter].innerHTML = post.Description;

                        let user = users.find(u => u.user_id == post.author_id) || users[0];
                        document.querySelectorAll('div[id="profile-name"]')[current_iter].innerHTML = user.username;
                        const avatarSrc = user.Profile_picture || "../assets/dummy_picture.jpeg";
                        document.querySelectorAll('img[id="profile-photo"]')[current_iter].src = avatarSrc;


                        if (post.files) {
                            for (const file of post.files) {
                                const embedFile = document.createElement("a");
                                embedFile.href = file.fileSrc;
                                embedFile.classList.add('embedded-file');
                                embedFile.innerHTML = "<p>" + file.fileName + "</p>";
                                document.querySelectorAll('div[id="files"]')[current_iter].appendChild(embedFile);
                            }
                        }
                        const favBtn = document.querySelectorAll('.add-to-fav-btn')[current_iter];
                        if (favBtn) {
                            favBtn.onclick = function() {
                                saveToFavorites(forum.forum_title, post);
                            };
                        }

                        current_iter++;
                    }
                });
            });
    } catch (error) {
        console.error("Error al cargar forums:", error);
    }
}