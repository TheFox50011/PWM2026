// Archivo: src/javascript/load_forum.js

async function loadForums(forum_title) {
    try {
        const response = await fetch('../assets/forums.json');
        const defaultForums = await response.json();
        const customForums = JSON.parse(localStorage.getItem('savedForums')) || [];
        const forums = [...defaultForums, ...customForums];

        const postTemplateFile = await fetch('../html/components/Post.html');
        const postTemplate = await postTemplateFile.text();

        const usersJSON = await fetch('../assets/users.json');
        const defaultUsers = await usersJSON.json();
        const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers')) || [];
        const users = [...defaultUsers, ...localUsers];

        const container = document.getElementById("forums-container");
        if (!container) return;

        container.innerHTML = "";

        const targetForum = forums.find(forum => forum_title === forum.forum_title);

        if (targetForum) {
            let postsArray = targetForum.posts ? Object.values(targetForum.posts) : [];
            const customPosts = JSON.parse(localStorage.getItem('myCustomPosts')) || [];

            const postsOfThisForum = customPosts.filter(p => {
                const postForum = p.forum_name || "dummy forum";
                return postForum === forum_title;
            });

            postsArray = [...postsOfThisForum.reverse(), ...postsArray];

            if (postsArray.length === 0) {
                container.innerHTML = `<h3 style="text-align: center; color: #888; margin-top: 50px;">El foro "${forum_title}" está vacío.<br><br> ¡Sé el primero en escribir un post arriba! 🚀</h3>`;
                return;
            }


            const currentUserId = localStorage.getItem('loggedUserId') || 1;
            const allFavorites = JSON.parse(localStorage.getItem('myUserFavorites')) || {};
            const userFavorites = allFavorites[currentUserId] || [];

            postsArray.forEach(post => {
                const postCard = document.createElement('div');
                postCard.className = "post-card";
                postCard.id = "post-body";

                postCard.dataset.postId = post.post_id || ("post_" + Date.now());
                postCard.innerHTML = postTemplate;

                const likeAmount = postCard.querySelector('#like-amount');
                if (likeAmount) likeAmount.innerHTML = post.Likes || 0;

                const desc = postCard.querySelector('#post-description');
                if (desc) desc.innerHTML = post.Description || "";

                const profileName = postCard.querySelector('#profile-name');
                let user = users.find(u => u.user_id == post.author_id) || users[0];
                if (profileName && user) profileName.innerHTML = user.username || "Usuario";

                const profilePhoto = postCard.querySelector('#profile-photo');
                if (profilePhoto && user) {
                    profilePhoto.src = user.Profile_picture || "../assets/dummy_picture.jpeg";
                }

                const filesContainer = postCard.querySelector('#files');
                if (filesContainer && post.files && post.files.length > 0) {
                    post.files.forEach(file => {
                        const embedFile = document.createElement("a");
                        embedFile.href = file.fileSrc;
                        embedFile.classList.add('embedded-file');
                        embedFile.innerHTML = "<p>" + file.fileName + "</p>";
                        filesContainer.appendChild(embedFile);
                    });
                }


                const favBtn = postCard.querySelector('.add-to-fav-btn');
                if (favBtn) {
                    const isFavorited = userFavorites.some(fav => fav.post_id === postCard.dataset.postId);
                    if (isFavorited) {
                        favBtn.innerHTML = "❌ Quitar de Favoritos";
                        favBtn.dataset.favorited = "true";
                    } else {
                        favBtn.innerHTML = "⭐ Añadir a Favoritos";
                        favBtn.dataset.favorited = "false";
                    }
                }

                container.appendChild(postCard);
            });

        } else {
            container.innerHTML = '<h3 style="text-align: center; color: #888; margin-top: 50px;">Foro no encontrado.</h3>';
        }
    } catch (error) {
        console.error("Error al cargar forums:", error);
    }
}

async function loadSideForums(forum_title) {
    const response = await fetch('../assets/forums.json');
    const defaultForums = await response.json();
    const customForums = JSON.parse(localStorage.getItem('savedForums')) || [];
    const forums = [...defaultForums, ...customForums];

    forumsSection = document.querySelector('#forums-section');
    for (const forum of forums) {
        if (forum.forum_title === forum_title) {
            continue
        }
        let forumLine=document.createElement("div")
        forumLine.className = "forumLines";
        let sideForumTitle= document.createElement("a");
        sideForumTitle.className = "sideForumTitle";
        sideForumTitle.innerHTML = forum.forum_title;
        sideForumTitle.href = "Mainpage.html?forum=" + forum.forum_title;
        forumLine.appendChild(sideForumTitle);
        sideForumDescription = document.createElement("div");
        sideForumDescription.className = "sideForumDescription";
        sideForumDescription.innerHTML = forum["forum description"];
        forumLine.appendChild(sideForumDescription);
        forumsSection.appendChild(forumLine);
    }
}