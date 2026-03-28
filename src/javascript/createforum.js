function handleCreateForum(event) {
    event.preventDefault();
    const title = document.querySelector('.input-title').value.trim();
    const desc = document.querySelector('.input-description').value.trim();

    if (!title) {
        alert("Por favor, introduce un título para el foro.");
        return;
    }
    const newForum = {
        forum_title: title,
        "forum description": desc,
        posts: [] // Empieza vacío
    };
    let customForums = JSON.parse(localStorage.getItem('myCustomForums')) || [];
    if (customForums.find(f => f.forum_title.toLowerCase() === title.toLowerCase())) {
        alert("Ya existe un foro con este nombre. Elige otro.");
        return;
    }

    customForums.push(newForum);
    localStorage.setItem('myCustomForums', JSON.stringify(customForums));

    alert(`¡El foro "${title}" se ha creado con éxito!`);
    window.location.href = `Mainpage.html?forum=${encodeURIComponent(title)}`;
}