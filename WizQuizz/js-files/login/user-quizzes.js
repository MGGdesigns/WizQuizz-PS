import {getAllUsers, getAllQuizzes, modifyQuizz} from "../common/backend-functions.js"

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

document.addEventListener('DOMContentLoaded', async function() {

    ////MODIFICADO PARA MOSTRAR EL NUMERO DE QUIZZES DE USUSARIOS BUSCADOS
    let userName = sessionStorage.getItem("searchedUsername")
    if ( userName === ""){
        userName = sessionStorage.getItem("userName"); ////
    }
    console.log(userName);
    ///-------------------------------------------------------------------

    //Recorremos todos los usuarios para seleccionar el de current session
    let userName = sessionStorage.getItem("userName");
    
    ///LO DE ROSMARY------------------------------------------------------
    if ( userName === ""){
        userName = sessionStorage.getItem("userName");
        userName = sessionStorage.getItem("userName"); ////
    }
    ///LO DE ROSMARY------------------------------------------------------

    var quizzByUser = await getUserQuizzes(userName);
    let numberOfQuizz = 0;
    let numberOfUserQuizzes = 0;
    let quizzId = 0;
    let quizz;
    let i = 0;
    console.log(allQuizzes);
    for (quizz of Object.values(allQuizzes)) {
        numberOfQuizz++;
        i++;
        if (quizz.author === userName) {
            numberOfUserQuizzes++;
            quizzId = numberOfQuizz;    //HAY QUE HACER QUE CADA QUIZZ TENGA UN ID UNICO PORQUE CUANDO SE BORRA UNO Y NO VA DE 1 A 5 pjm, EL FOR LO PILLA COMO EL NUMERO LOGICO, NO EL ID
            console.log(quizzId);
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
            <div class="modifyQuizz">
                <a><button type="button" class="modifyButton" id="modifyButton${quizzId}" onclick="getButtonIndex(${quizzId})">Modify Quizz</button></a>
            </div>

            <a class="linkQuizz" href="../play/quizz-preview.html?id=${quizzId}">
                <img src=${quizz.imageUrl} width="400" height="225">
                <div class="infoAboutQuizz">
                    <div class="info1" id="infos">
                        <h1 class="infoBox">${questionsLength} Qs</h1>
                        <p class="additionalText1">Nº of questions</p>
                    </div>

                    <div class="info3" id="infos">
                        <h1 class="infoBox"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i></h1>
                        <p class="additionalText3">Ranking of quizz</p>
                    </div>
                </div>
                <div class="info2" id="infos">
                    <h1 class="infoBox">${quizz.title}</h1>
                    <p class="additionalText2">Title of the questionnaire</p>
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
                    <p class="title">Welcome to your WizQuizz profile!</p>
                </div>
                <div class="information">
                    <p>You don't currently have any quizzes created, but don't worry! You're just a few steps away from starting to create your own quiz and share it with the world!</p>
                    <p>With WizQuizz, you can design fun and educational quizzes in a matter of minutes. Let your imagination run wild and create something unique that will challenge and entertain your friends, family, or colleagues!</p>
                    <p>Click on the "Create Quiz" button to start your quiz creation journey with WizQuizz. It's time to become a quiz maker!</p>
                    <p>Thank you for being a part of the WizQuizz community!</p>
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

    //MODIFICACION DE QUIZZ
    //const xd = document.getElementById("modify");
    //xd.addEventListener("click", function() {
        //console.log("xd");
        //modifyQuizz(12, "xd", "xd", "xd", "Iniesta", "xd", "xd", "xd")
    //});
});

//Comprobamos si estamos en DarkMode o LightMode
if(sessionStorage.getItem("screenMode") === "1"){
    document.body.style.backgroundColor = '#292e39';
    document.getElementById('infoaboutQuizzes').style.color = '#FFFFFF';
}else{
    document.body.style.backgroundColor = '#FFFFFF';
}