import { setUserData } from "../common/backend-functions.js";

document.addEventListener('DOMContentLoaded', async function() {
    var createAccountButton = document.querySelector(".create-account-button");

    
    createAccountButton.addEventListener('click', function() {
        var nickname = document.getElementById("nickname-input").value;
        var email = document.getElementById('email-input').value.toString();
        var password =  document.getElementById('password-input').value;
        var description = "noDescription";
        var image = "noImage";
        setUserData(email, nickname, description, image, password);
    });
    
})
