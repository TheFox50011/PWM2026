async function saveForum() {
    let forumTitle = document.querySelector(".input-title").value;
    let forumDescription = document.querySelector(".input-description").value;
    let forum = {
        "forum_title": forumTitle,
        "forum description": forumDescription,
        "posts": []
    };

    let localStorageForums = localStorage.getItem("savedForums") || '[]';

    let savedForums = JSON.parse(localStorageForums) || [];

    savedForums.push(forum);

    localStorage.setItem("savedForums", JSON.stringify(savedForums));
}