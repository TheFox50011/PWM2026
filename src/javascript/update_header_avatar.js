async function updateHeaderAvatar() {
    try {
        const currentUserId = localStorage.getItem('loggedUserId');
        const checkExist = setInterval(async () => {
            const avatarDiv = document.querySelector('.popup-avatar');
            const nameSpan = document.querySelector('.popup-user-profile span');
            const navButtons = document.querySelectorAll('.popup-nav button');
            const logoutBtn = document.querySelector('.logout-btn');

            if (avatarDiv && navButtons.length > 0) {
                clearInterval(checkExist);

                if (!currentUserId) {
                    if (nameSpan) nameSpan.textContent = "Invitado";


                    navButtons.forEach(btn => {
                        btn.removeAttribute('onclick');
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            window.location.href = 'Login.html';
                        });
                    });

                    if (logoutBtn) {
                        logoutBtn.removeAttribute('onclick');
                        logoutBtn.textContent = "Login / Register";
                        logoutBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            window.location.href = 'Login.html';
                        });
                    }

                } else {
                    const response = await fetch('../assets/users.json');
                    const defaultUsers = await response.json();
                    const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers')) || [];
                    const allUsers = [...defaultUsers, ...localUsers];

                    const user = allUsers.find(u => u.user_id == currentUserId);

                    if (user) {

                        if (user.Profile_picture) {
                            avatarDiv.style.backgroundImage = `url('../assets/${user.Profile_picture}')`;
                            avatarDiv.style.backgroundSize = 'cover';
                            avatarDiv.style.backgroundPosition = 'center';
                        }
                        // Ponemos su nombre
                        if (nameSpan && user.username) {
                            nameSpan.textContent = user.username;
                        }
                    }


                    if (logoutBtn) {
                        logoutBtn.removeAttribute('onclick');
                        logoutBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            localStorage.removeItem('loggedUserId');
                            window.location.href = 'index.html';
                        });
                    }
                }
            }
        }, 100);

        setTimeout(() => clearInterval(checkExist), 5000);

    } catch (error) {
        console.error("Error al comprobar la sesión en el header:", error);
    }
}

document.addEventListener("DOMContentLoaded", updateHeaderAvatar);