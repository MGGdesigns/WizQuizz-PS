import { resetPassword } from "../common/backend-functions.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

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

//Comprobamos si estamos en DarkMode o LightMode
let screenMode = sessionStorage.getItem("screenMode") | 0;
if(sessionStorage.getItem("screenMode") === "1"){
    document.getElementById("toogle").checked = true;
    document.body.style.backgroundColor = '#292e39';
}else{
    document.getElementById("toogle").checked = false;
    document.body.style.backgroundColor = '#FFFFFF';
}

document.addEventListener('DOMContentLoaded', function() {

    let avisoMostrado = false;

    function mostrarAviso(mensaje) {
        var aviso = document.getElementById("aviso");
        aviso.textContent = mensaje;
        aviso.style.display = "block";

        setTimeout(() => {
            aviso.style.display = 'none';
            aviso.textContent = ""; 
            avisoMostrado = false;
        }, 2000);
    }

    var resetPasswordButton = document.getElementById("reset-password-button");
   
    resetPasswordButton.addEventListener('click', async function() {

        var email = document.getElementById('email-input').value.toString().trim();
        var result = await resetPassword(email);
        console.log(result);

        if (result === 0) {
            if (avisoMostrado) {
                mostrarAviso("You've already sent an email. Please wait.");
            } else {
                mostrarAviso("Email sent! Check your inbox");
                avisoMostrado = true;
            }
        } else {
            mostrarAviso("Please, introduce a valid email");
        }
    });
});
