import {getAllUsers, modifyUserImage, stringToHash} from "../common/backend-functions.js"

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
const quizs_finished_display = document.querySelector(".quizs-finished p")
const input_image = document.getElementById("image-input-file")
let screenMode = sessionStorage.getItem("screenMode") | 0;

//Recorremos todos los usuarios para seleccionar el de current session
const users = await getAllUsers();
let targetUser = sessionStorage.getItem("userMail");
let userToLoad;
for (const user of Object.values(users)) {
    if (user.email === targetUser) {
        userToLoad = user;
        //GUARDAMOS LA IMAGEN PARA QUE NO SE TENGA QUE CARGAR TODO EL RATO DESDE LA DB
        sessionStorage.setItem("imageUrl", user.imageUrl);
        sessionStorage.setItem("userName", user.username);
        break;
    }
}

document.getElementById("circleMode").addEventListener('click', function(){
    if(screenMode === 0){
        screenMode = 1;
        document.body.style.backgroundColor = '#292e39';
        document.getElementById("username").style.color = '#FFFFFF'
        sessionStorage.setItem("screenMode", screenMode);
    }else{
        document.body.style.backgroundColor = '#FFFFFF';
        document.getElementById("username").style.color = '#060100'
        screenMode = 0;
        sessionStorage.setItem("screenMode", screenMode);
    }
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