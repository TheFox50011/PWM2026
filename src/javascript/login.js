async function handleLogin(event) {
    event.preventDefault();

    const userVal = document.getElementById('login-username').value.trim();
    const passVal = document.getElementById('login-password').value;

    if (!userVal || !passVal) {
        return alert("Por favor, introduce tu usuario y contraseña.");
    }

    try {

        const response = await fetch('../assets/users.json');
        const defaultUsers = await response.json();
        const localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers')) || [];
        const allUsers = [...defaultUsers, ...localUsers];

        const validUser = allUsers.find(u => u.username === userVal && u.password === passVal);

        if (validUser) {
            localStorage.setItem('loggedUserId', validUser.user_id);

            window.location.href = 'Mainpage.html';
        } else {
            alert("Usuario o contraseña incorrectos. Inténtalo de nuevo.");
        }
    } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        alert("Hubo un problema al conectar. Revisa tu Live Server.");
    }
}