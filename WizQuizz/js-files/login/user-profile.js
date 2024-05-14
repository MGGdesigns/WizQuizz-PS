import {getAllUsers, getUser, modifyUserImage, stringToHash} from "../common/backend-functions.js"

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

//Comprobamos si estamos en DarkMode o LightMode
if(sessionStorage.getItem("screenMode") === "1"){
    document.getElementById("toogle").checked = true;
    document.body.style.backgroundColor = '#292e39';
    document.getElementById("username").style.color = '#FFFFFF'
}else{
    document.getElementById("toogle").checked = false;
    document.body.style.backgroundColor = '#FFFFFF';
    document.getElementById("username").style.color = '#060100'
}

if(sessionStorage.getItem("cursorView") === "Default"){
    setCursor('Default');
}else if (sessionStorage.getItem("cursorView") === "Wand") {
    setCursor('Wand');
}

const formCursor = document.getElementById("cursors");
let selectedCursor = sessionStorage.getItem("cursorView") || "Default";

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

formCursor.addEventListener('change', function(){
    const selectedOption = this.options[this.selectedIndex];
    selectedCursor = selectedOption.text;
    sessionStorage.setItem("cursorView", selectedCursor);
    setCursor(selectedCursor);
});

const nickname_display = document.getElementById("username")
const user_image_display = document.getElementById("user-image-button")
const user_description_display = document.querySelector(".description p")
const account_date_display = document.querySelector(".account-creation-date p")
const quizs_finished_display = document.querySelector(".quizs-finished p")
const input_image = document.getElementById("image-input-file")
let screenMode = sessionStorage.getItem("screenMode") | 0;

//Recorremos todos los usuarios para seleccionar el de current session
let targetUser = sessionStorage.getItem("actualUser");
//------------------------------------------------------------------

if (sessionStorage.getItem("foundUserMail")!==null){
    targetUser = sessionStorage.getItem("foundUserMail");
    console.log(targetUser);
}
//-------------------------------------------------------------------


let userToLoad;

console.log(targetUser);
userToLoad = await getUser(targetUser);
console.log(userToLoad);
sessionStorage.setItem("imageUrl", userToLoad.imageUrl);
sessionStorage.setItem("userName", userToLoad.username);

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
            modifyUserImage(targetUser, fr.result);
            alert("Image changed correctly");
        }
        fr.readAsDataURL(files[0]);
    }
}