import {stringToHash, follow, getUserByName, getUserQuizzes, getQuizz, getUser} from "../common/backend-functions.js"

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

//Comprobamos si estamos en DarkMode o LightMode
if(sessionStorage.getItem("screenMode") === "1"){
    document.body.style.backgroundColor = '#292e39';
    document.getElementById("username").style.color = '#FFFFFF'
}else{
    document.body.style.backgroundColor = '#FFFFFF';
    document.getElementById("username").style.color = '#060100'
}

const nickname_display = document.getElementById("username")
const user_image_display = document.getElementById("user-image-button")
const user_description_display = document.querySelector(".description p")
const account_date_display = document.querySelector(".account-creation-date p")
const input_image = document.getElementById("image-input-file")
let screenMode = sessionStorage.getItem("screenMode") | 0;

//Recorremos todos los usuarios para seleccionar el de current session
let targetUser = sessionStorage.getItem("userMail");

//Como acceder al usuario desde la url
const currentUrl = window.location.href.split('=');
const userToLoad = await getUserByName(currentUrl[1]);

//Dark/Light Mode

if(sessionStorage.getItem("screenMode" === 1)){
    document.body.style.backgroundColor = '#292e39';
    document.getElementById("username").style.color = '#FFFFFF';
} else {
    document.body.style.backgroundColor = '#FFFFFF';
    document.getElementById("username").style.color = '#060100';
}

//Follow
document.getElementById("follow-button").addEventListener('click', async function(){
    /*alert("nice");
    const actualUser = sessionStorage.getItem("userName");
    console.log(actualUser);
    //Falta comprobar si se está o no siguiendo al usuario para que lo siga o lo deje de seguir
    await follow(actualUser, userToLoad);*/
    

    //////MODIFICADO //////
    const actualUserMail = sessionStorage.getItem("userMail");
    const actualUser = await getUser(actualUserMail)
    let followers = actualUser.following

    if (!followers.includes(userToLoad.email)){
        followers.push(userToLoad.email)
        await follow(actualUser.username,actualUser.email, actualUser.password, actualUser.description, actualUser.imageUrl, actualUser.accountCreationDate, actualUser.quizzesFinished, followers);
        console.log(followers)
    } else {
        console.log("already followed")
    /////MODIFICADO //////
});

nickname_display.innerHTML = userToLoad.username;
user_image_display.src = userToLoad.imageUrl;
user_description_display.innerHTML = userToLoad.description;
account_date_display.innerHTML = "MEMBER SINCE: " + userToLoad.accountCreationDate;
//quizs_finished_display.innerHTML = userToLoad.quizzesFinished + " QUIZS FINISHED";

//meter aqui follow/unfollow
//quizs_finished_display.innerHTML = "XD";

    //Recorremos todos los usuarios para seleccionar el de current session
    let userName = userToLoad.username;

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
    //-----------------------------------------------------------------------------------
    function quizzAdder(){
        //Ponemos el nombre del user
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
    //-----------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------
