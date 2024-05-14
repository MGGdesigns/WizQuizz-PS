import {
    getInfoLobby,
    addUserIntoLobby,
    updateNumOfUsers,
    getCurrentQuestion,
    lobbyRef
} from "../common/backend-functions.js";
import { firestore } from "../common/backend-functions.js";
import {onValue} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

    sessionStorage.setItem("onlinePlayer", "Yes");
    let question = 0;
    setInterval(checkCurrentQuestion, 1000);
    async function checkCurrentQuestion() {
        getCurrentQuestion().then(async data => {
            question = data.val();
            if (question === 1) {
                getInfoLobby(1).then(data => {
                    let quizzId = data.quizzId
                    window.location.href = `in-game.html?id=online`;
                })
            }
        });
    }

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

document.getElementById("nextBox").style.display = "none";
window.addEventListener('DOMContentLoaded', async function(){
    const gameCode = await getInfoLobby(1);
    const gameTitle = await getInfoLobby(1);
    let num = await getInfoLobby(1);
    let finalNum = num.numOfUsers;
    this.document.getElementById("title").innerHTML = gameTitle.quizzTitle;
    this.document.getElementById("code").innerHTML = gameCode.code;

    this.document.getElementById("confirm-user-button").addEventListener('click', async function(){
        //Añadimos el user a players
        let countRepetition = 0;
        const userName = document.getElementById("waiting-tab-input").value;
        if (finalNum === 0) {
            document.getElementById("nextBox").style.display = "block";
            document.getElementById("prevBox").style.display = "none";
            var listPlayersDiv = document.getElementById("listPlayers");
            var newParagraph = document.createElement("p");
            newParagraph.textContent = userName;
            listPlayersDiv.appendChild(newParagraph);

            onValue(lobbyRef, (snapshot) => {
                const lobbyData = snapshot.val();

                if (lobbyData && lobbyData.users) {
                    const users = lobbyData.users;
                    console.log(users);

                    // Limpiar el contenedor de usuarios antes de agregar los nuevos
                    var listPlayersDiv = document.getElementById("listPlayers");
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

            sessionStorage.setItem("onlineNick", userName);
            await addUserIntoLobby(userName, finalNum);
            sessionStorage.setItem("onlineId", finalNum);
            finalNum++;
            await updateNumOfUsers(finalNum);
        } else {
            getInfoLobby(1).then(async data => {
                data.users.forEach(user => {
                    if (user.userName === userName) {
                        countRepetition++;
                        console.log(countRepetition);
                    }
                })
                if (countRepetition === 0) {
                    document.getElementById("nextBox").style.display = "block";
                    document.getElementById("prevBox").style.display = "none";
                    var listPlayersDiv = document.getElementById("listPlayers");
                    var newParagraph = document.createElement("p");
                    newParagraph.textContent = userName;
                    listPlayersDiv.appendChild(newParagraph);

                    onValue(lobbyRef, (snapshot) => {
                        const lobbyData = snapshot.val();

                        if (lobbyData && lobbyData.users) {
                            const users = lobbyData.users;
                            console.log(users);

                            // Limpiar el contenedor de usuarios antes de agregar los nuevos
                            var listPlayersDiv = document.getElementById("listPlayers");
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

                    sessionStorage.setItem("onlineNick", userName);
                    await addUserIntoLobby(userName, finalNum);
                    sessionStorage.setItem("onlineId", finalNum);
                    finalNum++;
                    await updateNumOfUsers(finalNum);
                } else {
                    alert("Username already taken!");
                }
            })
        }
    });
});