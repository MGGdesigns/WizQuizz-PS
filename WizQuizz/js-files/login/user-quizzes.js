import {getAllUsers, getAllQuizzes} from "../common/backend-functions.js"

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})
document.addEventListener('DOMContentLoaded', async function() {
    //Recorremos todos los usuarios para seleccionar el de current session
    let userName = sessionStorage.getItem("userName");
    const allQuizzes = await getAllQuizzes();
    let numberOfQuizz = 0;
    let numberOfUserQuizzes = 0;
    let quizzId = 0;
    let quizz;
    let i;
    for (quizz of Object.values(allQuizzes)) {
        numberOfQuizz++;
        i++;
        if (quizz.author === userName) {
            numberOfUserQuizzes++;
            quizzId = numberOfQuizz;
            quizzAdder();
        }
    }
    //Comprobamos que el user tenga mas de 1 quizz creado
    if(numberOfUserQuizzes === 0){
        noQuizzAdded();
    }

    //-----------------------------------------------------------------------------------
    function quizzAdder(){
        const Maincontainer = document.querySelector(".quizzes");
        const section = document.createElement('section');
        section.classList.add('quizzes');
        section.id = 'section' + i;
        console.log(quizzId);
        section.innerHTML = `<div class="eachQuizz">
            <a class="linkQuizz" href="../play/quizz-preview.html?id=${quizzId}">
                <img src=${quizz.imageUrl} width="400" height="225">
                <h1>${quizz.title}</h1>
            </a>
        </div>`;
        Maincontainer.appendChild(section); 
    }

    //-----------------------------------------------------------------------------------
    function noQuizzAdded(){
        const Maincontainer = document.querySelector(".noQuizzesFinished");
        const section = document.createElement('section');
        section.classList.add('noQuizzesFinished');
        section.id = 'section' + i;
        section.innerHTML = `<div class="box1">
            <div class="texto">
            <div class="logoWiz">
                <img class="logo" src="../../website-images/common/wizquizz-logo.png" width=200 height=200>
            </div>
                <hr>
                <div class="titleAndLogo">
                    <p class="title">¡Bienvenido a tu perfil en WizQuizz!</p>
                </div>
                <div class="information">
                    <p>Actualmente no tienes ningún cuestionario creado, ¡pero no te preocupes! ¡Estás a solo unos pasos de empezar a crear tu propio cuestionario y compartirlo con el mundo!</p>
                    <p>Con WizQuizz, puedes diseñar cuestionarios divertidos y educativos en cuestión de minutos. ¡Deja volar tu imaginación y crea algo único que desafíe y entretenga a tus amigos, familiares o compañeros!</p>
                    <p>Haz clic en el botón "Crear cuestionario" para comenzar tu viaje en la creación de quizz con WizQuizz. ¡Es hora de convertirte en un creador de cuestionarios!</p>
                    <p>¡Gracias por ser parte de la comunidad de WizQuizz!</p>
                </div>
                <hr>
            </div>
            <div class="boton">
                <button type="button" class="button" id="createQuizzButton">+ CREATE QUIZZ</button>
            </div>
        </div>`;
        Maincontainer.appendChild(section);
    }

    //-----------------------------------------------------------------------------------
    const createQuizzButton = document.getElementById("createQuizzButton");
    createQuizzButton.addEventListener("click", function() {
        window.location.href = "../../src/create/quizz-create.html";
    });
});