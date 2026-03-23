
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const nightModeCheckbox = document.getElementById('nightmode'); 

    if (localStorage.getItem('nightModeActive') === 'true') {
        body.classList.add('dark-mode');
        if (nightModeCheckbox) {
            nightModeCheckbox.checked = true;
        }
    }


    if (nightModeCheckbox) {
        nightModeCheckbox.addEventListener('change', () => {
            if (nightModeCheckbox.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('nightModeActive', 'true');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('nightModeActive', 'false');
            }
        });
    }
});