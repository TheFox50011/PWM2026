async function insert_notification_data(userId) {
    let usersJson = await fetch("../assets/users.json")
    let users = await usersJson.json()

    let user =users.find(user => user.user_id === userId);

    let forumsJson = await fetch("../assets/forums.json")
    let forums = await forumsJson.json()

    let userPosts = forums.map(forum => forum.posts).flat(1).filter(post => post.author_id === userId)

    let userLikes = userPosts.map(post => parseInt(post.Likes)).reduce((a, b) => a+b,0)

    dayStreakDiv = document.createElement("div");
    dayStreakDiv.setAttribute("class", "statNumber");
    dayStreakDiv.innerHTML = user.Streak_days;

    document.querySelector("div[id=day-streak]").appendChild(dayStreakDiv);

    likesDiv = document.createElement("div");
    likesDiv.setAttribute("class", "statNumber");
    likesDiv.innerHTML = userLikes;

    document.querySelector("div[id=likes]").appendChild(likesDiv);

    viewersDiv = document.createElement("div");
    viewersDiv.setAttribute("class", "statNumber");
    viewersDiv.innerHTML = user.Viewers;

    document.querySelector("div[id=viewers]").appendChild(viewersDiv);

}