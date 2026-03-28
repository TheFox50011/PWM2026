async function loadUserProfile(passedId) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        const loggedId = localStorage.getItem('loggedUserId');
        const userId = urlId || passedId || loggedId || 1;
        const response = await fetch('../assets/users.json');
        const defaultUsers = await response.json();
        const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers')) || [];
        const allUsers = [...defaultUsers, ...localUsers];

        const linksContainer = document.getElementById('profile-links');
        let user = allUsers.find(u => u.user_id == userId);

        if (linksContainer) {
            linksContainer.innerHTML = '';
            for (const key in user) {
                if (key.startsWith('link_') && user[key]) {
                    const linkElement = document.createElement('a');
                    linkElement.href = user[key];
                    linkElement.className = 'link-item';
                    linkElement.target = '_blank';
                    try {
                        const domain = new URL(user[key]).hostname.replace('www.', '');
                        linkElement.textContent = domain;
                    } catch (e) {
                        linkElement.textContent = "Visitar enlace";
                    }
                    linksContainer.appendChild(linkElement);
                }
            }
        }

        if (user) {
            const savedChanges = localStorage.getItem('userProfileChanges');
            const searchAvatar = document.getElementById('search-avatar');
            if (savedChanges) {
                const parsedChanges = JSON.parse(savedChanges);
                user = { ...user, ...parsedChanges };
            }

            if(document.getElementById('profile-name')) document.getElementById('profile-name').textContent = user.username;
            if(document.getElementById('profile-email')) document.getElementById('profile-email').textContent = user.email;
            if(document.getElementById('profile-followers')) document.getElementById('profile-followers').textContent = user.Followers;
            if(document.getElementById('profile-following')) document.getElementById('profile-following').textContent = user.Following;
            if(document.getElementById('profile-bio')) document.getElementById('profile-bio').textContent = user.Biography;


            if (user.Profile_picture) {
                const fotoPath = user.Profile_picture.includes('/') ? user.Profile_picture : `../assets/${user.Profile_picture}`;
                if(document.getElementById('profile-picture')) document.getElementById('profile-picture').src = fotoPath;
                if(document.getElementById('profile-picture-small')) document.getElementById('profile-picture-small').src = fotoPath;
            }


            if (user.Student_person) {
                if(document.getElementById('study-person')) document.getElementById('study-person').src = user.Student_person;
                if(document.getElementById('study-person1')) document.getElementById('study-person1').src = user.Student_person;
                if(document.getElementById('study-person2')) document.getElementById('study-person2').src = user.Student_person;
            }

            const editProfileBtn = document.getElementById('editprofile');
            if (editProfileBtn) {
                editProfileBtn.removeAttribute('onclick');
                editProfileBtn.onclick = function() {
                    window.location.href = `EditProfile.html`;
                };
            }

        } else {
            console.warn("Usuario no encontrado.");
        }
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
    }
}