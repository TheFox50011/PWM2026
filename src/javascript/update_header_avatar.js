// Archivo: src/javascript/load_header_user.js

async function updateHeaderAvatar() {
    try {
        const response = await fetch('../assets/users.json');
        const users = await response.json();
        const user = users.find(u => u.id == 1 || u.user_id == 1);

        if (!user) return;


        const checkExist = setInterval(() => {
            const avatarDiv = document.querySelector('.popup-avatar');
            const nameSpan = document.querySelector('.popup-user-profile span');

            if (avatarDiv) {

                if (user["Profile picture"]) {
                    avatarDiv.style.backgroundImage = `url('../assets/${user["Profile picture"]}')`;
                    avatarDiv.style.backgroundSize = 'cover';
                    avatarDiv.style.backgroundPosition = 'center';
                }


                if (nameSpan && user.username) {
                    nameSpan.textContent = user.username;
                }


                clearInterval(checkExist);
            }
        }, 100);


        setTimeout(() => clearInterval(checkExist), 5000);

    } catch (error) {
        console.error("Error al cargar los datos del usuario para el header:", error);
    }
}


document.addEventListener("DOMContentLoaded", updateHeaderAvatar);