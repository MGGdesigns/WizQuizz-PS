import {
    addUserIntoLobby,
    createLobby,
    getCurrentQuestion,
    getInfoLobby,
    lobbyRef,
    nextQuestion,
    onValue
} from "../common/backend-functions.js";
const currentUrl = window.location.href.split('=');

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

document.addEventListener('DOMContentLoaded', async function() {
    const nameofQuizz = sessionStorage.getItem("nameofQuizz");
    const quizzId = sessionStorage.getItem("onlineQuizzId");

    const numOfUsers = 0;

    document.getElementById("title").innerHTML = nameofQuizz;
    const gameCode = Math.floor(1000 + Math.random() * 9000);
    await createLobby(gameCode, nameofQuizz, quizzId, numOfUsers);
    await addUserIntoLobby("Admin", 0);
    console.log("user added");


    document.getElementById("code").innerHTML = gameCode.toString();

    let userName;
    onValue(lobbyRef, (snapshot) => {
        const lobbyData = snapshot.val();
        
        if (lobbyData && lobbyData.users) {
            const users = lobbyData.users;
            console.log(users);
    
            // Limpiar el contenedor de usuarios antes de agregar los nuevos
            var listPlayersDiv = document.getElementById("allPlayers");
            listPlayersDiv.innerHTML = ''; // Esto borra todos los elementos hijos del contenedor
    
            for (const userId in users) {
                if (Object.hasOwnProperty.call(users, userId)) {
                    const userName = users[userId].userName;
    
                    var newParagraph = document.createElement("p");
                    newParagraph.classList.add("hidden");
                    newParagraph.textContent = userName;
                    listPlayersDiv.appendChild(newParagraph);
                }
            }
        }
        const hiddenElements = document.querySelectorAll('.hidden');
        hiddenElements.forEach((el) => observer.observe(el));
    });

    document.getElementById("startGame").addEventListener('click', async function(){
        sessionStorage.setItem("onlineHost", "Yes");
        sessionStorage.setItem("onlineNick", "Admin");
        await nextQuestion();
        window.location.href = `in-game.html?id=${quizzId}`;
    });
});