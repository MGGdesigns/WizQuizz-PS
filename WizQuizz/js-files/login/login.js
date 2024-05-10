import { getUser, login } from "../common/backend-functions.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
});

//Comprobamos si estamos en DarkMode o LightMode
let screenMode = sessionStorage.getItem("screenMode") | 0;
if(sessionStorage.getItem("screenMode") === "1"){
    document.getElementById("toogle").checked = true;
    document.body.style.backgroundColor = '#292e39';
}else{
    document.getElementById("toogle").checked = false;
    document.body.style.backgroundColor = '#FFFFFF';
}

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

document.getElementById("circleMode").addEventListener('click', function(){
    if(screenMode === 0){
        screenMode = 1;
        document.body.style.backgroundColor = '#292e39';
        sessionStorage.setItem("screenMode", screenMode);
    }else{
        document.body.style.backgroundColor = '#FFFFFF';
        screenMode = 0;
        sessionStorage.setItem("screenMode", screenMode);
    }
});

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
        let result = [];
        result = await login(email, password);
        console.log(result);
        if(result.length === 1){
            console.log("authentication correct");
            sessionStorage.setItem("actualUser", result[0]);
            window.location.href = '../../src/login/user-profile.html';
        } else {
            console.log(result);
        }
        // const user = await getUser(email);
        // console.log(user);
        // let loggedIn = false;
        // if (user.email === email && user.password === password) {
        //     loggedIn = true;
        //     event.preventDefault();
        //     sessionStorage.setItem("actualUser", user.username);
        //     sessionStorage.setItem("userMail", user.email);
        //     window.location.href = '../../src/login/user-profile.html';
        // }

        // if (!loggedIn) {
        //     alert("Correo electrónico o contraseña incorrectos");
        // }
    });

    //CAMBIO DE IDIOMA LOGIN-------------------------------
    let typeLanguage = sessionStorage.getItem("languageStorage");
    if(typeLanguage === "Spanish"){
        fetch("../../data/language/sign-in/spanish.json")
        .then(response => response.json())
        .then(data => {
            document.getElementById("banner1").innerHTML = data.info.banner1;
            document.getElementById("mail").innerHTML = data.info.mail;
            document.getElementById("password").innerHTML = data.info.password;
            document.getElementById("button1").innerHTML = data.info.button1;
            document.getElementById("info1").innerHTML = data.info.info1;
            document.getElementById("info2").innerHTML = data.info.info2;
            document.getElementById("button2").innerHTML = data.info.button2;
        })
    }else if(typeLanguage === "English"){
        console.log("en");
    }
    //CAMBIO DE IDIOMA LOGIN-------------------------------
});
