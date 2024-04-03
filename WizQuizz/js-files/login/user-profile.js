import { getAllUsers } from "../common/backend-functions.js"

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

//Comprobamos si estamos en DarkMode o LightMode
console.log(sessionStorage.getItem("screenMode"));
if(sessionStorage.getItem("screenMode") === "1"){
    console.log("dark");
    document.body.style.backgroundColor = '#060100';
}else{
    console.log("light");
    document.body.style.backgroundColor = '#FFFFFF';
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

//Dark Mode
document.getElementById("darkMode").addEventListener('click', function(){
    screenMode = 1;
    sessionStorage.setItem("screenMode", screenMode);
    document.body.style.backgroundColor = '#060100';
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
            console.log(user_image_display.src);
        }
        fr.readAsDataURL(files[0]);
    }
}