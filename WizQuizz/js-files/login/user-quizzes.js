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
        //Ponemos el nombre del user
        document.getElementById("userName").innerHTML = userName;

        //Compruebo que el quizz tenga preguntas, si hay error tiene 0 preguntas
        let questionsLength;
        if(quizz.questions && quizz.questions.length) {
            questionsLength = quizz.questions.length;
        }else {
            questionsLength = 0;
        }        
        const Maincontainer = document.querySelector(".quizzes");
        const section = document.createElement('section');
        section.classList.add('quizzes');
        section.id = 'section' + i;
        section.innerHTML = `<div class="eachQuizz">
            <a class="linkQuizz" href="../play/quizz-preview.html?id=${quizzId}">
                <img src=${quizz.imageUrl} width="400" height="225">
                <div class="infoAboutQuizz">
                    <div class="info1" id="infos">
                        <h1 class="infoBox">${questionsLength} Qs</h1>
                        <p class="additionalText1">Nº de preguntas</p>
                    </div>

                    <div class="info3" id="infos">
                        <h1 class="infoBox"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i></h1>
                        <p class="additionalText3">Ranking del quizz</p>
                    </div>
                </div>
                <div class="info2" id="infos">
                    <h1 class="infoBox">${quizz.title}</h1>
                    <p class="additionalText2">Titulo del cuestionario</p>
                </div>
            </a>
        </div>`;
        Maincontainer.appendChild(section); 
    }

    //-----------------------------------------------------------------------------------
    function noQuizzAdded(){
        document.getElementById("infoaboutQuizzes").style.display = "none";
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

//Comprobamos si estamos en DarkMode o LightMode
console.log(sessionStorage.getItem("screenMode"));
if(sessionStorage.getItem("screenMode") === "1"){
    console.log("dark");
    document.body.style.backgroundColor = '#292e39';
    document.getElementById('infoaboutQuizzes').style.color = '#FFFFFF';
}else{
    console.log("light");
    document.body.style.backgroundColor = '#FFFFFF';
}