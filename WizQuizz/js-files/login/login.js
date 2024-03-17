import { getAllUsers } from "../common/backend-functions.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

document.addEventListener('DOMContentLoaded', function(event) {
    //Prueba
    let actualUser = sessionStorage.getItem("actualUser");
    if(actualUser === null){
        console.log("vacio");
    }else{
        event.preventDefault();
        console.log("hay alguien");
        window.location.href = "../../src/login/user-profile.html";
    }
    
    var loginButton = document.querySelector(".login-button");
    loginButton.addEventListener('click', async function() {
        var email = document.getElementById('email-input').value.toString().trim();
        var password = document.getElementById('password-input').value.toString().trim();
        console.log(email, password);
        try {
            const users = await getAllUsers();

            let loggedIn = false;
            for (const user of Object.values(users)) {
                if (user.email === email && user.password === password) {
                    loggedIn = true;
                    event.preventDefault();
                    sessionStorage.setItem("actualUser", user.username);
                    sessionStorage.setItem("userMail", user.email);
                    window.location.href = '../../src/login/user-profile.html';
                    break;
                }
            }

            if (!loggedIn) {
                alert("Correo electrónico o contraseña incorrectos");
            }
        } catch (error) {
            alert("Error al obtener todos los usuarios:", error);
        }
    });
});
