document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const posts = document.querySelectorAll('#post-body');
            posts.forEach(post => {
                const text = post.innerText.toLowerCase();
                post.style.display = text.includes(term) ? '' : 'none';
            });
            const users = document.querySelectorAll('.widget-card');
            users.forEach(user => {
                const text = user.innerText.toLowerCase();
                user.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    const attachBtn = document.getElementById('btn-attach');
    const fileInput = document.getElementById('post-file-input');
    const publishBtn = document.getElementById('btn-publish');
    const textInput = document.getElementById('new-post-text');
    const attachmentPreview = document.getElementById('attachment-preview');
    const attachmentName = document.getElementById('attachment-name');
    const removeAttachmentBtn = document.getElementById('btn-remove-attachment');

    let attachedFile = null;

    if (attachBtn && fileInput) {
        attachBtn.addEventListener('click', () => {
            fileInput.click();
            document.querySelector('.add-popup-menu').style.display = 'none';
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                attachedFile = e.target.files[0];
                attachmentName.textContent = attachedFile.name;
                attachmentPreview.style.display = 'block';
            }
        });
    }

    if (removeAttachmentBtn) {
        removeAttachmentBtn.addEventListener('click', () => {
            attachedFile = null;
            fileInput.value = '';
            attachmentPreview.style.display = 'none';
        });
    }

    if (publishBtn && textInput) {
        publishBtn.addEventListener('click', () => {
            const text = textInput.value.trim();
            if (!text && !attachedFile) return alert("Por favor, escribe algo o adjunta un archivo antes de publicar.");

            const currentUserId = localStorage.getItem('loggedUserId') || 1;
            const currentForum = new URLSearchParams(window.location.search).get("forum") || "dummy forum";
            let filesArray = [];

            if (attachedFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    filesArray.push({ fileName: attachedFile.name, fileSrc: e.target.result });
                    saveAndReloadPost(text, currentUserId, filesArray, currentForum);
                };
                reader.readAsDataURL(attachedFile);
            } else {
                saveAndReloadPost(text, currentUserId, filesArray, currentForum);
            }
        });
    }

    function saveAndReloadPost(text, currentUserId, filesArray, forumName) {
        const newPost = {
            post_id: "custom_" + Date.now(),
            author_id: parseInt(currentUserId),
            forum_name: forumName,
            Description: text || "Archivo adjunto:",
            Likes: 0,
            files: filesArray
        };

        let customPosts = JSON.parse(localStorage.getItem('myCustomPosts')) || [];
        customPosts.push(newPost);

        try {
            localStorage.setItem('myCustomPosts', JSON.stringify(customPosts));
            window.location.reload();
        } catch (err) {
            alert("Error al guardar.");
        }
    }

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.add-btn-container')) {
            const addMenu = document.querySelector('.add-popup-menu');
            if (addMenu && addMenu.style.display === 'flex') {
                addMenu.style.display = 'none';
            }
        }
    });

    const widgetList = document.querySelector('.widget-list');
    const customForums = JSON.parse(localStorage.getItem('myCustomForums')) || [];

    if (widgetList && customForums.length > 0) {
        customForums.forEach(forum => {
            const forumCard = document.createElement('div');
            forumCard.className = 'widget-card promoted-card';
            forumCard.style.cursor = 'pointer';
            forumCard.style.backgroundImage = "url('../assets/dummy_picture.jpeg')";
            forumCard.onclick = () => window.location.href = `Mainpage.html?forum=${encodeURIComponent(forum.forum_title)}`;
            forumCard.innerHTML = `<span>📁 ${forum.forum_title}</span>`;
            widgetList.prepend(forumCard);
        });
    }

    const watchlistContainer = document.querySelector('.watchlist-cards');
    if (watchlistContainer && customForums.length > 0) {
        watchlistContainer.innerHTML = '';
        customForums.forEach(forum => {
            const watchCard = document.createElement('div');
            watchCard.className = 'card';
            watchCard.style.cursor = 'pointer';
            watchCard.style.backgroundColor = '#e0f7fa';
            watchCard.style.border = '2px dashed #00796b';
            watchCard.style.borderRadius = '12px';
            watchCard.style.display = 'flex';
            watchCard.style.flexDirection = 'column';
            watchCard.style.justifyContent = 'center';
            watchCard.style.alignItems = 'center';
            watchCard.style.textAlign = 'center';
            watchCard.style.padding = '10px';
            watchCard.style.color = '#00796b';
            watchCard.style.fontWeight = 'bold';
            watchCard.style.transition = 'transform 0.2s, background-color 0.2s';

            watchCard.onmouseover = () => {
                watchCard.style.transform = 'scale(1.05)';
                watchCard.style.backgroundColor = '#b2ebf2';
            };
            watchCard.onmouseout = () => {
                watchCard.style.transform = 'scale(1)';
                watchCard.style.backgroundColor = '#e0f7fa';
            };

            watchCard.innerHTML = `<span style="font-size: 24px;">📁</span><span>${forum.forum_title}</span>`;
            watchCard.onclick = () => window.location.href = `Mainpage.html?forum=${encodeURIComponent(forum.forum_title)}`;
            watchlistContainer.appendChild(watchCard);
        });
    } else if (watchlistContainer && customForums.length === 0) {
        watchlistContainer.innerHTML = '<p style="color: #888; font-size: 14px; text-align: center; width: 100%;">Aún no tienes foros en tu Watchlist.</p>';
    }
});

window.toggleAddMenu = function(btn) {
    const menu = btn.nextElementSibling;
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
};

