import {createLobby} from "../common/backend-functions.js";

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

document.addEventListener('DOMContentLoaded', async function() {
    const nameofQuizz = sessionStorage.getItem("nameofQuizz");
    const numOfPlayers = "";
    document.getElementById("title").innerHTML = nameofQuizz;

    document.getElementById("confirmCode").addEventListener('click', async function(){
        //Se crea el lobby
        const gameCode = document.getElementById("code").value;
        await createLobby(gameCode, nameofQuizz);
        alert("Lobby created successfully!");
    });

    document.getElementById("startGame").addEventListener('click', async function(){
        //FALTA IMPLEMENTARLO
        if(numOfPlayers === 0){
            alert("There are no players!");
        }
    });
});