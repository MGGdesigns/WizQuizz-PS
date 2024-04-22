import { getUser, getUserQuizzes } from "../common/backend-functions.js";

document.addEventListener('DOMContentLoaded', async function() {
    const userToLoadMail = sessionStorage.getItem("userMail")
    const userToLoad = getUser(userToLoadMail)
    var followers = []
    const foundUsers = userToLoad.following
    console.log(foundUsers)
    if (foundUsers){
       for (const result of foundUsers) {
        let followedUser=await getUser(result)
        followers.push(followedUser)
    }; 
    }
    

    

    const resultsFoundContainer = document.querySelector(".followers-search-info")
    if (userToLoad){
            
//Si el usuario no existe
if (followers.length===0 ) {
    console.log(followers)
    const userContainer = document.createElement("div");
        userContainer.classList.add("UserNotfoundContainer");
        userContainer.textContent = "User not found";
        resultsContainer.appendChild(userContainer); 
        

//Preview de usuarios encontrados
} else {
    
    console.log(followers)
    for (let result of followers){
        console.log("result")
       
        const userContainer = document.createElement("div");
        
        
                    userContainer.classList.add("userContainer");
                    console.log(result)
                    //Imagen de perfil
                    const profileImage = document.createElement("img");
                    profileImage.src = result.imageUrl; 
                    profileImage.alt = "Profile Image";
                    profileImage.classList.add("users-found-profile-image");
                    userContainer.appendChild(profileImage);
                    
                    //Numero de usuarios
                    const usernameFollowersInfo = document.createElement("div");
                    var usernameFollowersNumber = foundUsers.length;
                    var userListFollowers = result.followers;
                    
                    
                    
                    if (userListFollowers === '0' || !result.followers){
                        usernameFollowersNumber = 0 + " Followers";
                    }
                    
                    usernameFollowersInfo.textContent = usernameFollowersNumber + " Followers";
                    if (usernameFollowersNumber === 1){
                        usernameFollowersInfo.textContent = usernameFollowersNumber + " Follower";
                    }

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
                    
                    //Añadimos los elementos
                    userContainer.appendChild(usernameInfo);
                userContainer.appendChild(usernameQuizzezInfo);
                    userContainer.appendChild(QuizzesPlayedText);

                    userContainer.classList.add("userContainer");

                    //Al hacer click vamos al player profile del usuario seleccionado
                    userContainer.addEventListener('click', async function() {
                        window.location.href = "../login/player-profile.html?id=" + result.username;
                    });
                    resultsFoundContainer.appendChild(userContainer); 

}
}
}
})
