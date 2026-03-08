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