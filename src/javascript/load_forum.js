async function loadForums(forum_title) {
    try {
        const response = await fetch('../assets/forums.json');
        const forums = await response.json();
        const postTemplateFile = await fetch('../html/components/Post.html');
        const postTemplate = await postTemplateFile.text();
        const usersJSON = await fetch('../assets/users.json');
        const users = await usersJSON.json();

        const container = document.querySelector('div[id="forums-container"]');

        forums
            .filter(forum=>(forum_title===forum.forum_title))
            .forEach(forum => {
            console.log(`Cargando foro: ${forum.forum_title}`);
            const postsArray = Object.values(forum.posts);

            current_iter=0;
            postsArray.forEach(post => {
                if (container) {
                    const postCard = document.createElement('div');
                    postCard.id = "post-body";

                    postCard.innerHTML = postTemplate;

                    container.appendChild(postCard);

                    document.querySelectorAll('div[id="like-amount"]')[current_iter].innerHTML = post.Likes;
                    document.querySelectorAll('div[id="post-description"]')[current_iter].innerHTML = post.Description;

                    user = users.find(user => user.user_id === post.author_id);

                    document.querySelectorAll('div[id="profile-name"]')[current_iter].innerHTML = user.username
                    document.querySelectorAll('img[id="profile-photo"]')[current_iter].src = user.Profile_picture;

                    for (const file of post.files) {
                        const embedFile=document.createElement("a")
                        embedFile.href = file.fileSrc
                        embedFile.classList.add('embedded-file');
                        embedFile.innerHTML = "<p>"+ file.fileName +"</p>";
                        document.querySelectorAll('div[id="files"]')[current_iter].appendChild(embedFile);
                    }

                    current_iter++;
                }
            });
        });
    } catch (error) {
        console.error("Error al cargar forums.json:", error);
    }
}
function togglePostMenu(buttonElement) {
    const popupMenu = buttonElement.nextElementSibling;

    document.querySelectorAll('.post-popup-menu.active').forEach(menu => {
        if (menu !== popupMenu) {
            menu.classList.remove('active');
        }
    });
    popupMenu.classList.toggle('active');
}


document.addEventListener('click', function(event) {
    if (!event.target.closest('#post_options')) {
        document.querySelectorAll('.post-popup-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
});