document.addEventListener("DOMContentLoaded", () => {


    const searchInput = document.querySelector('.search-bar input');

    if (searchInput) {

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();


            const posts = document.querySelectorAll('#post-body');
            posts.forEach(post => {
                const text = post.innerText.toLowerCase();
                if (text.includes(term)) {
                    post.style.display = '';
                } else {
                    post.style.display = 'none';
                }
            });


            const users = document.querySelectorAll('.widget-card');
            users.forEach(user => {
                const text = user.innerText.toLowerCase();
                if (text.includes(term)) {
                    user.style.display = '';
                } else {
                    user.style.display = 'none';
                }
            });
        });
    }

    const addBtn = document.querySelector('.status-input .add-btn');
    const statusInput = document.querySelector('.status-input input');

    if (addBtn && statusInput) {
        addBtn.addEventListener('click', () => {
            const text = statusInput.value.trim();
            if (!text) return alert("Por favor, escribe algo antes de publicar.");


            const currentUserId = localStorage.getItem('loggedUserId') || 1;


            const newPost = {
                post_id: "custom_" + Date.now(),
                author_id: parseInt(currentUserId),
                Description: text,
                Likes: 0,
                files: []
            };
            let customPosts = JSON.parse(localStorage.getItem('myCustomPosts')) || [];
            customPosts.push(newPost);
            localStorage.setItem('myCustomPosts', JSON.stringify(customPosts));
            statusInput.value = '';
            window.location.reload();
        });
    }
});