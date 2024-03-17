import { getAllUsers } from "../common/backend-functions.js";

document.addEventListener('DOMContentLoaded', function() {
    var loginButton = document.querySelector(".login-button");
    
    loginButton.addEventListener('click', async function() {
        var email = document.getElementById('email-input').value.toString().trim();
        var password = document.getElementById('password-input').value.toString().trim();
        
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
                    alert("Inicio de sesión correcto");
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
