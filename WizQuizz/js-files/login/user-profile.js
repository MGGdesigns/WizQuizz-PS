import { getAllUsers } from "../common/backend-functions.js"

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

const nickname_display = document.getElementById("username")
const user_image_display = document.getElementById("user-image-button")
const user_description_display = document.querySelector(".description p")
const account_date_display = document.querySelector(".account-creation-date p")
const quizs_finished_display = document.querySelector(".quizs-finished p")
const input_image = document.getElementById("image-input-file")

//Recorremos todos los usuarios para seleccionar el de current session
const users = await getAllUsers();
let targetUser = sessionStorage.getItem("userMail");
let userToLoad;
for (const user of Object.values(users)) {
    if (user.email === targetUser) {
        userToLoad = user;
        break;
    }
}

//Log-Out
document.getElementById("log-out").addEventListener('click', function(){
    sessionStorage.clear();
    window.location.href = "../../index.html";
});

nickname_display.innerHTML = userToLoad.username;
user_image_display.src = userToLoad.imageUrl;
user_description_display.innerHTML = userToLoad.description;
account_date_display.innerHTML = "MEMBER SINCE: " + userToLoad.accountCreationDate;
quizs_finished_display.innerHTML = userToLoad.quizzesFinished + " QUIZS FINISHED";

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