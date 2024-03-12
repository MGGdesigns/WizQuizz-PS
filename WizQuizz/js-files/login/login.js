import { getDatabase, set } from 'backend-functions';

document.addEventListener('DOMContentLoaded', async function() {
    var createAccountButton = document.querySelector(".create-account-button");

    var nickname = document.getElementById('nickname-data');
    var email = document.getElementById('email-dat');
    var password = document.getElementById('password-data');
    set(nickname, email, password);

/*
    
    loginButton.addEventListener("click", control() {
    var email = document.getElementById("email-input").value;
    var password = document.getElementById("password-input").value;

    if (document.getElementById('email') == null
            || document.getElementById('email') == "") {
            alert("El campo no puede estar vacío.");
            document.getElementById('uname').focus();
            return false;
        }
        return true;
    //var usuarioEncontrado = get() //FUNCION DE JS DE LA DB

    // if (usuarioEncontrado) {
    //     console.log("Inicio de sesión exitoso");
    //     window.location.href = "../../src/login/user-profile.html";
    // } else {
    //     console.log("Usuario o contraseña incorrectos");
    // }
    // })
    .catch(error => console.error('Error:', error));
    });


*/

    //     const jsonFilePath = "../../../login/users.json";
//     var loginButton = document.querySelector(".login-button");

//     loginButton.addEventListener("click", function() {
//         var email = document.getElementById("email-input").value;
//         var password = document.getElementById("password-input").value;

//     fetch("../../data//login/users.json")
//         .then(response => response.json())
//         .then(data => {
//             var usuarioEncontrado = data.users.find(usuario => usuario.nickname === email && usuario.password === password);

//             if (usuarioEncontrado) {
//                 console.log("Inicio de sesión exitoso");
//                 window.location.href = "../../src/login/user-profile.html";
//             } else {
//                 console.log("Usuario o contraseña incorrectos");
//             }
//         })
//         .catch(error => console.error('Error:', error));
// });
});
