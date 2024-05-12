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
    const quizz = await getInfoLobby(idQuizz)
    console.log(quizz.users);
/*
    var quizzName = document.getElementById("quizz-name");
    quizzName.textContent = quizz.quizzTitle;
    quizzName.classList.add("quizz-name");
    */
    const winnersContainer = document.getElementById("winners-container");

    if (winnersContainer) {
        winnersContainer.innerHTML = "";

        const sortedUsers = quizz.users.sort((a, b) => b.score - a.score);

        // Tomar solo los tres primeros usuarios (los tres con la puntuación más alta)
        const topThreeUsers = sortedUsers.slice(0, 3);
        var i = 1;


        topThreeUsers.forEach(user => {
        
            const userContainer = document.createElement("div");
            userContainer.classList.add("user-container");

            

            // Crear elementos para mostrar el nombre y la puntuación del usuario
            const userNameElement = document.createElement("div");
            userNameElement.classList.add("username");
            userNameElement.textContent = user.userName;
            userContainer.appendChild(userNameElement);

            const winnersInfo = document.createElement("div");
            winnersInfo.classList.add("winners-info");

            // Crear elemento de imagen para la foto del usuario
            const userImage = document.createElement("img");

            if (i===1){
                userImage.src = '../../website-images/top/first-place.png'; // Suponiendo que "photoUrl" es la URL de la foto del usuario
            } else if (i===2){
                userImage.src = '../../website-images/top/second-place.png'; // Suponiendo que "photoUrl" es la URL de la foto del usuario
            } else {
                userImage.src = '../../website-images/top/third-place.png'; // Suponiendo que "photoUrl" es la URL de la foto del usuario
            }
            i += 1;
            userImage.alt = user.userName; // Añade un atributo "alt" con el nombre del usuario para accesibilidad
            winnersInfo.appendChild(userImage);

            const scoreElement = document.createElement("div");
            scoreElement.classList.add("score");
            scoreElement.textContent = "Score: " + user.score;
            winnersInfo.appendChild(scoreElement);
            userContainer.appendChild(winnersInfo);
            

            winnersContainer.appendChild(userContainer);

        });
    } else {
        console.error("Elemento #winnersContainer no encontrado");
    }
});
