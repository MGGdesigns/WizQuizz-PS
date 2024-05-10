import {getInfoLobby} from "../common/backend-functions.js";
import {firestore} from "../common/backend-functions.js";

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

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

document.getElementById("nextBox").style.display = "none";
window.addEventListener('DOMContentLoaded', async function(){
    const gameCode = await getInfoLobby(1);
    const gameTitle = await getInfoLobby(1);
    const numOfPlayers = await getInfoLobby(1);

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
    });

    const usersCollection = firestore.collection('lobbys/1/users');

    // Escuchar cambios en la colección de usuarios
    usersCollection.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
                console.log('Se ha añadido un nuevo usuario:', change.doc.data());
            }
        });
    });
});