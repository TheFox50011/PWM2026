async function load_profile_to_edit(user_id) {
    fetch(`../assets/users.json`)
        .then((res) => res.json())
        .then((data)=>{
            data.forEach((user) => {
                if (user.user_id == user_id) {
                    document.querySelector('input[name="name"]').value = user.username;
                    document.querySelector('textarea[name="biography"]').value = user.Biography;
                    document.querySelector('input[name="location"]').value = user.Location;
                    document.querySelector('input[name="email"]').value = user.email;
                    document.querySelector('input[name="url"]').value = user.link_1;
                    document.querySelector('div[class="avatar-circle"]').innerHTML = "<img src=user.Profile_picture/>"
                }
            })
        });
}