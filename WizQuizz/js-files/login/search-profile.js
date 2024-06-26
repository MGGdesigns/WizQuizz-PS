import {getAllUsers, getUserByName, modifyUserImage, stringToHash} from "../common/backend-functions.js"
import {getSearchedUsername} from "../play/quizz-search.js"
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
document.addEventListener('DOMContentLoaded', async function() {
    let nickname = sessionStorage.getItem("searchedUsername");
    if ( nickname != ""){
        console.log("entra");
    } else {
        console.log("da error al crargar");
    }
    
/*
alert("hace algo");
let userName = sessionStorage.getItem("searchedUsername")
    if ( userName === ""){
        userName = sessionStorage.getItem("userName");
    }
    console.log(userName);


sessionStorage.setItem("actualUser", username);s
sessionStorage.setItem("userMail", email);
*/

const mailActualUser = "followTest@gmail.com";
    const userToLoad = await getUser(mailActualUser)

const user_image_display = document.getElementById("user-image-button")
const user_description_display = document.querySelector(".description p")
const account_date_display = document.querySelector(".account-creation-date p")
const quizs_finished_display = document.querySelector(".quizs-finished p")
const input_image = document.getElementById("image-input-file")
let screenMode = sessionStorage.getItem("screenMode") | 0;
/*
//Recorremos todos los usuarios para seleccionar el de current session
const users = await getAllUsers();
let targetUser = sessionStorage.getItem("searchedUsername")
    if ( targetUser === ""){
        targetUser = sessionStorage.getItem("userName");
    }
    console.log(userName);
let userToLoad;
for (const user of Object.values(users)) {
    if (user.email === targetUser) {
        userToLoad = user;
        //GUARDAMOS LA IMAGEN PARA QUE NO SE TENGA QUE CARGAR TODO EL RATO DESDE LA DB
        sessionStorage.setItem("imageUrl", user.imageUrl);
        sessionStorage.setItem("userName", user.username);
        break;
    }
}*/

//Dark Mode
document.getElementById("darkMode").addEventListener('click', function(){
    screenMode = 1;
    sessionStorage.setItem("screenMode", screenMode);
    document.body.style.backgroundColor = '#292e39';
    document.getElementById("username").style.color = '#FFFFFF'
});

//Light Mode
document.getElementById("lightModeButton").addEventListener('click', function(){
    screenMode = 0;
    sessionStorage.setItem("screenMode", screenMode);
    document.body.style.backgroundColor = '#FFFFFF';
    document.getElementById("username").style.color = '#060100'
});

//Log-Out
document.getElementById("log-out").addEventListener('click', function(){
    sessionStorage.clear();
    window.location.href = "../../index.html";
});

nickname_display.innerHTML = userToLoad.username;
user_image_display.src = userToLoad.imageUrl;
user_description_display.innerHTML = userToLoad.description;
account_date_display.innerHTML = "MEMBER SINCE: " + userToLoad.accountCreationDate;
//quizs_finished_display.innerHTML = userToLoad.quizzesFinished + " QUIZS FINISHED";
quizs_finished_display.innerHTML = "CLICK AQUI PARA VER TUS QUIZZ";

user_image_display.onclick = function(){
    input_image.click();
}

input_image.onchange = function (evt){
    var tgt = evt.target || window,
        files = tgt.files;

    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            user_image_display.src = fr.result;
            sessionStorage.setItem("imageUrl", fr.result); 
            modifyUserImage(stringToHash(userToLoad.email), userToLoad.username, userToLoad.email, userToLoad.password, userToLoad.description, fr.result, userToLoad.accountCreationDate, "");
            alert("Image changed correctly");
        }
        fr.readAsDataURL(files[0]);
    }
}
})