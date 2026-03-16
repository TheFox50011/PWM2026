function saveProfileChanges(event) {
    event.preventDefault();



    const newName = document.querySelector('input[name="name"]').value;
    const newBio = document.querySelector('textarea[name="biography"]').value;
    const newEmail = document.querySelector('input[name="email"]').value;
    const newLink = document.querySelector('input[name="url"]').value;

    const updatedUser = {
        username: newName,
        Biography: newBio,
        email: newEmail,
        link_1: newLink
    };


    localStorage.setItem('userProfileChanges', JSON.stringify(updatedUser));


    window.location.href = 'Profile.html';
}

function checkPasswordMatch() {
    let repeat_password = document.querySelector('input[id="repeat_password"]');

    if (repeat_password.value !== document.querySelector('input[id="password"]').value) {
        repeat_password.setCustomValidity('Passwords must match');
    } else {
        repeat_password.setCustomValidity('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.querySelector('.btn-save');
    let repeat_password = document.querySelector('input[name="repeat_password"]');
    if (saveBtn) {
        saveBtn.removeAttribute('onclick');
        saveBtn.addEventListener('click', saveProfileChanges);
    }
});