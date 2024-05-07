import { getUser, createUser } from "../common/backend-functions.js";

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


document.addEventListener('DOMContentLoaded', async function() {
    var createAccountButton = document.querySelector(".create-account-button");
   
    createAccountButton.addEventListener('click', async function(e) {
        event.preventDefault(e);
        var username = document.getElementById("nickname-input").value.trim();
        var email = document.getElementById('email-input').value.trim();
        var password = document.getElementById('password-input').value.trim();
        var description = "Hello this is a provisional description, you will be able to change it in next updates to further personalize your account.";
        var confirmPassword = document.getElementById('confirm-password-input').value.trim();

        function mostrarAviso(mensaje) {
            var aviso = document.getElementById("aviso");
            aviso.textContent = mensaje;
            aviso.style.display = "block";
        }

        if (!username || !email || !password || !confirmPassword) {
            mostrarAviso("Please, fill out all of the fields");
            return;
        } 

        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailFormat.test(email)){
            mostrarAviso("Wrong email format");
            return;
        } 
       
        if (password!=confirmPassword) {
            mostrarAviso("The passwords do not match. Please try again.");
            return;
        }

        const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

        if (!passwordFormat.test(password)) {
            mostrarAviso("The password must be at least 8 characters long, including uppercase, lowercase and numbers");
            return;
        }
        
        if (password === confirmPassword) {
            try {
                // Crear la cuenta
                const fecha = new Date();
                let dia = fecha.getDate();
                let mes = fecha.getMonth() + 1;
                let año = fecha.getFullYear();
                let fechaCompleta = String(dia) + "-" + String(mes) + "-" + String(año);
                const userId = await createUser(username, email, password, description, "../../website-images/common/userImage.png", fechaCompleta, "0", []);
                window.location.href = '../../src/login/user-profile.html';
                sessionStorage.setItem("actualUser", userId);
            } catch (error) {
                mostrarAviso(error);
            }
        }
    });
});
