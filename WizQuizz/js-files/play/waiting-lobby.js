import {getInfoLobby} from "../common/backend-functions.js";

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
    const gameCode = sessionStorage.getItem("gamecode");
    const gameTitle = await getInfoLobby(1);

    this.document.getElementById("title").innerHTML = gameTitle.quizzTitle;
    this.document.getElementById("code").innerHTML = gameCode;

    this.document.getElementById("confirm-user-button").addEventListener('click', async function(){
        document.getElementById("nextBox").style.display = "block";
        document.getElementById("prevBox").style.display = "none";

        const userName = document.getElementById("waiting-tab-input").value;
    });
});