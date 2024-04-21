document.addEventListener('DOMContentLoaded', async function() {
    const followersList = document.getElementById('followers-list');

    const currentUrl = window.location.href.split('=');
    const userToLoad = await getUserByName(currentUrl[1]);

    try {
        const user = userToLoad; // Función para obtener los datos del usuario
        const followers = user.followers;

        if (followers.length === 0){
            const userContainer = document.createElement("div");
            userContainer.classList.add("UserNotfoundContainer");
            userContainer.textContent = "No followers found";
            followersList.appendChild(userContainer); 
        } else {
            followers.forEach(result => {
                const userContainer = document.createElement("div");
                    userContainer.classList.add("userContainer");
                
                    //Imagen de perfil
                    const profileImage = document.createElement("img");
                    profileImage.src = result.imageUrl; 
                    profileImage.alt = "Profile Image";
                    profileImage.classList.add("users-found-profile-image");
                    userContainer.appendChild(profileImage);
                    
                    //Numero de usuarios
                    var userListFollowers = result.followers;
                    var usernameFollowersNumber = userListFollowers.length;
                    const usernameFollowersInfo = document.createElement("div");
                    usernameFollowersInfo.textContent = usernameFollowersNumber + " Followers";
                    if (usernameFollowersNumber === 1){
                        usernameFollowersInfo.textContent = usernameFollowersNumber + " Follower";
                    }

                    usernameFollowersInfo.textContent = usernameFollowersNumber;
                    usernameFollowersInfo.className = "usernameFollowersInfo";
                    

                    //Quizzes del usuario
                    var quizzByUser = await getUserQuizzes(result.username);
                    var usernameQuizzezNumber = 0;

                    if (quizzByUser=== null){
                        usernameQuizzezNumber = 0;
                    } else {
                        let quizzOfUser = Object.keys(quizzByUser);
                        usernameQuizzezNumber = quizzOfUser.length;
                    }

                    const usernameQuizzezInfo = document.createElement("div");
                    const QuizzesPlayedText = document.createElement("div");
                    usernameQuizzezInfo.className = "usernameQuizzezInfo";
                    QuizzesPlayedText.className = "QuizzesPlayedText";
                    usernameQuizzezInfo.textContent = usernameQuizzezNumber;
                    QuizzesPlayedText.textContent = "Quizzes";
                    
                    if (usernameQuizzezNumber === 1){
                        QuizzesPlayedText.textContent = "Quizz";
                    }
                    usernameFollowersInfo.textContent = usernameFollowersNumber;

                    //Nombre de usuario
                    const usernameInfo = document.createElement("div");
                    usernameInfo.textContent = result.username;
                    usernameInfo.className = "usernameInfo";

                    userContainer.appendChild(usernameInfo);
                    userContainer.appendChild(usernameFollowersInfo);
                    userContainer.appendChild(usernameQuizzezInfo);
                    userContainer.appendChild(QuizzesPlayedText);

                    userContainer.classList.add("userContainer");
                    userContainer.addEventListener('click', async function() {
                    window.location.href = "../login/player-profile.html?id=" + result.username;
                    });
                    followersList.appendChild(userContainer); 
                });
            } 
    }catch (error) {
        console.error('Error fetching followers:', error);
    }
});