window.loadMainpageAvatars = async function() {
    const currentUserId = localStorage.getItem('loggedUserId') || 1;
    try {
        const response = await fetch('../assets/users.json');
        const defaultUsers = await response.json();
        const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers')) || [];
        const allUsers = [...defaultUsers, ...localUsers];

        const currentUser = allUsers.find(u => u.user_id == currentUserId);
        if (currentUser && currentUser.Profile_picture) {
            const fotoPath = currentUser.Profile_picture.includes('/') ? currentUser.Profile_picture : `../assets/${currentUser.Profile_picture}`;
            const imgCentro = document.getElementById('profile-picture-small');
            if (imgCentro) imgCentro.src = fotoPath;

            const avatarBuscador = document.getElementById('search-avatar');
            if (avatarBuscador) {
                avatarBuscador.style.backgroundImage = `url('${fotoPath}')`;
            }
        }

        const widgetCards = document.querySelectorAll('.widget-card');
        widgetCards.forEach((card) => {
            const onclickText = card.getAttribute('onclick');
            if (onclickText) {
                const idMatch = onclickText.match(/id=(\d+)/);
                if (idMatch && idMatch[1]) {
                    const targetUser = allUsers.find(u => u.user_id == idMatch[1]);
                    if (targetUser && targetUser.Profile_picture) {
                        const fotoPath = targetUser.Profile_picture.includes('/') ? targetUser.Profile_picture : `../assets/${targetUser.Profile_picture}`;
                        card.style.backgroundImage = `url('${fotoPath}')`;
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error cargando avatares:", error);
    }
};

window.togglePostMenu = function(btn) {
    const menu = btn.nextElementSibling;

    document.querySelectorAll('.post-popup-menu').forEach(m => {
        if (m !== menu) m.style.display = 'none';
    });

    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
};

document.addEventListener('click', function(event) {

    if (!event.target.closest('#post_options') && !event.target.closest('.post-popup-menu')) {
        document.querySelectorAll('.post-popup-menu').forEach(m => m.style.display = 'none');
    }

    if (event.target.classList.contains('like-btn')) {
        const footer = event.target.closest('#post-footer');
        const amountDiv = footer.querySelector('#like-amount');
        const dislikeBtn = footer.querySelector('.dislike-btn');
        let currentLikes = parseInt(amountDiv.innerText) || 0;

        if (!event.target.classList.contains('active')) {
            if (dislikeBtn.classList.contains('active')) {
                dislikeBtn.classList.remove('active');
                dislikeBtn.style.opacity = '1';
                currentLikes += 1;
            }

            amountDiv.innerText = currentLikes + 1;
            event.target.classList.add('active');
            event.target.style.transform = 'scale(1.3)';
        } else {
            amountDiv.innerText = currentLikes - 1;
            event.target.classList.remove('active');
            event.target.style.transform = 'scale(1)';
        }
    }

    if (event.target.classList.contains('dislike-btn')) {
        const footer = event.target.closest('#post-footer');
        const amountDiv = footer.querySelector('#like-amount');
        const likeBtn = footer.querySelector('.like-btn');
        let currentLikes = parseInt(amountDiv.innerText) || 0;

        if (!event.target.classList.contains('active')) {
            if (likeBtn.classList.contains('active')) {
                likeBtn.classList.remove('active');
                likeBtn.style.transform = 'scale(1)';
                currentLikes -= 1;
            }

            amountDiv.innerText = currentLikes - 1;
            event.target.classList.add('active');
            event.target.style.opacity = '0.4';
        } else {
            amountDiv.innerText = currentLikes + 1;
            event.target.classList.remove('active');
            event.target.style.opacity = '1';
        }
    }

    if (event.target.classList.contains('add-to-fav-btn')) {
        const btn = event.target;
        const postCard = btn.closest('#post-body');
        const postId = postCard.dataset.postId;

        const currentUserId = localStorage.getItem('loggedUserId') || 1;
        let allFavorites = JSON.parse(localStorage.getItem('myUserFavorites')) || {};

        if (!allFavorites[currentUserId]) {
            allFavorites[currentUserId] = [];
        }

        const isFavorited = btn.dataset.favorited === "true";

        if (isFavorited) {
            allFavorites[currentUserId] = allFavorites[currentUserId].filter(fav => fav.post_id !== postId);
            localStorage.setItem('myUserFavorites', JSON.stringify(allFavorites));

            btn.innerHTML = "⭐ Añadir a Favoritos";
            btn.dataset.favorited = "false";
            alert('❌ Post eliminado de tus Favoritos');

        } else {
            const description = postCard.querySelector('#post-description').innerText;
            const authorName = postCard.querySelector('#profile-name').innerText;
            const authorImg = postCard.querySelector('#profile-photo').src;
            const likes = postCard.querySelector('#like-amount').innerText;

            const filesArray = [];
            const filesDiv = postCard.querySelector('#files');
            if (filesDiv) {
                filesDiv.querySelectorAll('.embedded-file').forEach(fileLink => {
                    filesArray.push({ fileName: fileLink.innerText, fileSrc: fileLink.href });
                });
            }

            const favoritePost = {
                post_id: postId,
                Description: description,
                author_name: authorName,
                author_img: authorImg,
                Likes: likes,
                files: filesArray
            };

            allFavorites[currentUserId].push(favoritePost);
            localStorage.setItem('myUserFavorites', JSON.stringify(allFavorites));

            btn.innerHTML = "❌ Quitar de Favoritos";
            btn.dataset.favorited = "true";
            alert('⭐ Post guardado en tus Favoritos');
        }

        btn.closest('.post-popup-menu').style.display = 'none';
    }
});