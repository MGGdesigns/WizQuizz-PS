import {
    getQuizz,
    getAllQuizzes,
    getQuizzField,
    getCurrentQuestion,
    nextQuestion,
    getInfoLobby, addScore
} from "../../js-files/common/backend-functions.js";

const currentUrl = window.location.href.split('=');
const idQuizz = currentUrl[1];

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

window.onload = function() {
    music.play();

    window.addEventListener('focus', function() {
        music.play();
    });

    window.addEventListener('blur', function() {
        music.pause();
    });
    music.loop = true;
    music.volume = 0.4;
    fadeOutAudio(music, 129000);
};

function setCursor(cursor) {
    const allElements = document.querySelectorAll('*');

    if (cursor === 'Default') {
        allElements.forEach(element => {
            element.style.cursor = 'default';
        });
    } else if (cursor === 'Wand') {
        allElements.forEach(element => {
            element.style.cursor = 'url("../../website-images/common/wand-cursor.png"), auto';
        });
    }
}

document.addEventListener('DOMContentLoaded', async function() {
   /* const code = sessionStorage.getItem(actualLobbyCode);
    if (quizz.code != code){
        console.log("Wrong lobby code");
    }*/
    const quizz = await getInfoLobby(idQuizz)

    const mark = document.getElementById("mark");
    const quizzInfo = await getQuizz(idQuizz);
    const actualUserName = sessionStorage.getItem("onlineNick");

    const quizzTotalNumberOfQuestions = quizzInfo.questions.length;
    const sortedUsers = quizz.users.sort((a, b) => b.score - a.score);

    let actualUser;
    let position;

    sortedUsers.forEach(user => {
        if (user.userName === actualUserName){
            actualUser = user;
            position = quizz.users.indexOf(user) + 1;
        } else {
            console.log("User not found");
        }
    });


    mark.textContent = actualUser.score + "/" + quizzTotalNumberOfQuestions;

    const ranking = document.getElementById("ranking-position");
    ranking.textContent = "You are in position: ";
    const rankingNumber = document.getElementById("ranking-number");
    rankingNumber.textContent =position;

    const winnersContainer = document.getElementById("winners-container");

    if (winnersContainer) {
        winnersContainer.innerHTML = "";

        //Cogemos los 3 mejores usuarios y los mostramos
        const topThreeUsers = sortedUsers.slice(0, 3);
        var i = 1;

        topThreeUsers.forEach(user => {
        
            const userContainer = document.createElement("div");
            userContainer.classList.add("user-container");

            const lowUserInfoContainer = document.createElement("div");
            lowUserInfoContainer.classList.add("low-user-info-container");

            //Username
            const userNameElement = document.createElement("div");
            userNameElement.classList.add("username");
            userNameElement.textContent = user.userName;
            userContainer.appendChild(userNameElement);

            const winnersInfo = document.createElement("div");
            winnersInfo.classList.add("winners-info");

            //Imagen en función del puesto final
            const userImage = document.createElement("img");

            if (i===1){
                userImage.src = '../../website-images/top/first-place.png'; 
            } else if (i===2){
                userImage.src = '../../website-images/top/second-place.png'; 
            } else {
                userImage.src = '../../website-images/top/third-place.png'; 
            }
            i += 1;

            userImage.alt = user.userName; 
            winnersInfo.appendChild(userImage);
            lowUserInfoContainer.appendChild(winnersInfo);

            //Puntuación
            const scoreElement = document.createElement("div");
            scoreElement.classList.add("score");
            scoreElement.textContent = "Score: " + user.score;
            winnersInfo.appendChild(scoreElement);
            userContainer.appendChild(lowUserInfoContainer);
            
            winnersContainer.appendChild(userContainer);
        });

    } else {
        console.error("Elemento #winnersContainer no encontrado");
    }
});
