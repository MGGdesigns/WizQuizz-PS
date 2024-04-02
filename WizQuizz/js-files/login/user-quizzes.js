import {getAllUsers, getAllQuizzes} from "../common/backend-functions.js"

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

let userName = sessionStorage.getItem("userName");
const nickname_display = document.getElementById("username")

//Recorremos todos los usuarios para seleccionar el de current session
const allQuizzes = await getAllQuizzes();
let numberOfQuizz = 0;
let quizz;
let i;
for (quizz of Object.values(allQuizzes)) {
    numberOfQuizz++;
    i++;
    if (quizz.author === userName) {
        quizzAdder();
        console.log(quizz);
    }
}

//-----------------------------------------------------------------------------------
function quizzAdder(){
    const Maincontainer = document.querySelector(".quizzes");
    const section = document.createElement('section');
    section.classList.add('quizzes');
    section.id = 'section' + i;
    section.innerHTML = `<div class="eachQuizz">
        <img src=${quizz.imageUrl} width="400" height="225">
        <h1>${quizz.title}</h1>
    </div>`;
    Maincontainer.appendChild(section); 
}

document.addEventListener('DOMContentLoaded', async function() {
    
});