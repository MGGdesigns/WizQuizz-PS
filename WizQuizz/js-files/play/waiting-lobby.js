import {getInfoLobby, addUserIntoLobby, updateNumOfUsers, getCurrentQuestion} from "../common/backend-functions.js";
import { firestore } from "../common/backend-functions.js";

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
                    window.location.href = `in-game.html?id=${parseInt(quizzId)}`;
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
        document.getElementById("nextBox").style.display = "block";
        document.getElementById("prevBox").style.display = "none";

        //Añadimos el user a players
        const userName = document.getElementById("waiting-tab-input").value;
        var listPlayersDiv = document.getElementById("listPlayers");
        var newParagraph = document.createElement("p");
        newParagraph.textContent = userName;
        listPlayersDiv.appendChild(newParagraph);

        sessionStorage.setItem("onlineNick", userName);
        await addUserIntoLobby(userName, finalNum);
        finalNum++;
        await updateNumOfUsers(finalNum);
    });
});