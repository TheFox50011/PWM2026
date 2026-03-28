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
            document.querySelector('.add-popup-menu').style.display = 'none'; // Cierra el menú al elegir
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
            let filesArray = [];

            if (attachedFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    filesArray.push({
                        fileName: attachedFile.name,
                        fileSrc: e.target.result
                    });
                    saveAndReloadPost(text, currentUserId, filesArray);
                };
                reader.readAsDataURL(attachedFile);
            } else {
                saveAndReloadPost(text, currentUserId, filesArray);
            }
        });
    }

    function saveAndReloadPost(text, currentUserId, filesArray) {
        const newPost = {
            post_id: "custom_" + Date.now(),
            author_id: parseInt(currentUserId),
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
            alert("Error: El archivo pesa demasiado.");
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

});


window.toggleAddMenu = function(btn) {
    const menu = btn.nextElementSibling;
    if (menu.style.display === 'none' || menu.style.display === '') {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
};


async function loadMainpageAvatars() {
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
}
loadMainpageAvatars();