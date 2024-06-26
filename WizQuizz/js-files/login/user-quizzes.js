import {getAllUsers, getAllQuizzes, modifyQuizz, getUserQuizzes, getQuizz} from "../common/backend-functions.js"
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

    ///LO DE ROSMARY------------------------------------------------------
    if ( userName === ""){
        userName = sessionStorage.getItem("userName");
        userName = sessionStorage.getItem("userName"); 
    }
    ///LO DE ROSMARY------------------------------------------------------

    var quizzByUser = await getUserQuizzes(userName);
    let numberOfQuizz = 0;
    let numberOfUserQuizzes = 0;
    let quizzId = 0;
    let quizz;
    let j = 0;
    if(quizzByUser === null){
        console.log("falle");
    }else{
        let quizzOfUser = Object.keys(quizzByUser);
        for(let i=0; i<quizzOfUser.length; i++){
            j++;
            numberOfUserQuizzes++;
            quizz = await getQuizz(quizzOfUser[i]);
            quizzId = quizzOfUser[i];
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
        section.id = 'section' + j;
        section.innerHTML = `<div class="eachQuizz">
            <div class="modifyQuizz">
                <a>
                    <button type="button" class="modifyButton" id="modifyButton${quizzId}" onclick="getButtonIndex(${quizzId})"><i id="pencil" class="fa fa-pencil" aria-hidden="true"></i>Modify Quizz</button>
                </a>
            </div>
            <a class="linkQuizz" href="../play/quizz-preview.html?id=${quizzId}">
                <img src=${quizz.imageUrl} width="400" height="225">
                <div class="infoAboutQuizz">
                    <div class="info1" id="infos">
                        <h1 class="infoBox">${questionsLength} Qs</h1>
                        <p class="additionalText1">Nº of questions</p>
                    </div>
                    <div class="info3" id="infos">
                        <h1 class="infoBox" id="rankigAboutQuizz${j}"></h1>
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
        //Ranking de cada Quizz
        let quizzRanking = quizz.rating;
        if(quizzRanking >= 0 && quizzRanking <= 0.99){
            document.getElementById("rankigAboutQuizz" + j).innerHTML = `<i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i>`;
        }else if(quizzRanking >= 1 && quizzRanking <= 1.99){
            document.getElementById("rankigAboutQuizz" + j).innerHTML = `<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i>`;
        }else if(quizzRanking >= 2 && quizzRanking <= 2.99){
            document.getElementById("rankigAboutQuizz" + j).innerHTML = `<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i>`;
        }else if(quizzRanking >= 3 && quizzRanking <= 3.99){
            document.getElementById("rankigAboutQuizz" + j).innerHTML = `<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i>`;
        }else if(quizzRanking >= 4 && quizzRanking <= 4.99){
            document.getElementById("rankigAboutQuizz" + j).innerHTML = `<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star-o" aria-hidden="true"></i>`;
        }else if(quizzRanking === 5){
            document.getElementById("rankigAboutQuizz" + j).innerHTML = `<i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i>`;
        }
    }

    if(sessionStorage.getItem("cursorView") === "Default"){
        setCursor('Default');
    }else if (sessionStorage.getItem("cursorView") === "Wand") {
        setCursor('Wand');
    }

    function setCursor(cursor) {
        const allElements = document.querySelectorAll('*');

        if (cursor === 'Default') {
            allElements.forEach(element => {
                element.style.cursor = 'default';
            });
        } else if (cursor === 'Wand') {
            allElements.forEach(element => {
                element.style.cursor = 'url("../../website-images/common/wand-cursor.png"), auto';
            });
        }
    }

    //-----------------------------------------------------------------------------------
    function noQuizzAdded(){
        document.getElementById("infoaboutQuizzes").style.display = "none";
        const Maincontainer = document.querySelector(".noQuizzesFinished");
        const section = document.createElement('section');
        section.classList.add('noQuizzesFinished');
        section.id = 'section' + j;
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
});
let screenMode = sessionStorage.getItem("screenMode") | 0;
document.getElementById("circleMode").addEventListener('click', function(){
    if(screenMode === 0){
        screenMode = 1;
        document.body.style.backgroundColor = '#292e39';
        sessionStorage.setItem("screenMode", screenMode);
        document.getElementById("infoaboutQuizzes").style.color = '#FFFFFF';
    }else{
        document.body.style.backgroundColor = '#FFFFFF';
        document.getElementById("infoaboutQuizzes").style.color = '#060100';
        screenMode = 0;
        sessionStorage.setItem("screenMode", screenMode);
    }
});
//Comprobamos si estamos en DarkMode o LightMode
if(sessionStorage.getItem("screenMode") === "1"){
    document.getElementById("toogle").checked = true;
    document.body.style.backgroundColor = '#292e39';
    document.getElementById("infoaboutQuizzes").style.color = '#FFFFFF';
}else{
    document.getElementById("toogle").checked = false;
    document.body.style.backgroundColor = '#FFFFFF';
    document.getElementById("infoaboutQuizzes").style.color = '#060100';
}