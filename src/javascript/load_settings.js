async function load_settings(userId) {
    fetch(`../assets/users.json`)
        .then((res) => res.json())
        .then((data)=>{
            data.forEach((user) => {
                if (user.user_id == userId) {
                    document.getElementById('username').value = user.username;
                    document.getElementById('email').value = user.email;
                    document.getElementById('nightmode').checked = user.Night_mode;
                    document.getElementById('fontsize').value = user.Font_Size;
                }
            })
        });
}

function saveSettingsChanges(event) {
    event.preventDefault();

    const currentUserId = localStorage.getItem('loggedUserId') || 1;


    const newUsername = document.querySelector('input[name="username"]').value;
    const newEmail = document.getElementById('email').value;
    const newNightMode = document.getElementById('nightmode').checked;
    const newFontSize = document.getElementById('fontsize').value;


    localStorage.setItem('nightModeActive', newNightMode);
    localStorage.setItem('globalFontSize', newFontSize);


    const updatedData = {
        username: newUsername,
        email: newEmail,
        Night_mode: newNightMode,
        Font_Size: newFontSize
    };

    let allChanges = JSON.parse(localStorage.getItem('allUserProfileChanges')) || {};
    allChanges[currentUserId] = { ...(allChanges[currentUserId] || {}), ...updatedData };
    localStorage.setItem('allUserProfileChanges', JSON.stringify(allChanges));


    document.documentElement.style.fontSize = newFontSize + 'px';
    document.body.style.fontSize = newFontSize + 'px';

    if (newNightMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    alert("¡Ajustes guardados correctamente!");
}