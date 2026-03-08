async function loadUserProfile(userId) {
    try {
        const response = await fetch('../assets/users.json');
        const users = await response.json();


        const user = users.find(u => u.user_id === userId);

        if (user) {
            console.log("Datos del usuario cargados:", user.username);

            if(document.getElementById('profile-name')) {
                document.getElementById('profile-name').textContent = user.username;
            }
            if(document.getElementById('profile-email')) {
                document.getElementById('profile-email').textContent = user.email;
            }
            if(document.getElementById('profile-followers')) {
                document.getElementById('profile-followers').textContent = user.Followers;
            }
            if(document.getElementById('profile-following')) {
                document.getElementById('profile-following').textContent = user.Following;
            }
            if(document.getElementById('profile-bio')) {
                document.getElementById('profile-bio').textContent = user.Biography;
            }


            if(document.getElementById('profile-picture') && user["Profile picture"]) {

                document.getElementById('profile-picture').src = `../assets/${user["Profile picture"]}`;
            }
        } else {
            console.warn("Usuario no encontrado.");
        }
    } catch (error) {
        console.error("Error al obtener users.json:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadUserProfile(1);
});