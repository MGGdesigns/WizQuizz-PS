import {getAllUsers, modifyUserImage, stringToHash, follow, getUserByName} from "../common/backend-functions.js"

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
const users = await getAllUsers();
let targetUser = sessionStorage.getItem("userMail");

//Como acceder al usuario desde la url
const currentUrl = window.location.href.split('=');
let userToLoad = await getUserByName(currentUrl[1]);

//GUARDAMOS LA IMAGEN PARA QUE NO SE TENGA QUE CARGAR TODO EL RATO DESDE LA DB
sessionStorage.setItem("imageUrl", userToLoad.imageUrl);
sessionStorage.setItem("userName", userToLoad.username);

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
    alert("nice");
    const actualUser = sessionStorage.getItem("userName");
    const userToFollow = await getUserByName(document.getElementById("username"));
    //Falta comprobar si se está o no siguiendo al usuario para que lo siga o lo deje de seguir
    await follow(actualUser, userToFollow);
});

nickname_display.innerHTML = userToLoad.username;
user_image_display.src = userToLoad.imageUrl;
user_description_display.innerHTML = userToLoad.description;
account_date_display.innerHTML = "MEMBER SINCE: " + userToLoad.accountCreationDate;
//quizs_finished_display.innerHTML = userToLoad.quizzesFinished + " QUIZS FINISHED";

//meter aqui follow/unfollow
quizs_finished_display.innerHTML = "XD";

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