let newProfilePictureBase64 = null;

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const avatarImg = document.getElementById('avatar');

    if (fileInput && avatarImg) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    newProfilePictureBase64 = e.target.result;
                    avatarImg.src = newProfilePictureBase64;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

function saveProfileChanges(event) {
    event.preventDefault();

    const newName = document.querySelector('input[name="name"]').value;
    const newBio = document.querySelector('textarea[name="biography"]').value;
    const newEmail = document.querySelector('input[name="email"]').value;
    const newLink = document.querySelector('input[name="url"]').value;
    const currentUserId = localStorage.getItem('loggedUserId') || 1;

    const updatedUser = {
        username: newName,
        Biography: newBio,
        email: newEmail,
        link_1: newLink
    };

    if (newProfilePictureBase64) {
        updatedUser.Profile_picture = newProfilePictureBase64;
    }

    let allChanges = JSON.parse(localStorage.getItem('allUserProfileChanges')) || {};
    allChanges[currentUserId] = { ...(allChanges[currentUserId] || {}), ...updatedUser };

    try {
        localStorage.setItem('allUserProfileChanges', JSON.stringify(allChanges));
        window.location.href = `Profile.html?id=${currentUserId}`;
    } catch (e) {
        alert("Error: La imagen pesa demasiado. Por favor, elige una foto más pequeña.");
    }
}

function checkPasswordMatch() {
    let repeat_password = document.querySelector('input[id="repeat_password"]');
    let password = document.querySelector('input[id="password"]');

    if (repeat_password && password) {
        if (repeat_password.value !== password.value) {
            repeat_password.setCustomValidity('Passwords must match');
        } else {
            repeat_password.setCustomValidity('');
        }
    }
}