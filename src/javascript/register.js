

function handleRegister(event) {
    event.preventDefault();
    const email = document.querySelector('input[name="email"]').value.trim();
    const name = document.querySelector('input[name="name"]').value.trim();
    const surname = document.querySelector('input[name="surname"]').value.trim();
    const username = document.querySelector('input[name="username"]').value.trim();
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat_password').value;
    const userExists = localUsers.find(u => u.username === username);

    if (password !== repeatPassword) {
        alert("Las contraseñas no coinciden. Revisa los datos.");
        return;
    }

    let localUsers = JSON.parse(localStorage.getItem('myRegisteredUsers')) || [];

    if (userExists) {
        alert("Ese nombre de usuario ya está en uso. Por favor, elige otro.");
        return;
    }

    const newUser = {
        user_id: Date.now(),
        username: username,
        password: password,
        email: email,
        Name: name,
        Surname: surname,
        Followers: "0",
        Following: "0",
        Viewers: "0",
        Biography: "¡Hola! Acabo de unirme a StudyHub.",
        Profile_picture: "../assets/dummy_picture.jpeg",
        Student_person: "../assets/persona-estudiando.png",
        Favorite_posts: [],
        Notifications: []
    };

    localUsers.push(newUser);
    localStorage.setItem('myRegisteredUsers', JSON.stringify(localUsers));

    alert("¡Cuenta creada con éxito! Ya puedes iniciar sesión.");

    window.location.href = 'Login.html';
}