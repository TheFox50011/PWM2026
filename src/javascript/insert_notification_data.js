async function insert_notification_data(userId) {
    let usersJson = await fetch("../assets/users.json")
    let users = await usersJson.json()

    let loggedUser =users.find(user => user.user_id === userId);

    let forumsJson = await fetch("../assets/forums.json")
    let forums = await forumsJson.json()

    let userPosts = forums.map(forum => forum.posts).flat(1).filter(post => post.author_id === userId)

    let userLikes = userPosts.map(post => parseInt(post.Likes)).reduce((a, b) => a+b,0)

    dayStreakDiv = document.createElement("div");
    dayStreakDiv.setAttribute("class", "statNumber");
    dayStreakDiv.innerHTML = loggedUser.Streak_days;

    document.querySelector("div[id=day-streak]").appendChild(dayStreakDiv);

    likesDiv = document.createElement("div");
    likesDiv.setAttribute("class", "statNumber");
    likesDiv.innerHTML = userLikes;

    document.querySelector("div[id=likes]").appendChild(likesDiv);

    viewersDiv = document.createElement("div");
    viewersDiv.setAttribute("class", "statNumber");
    viewersDiv.innerHTML = loggedUser.Viewers;

    document.querySelector("div[id=viewers]").appendChild(viewersDiv);

    for (let notification of loggedUser.Notifications) {
        let notifDiv=document.createElement("div");
        notifDiv.classList.add("noti-card");
        let notifAuthor = users.find(user => user.user_id === notification.user).username
        if (notification.Type === "followRequest") {
            notifDiv.innerHTML = notifAuthor + " has sent you a follow request.";
            let buttons = document.createElement("div")
            buttons.classList.add("btn-group");
            let acceptButton = document.createElement("button");
            acceptButton.classList.add("btn-accept");
            acceptButton.classList.add("btn-action");
            acceptButton.innerHTML = "Accept";
            buttons.appendChild(acceptButton);
            let denyButton = document.createElement("button");
            denyButton.classList.add("btn-deny");
            denyButton.classList.add("btn-action");
            denyButton.innerHTML = "Deny";
            buttons.appendChild(denyButton);
            notifDiv.appendChild(buttons);
        } else if (notification.Type === "like") {
            notifDiv.innerHTML = notifAuthor + " likes your file.";
        } else if (notification.Type === "comment") {
            notifDiv.innerHTML = notifAuthor + " commented on your file.";
        }
        let today=new Date();
        let yesterday=new Date();
        yesterday.setDate(yesterday.getDate()-1);
        let lastMonth=new Date();
        lastMonth.setDate(lastMonth.getDate()-30);
        if (notification.date === today.toJSON().slice(0, 10)) {
            document.querySelector("div[id=today]").appendChild(notifDiv);
        } else if (notification.date === yesterday.toJSON().slice(0, 10)) {
            document.querySelector("div[id=yesterday]").appendChild(notifDiv);
        } else if (new Date(notification.date) >= lastMonth) {
            document.querySelector("div[id=last30Days]").appendChild(notifDiv);
        }
    }
}