import { setUserData } from "../common/backend-functions.js";

document.addEventListener('DOMContentLoaded', async function() {
    var createAccountButton = document.querySelector(".create-account-button");

    
    
    createAccountButton.addEventListener('click', signup(){
        var nickname = document.getElementById("nickname-data");
        var email = document.getElementById('email-data');
        var password =  document.getElementById('password-data');
        var description = "jfkdjflksd";
        var image = "dkjdksjf";
        setUserData(email, nickname, description, image, password);
    });

});
