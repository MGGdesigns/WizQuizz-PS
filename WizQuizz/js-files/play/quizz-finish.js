import {getAllUsers} from "../common/backend-functions.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

document.addEventListener('DOMContentLoaded', async function() {
    //PRUEBA CAMBIAR IMAGEN---------------------------------------
    let actualUser = sessionStorage.getItem("actualUser");
    let actualUserMail = sessionStorage.getItem("userMail");
    let userImage = document.getElementById("userImage");

    const menuIcon = document.querySelector('.mobile-bars');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon.addEventListener('click', function () {
        mobileMenu.classList.toggle('show-menu');
    });

    if(actualUser === null){
        userImage.style.display = "none";
        console.log("Nadie logeado");
    }else{
        document.getElementById("signInButton").style.display = "none";

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
        userImage.src = String(userToLoad.imageUrl);
        userImage.style.display = "block";
    }
    //PRUEBA CAMBIAR IMAGEN---------------------------------------

    const finish = document.getElementById("finish");
    const mark = document.getElementById("mark");
    const exit = document.getElementById("exit");
    var resultado = localStorage.getItem("results");
    var numofquestions = sessionStorage.getItem("totalQuestions");
    var varInteger = parseInt(numofquestions);

    const currentUrl = window.location.href.split('=');
    const idQuizz = currentUrl[1];

    console.log(numofquestions);

    if(resultado >= varInteger/2){
        finish.innerHTML = "Congratulations!";
        mark.innerHTML = resultado + "/" + numofquestions;
    }else{
        finish.innerHTML = "Bad Luck!";
        mark.innerHTML = resultado  + "/" + numofquestions;
    }
    if(resultado === null){
        mark.innerHTML = "Leave";
    }

    localStorage.clear();
    exit.addEventListener("click", function() {
        event.preventDefault();
        window.location.href = "../../src/play/quizz-preview.html?id=" + idQuizz;
    });
});