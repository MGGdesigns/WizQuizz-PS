import { setUserData } from "../common/backend-functions.js";

document.addEventListener('DOMContentLoaded', async function() {
    var createAccountButton = document.querySelector(".create-account-button");

    
    createAccountButton.addEventListener('click', function() {
        var nickname = document.getElementById("nickname-input").value.toString();
        var email = document.getElementById('email-input').value.toString();
        var password =  document.getElementById('password-input').value.toString();
        var description = "noDescription";
        var image = "noImage";
        var confirmPassword = document.getElementById('confirm-password-input').value.toString();
        if (password === confirmPassword){
            setUserData(email, nickname, description, image, password);
            console.log("La cuenta ha sido creada con éxito.")
        } else {
            console.log("Las contraseñas no coinciden.");
        }
        
    });
    
})
