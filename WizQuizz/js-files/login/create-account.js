import { getAllUsers, createUser } from "../../../../paraCopiar/WizQuizz-PS/WizQuizz/js-files/common/backend-functions.js";

document.addEventListener('DOMContentLoaded', async function() {
    var createAccountButton = document.querySelector(".create-account-button");
   
    createAccountButton.addEventListener('click', async function() {
        var username = document.getElementById("nickname-input").value.trim();
        var email = document.getElementById('email-input').value.trim();
        var password = document.getElementById('password-input').value.trim();
        var description = "noDescription";
        var confirmPassword = document.getElementById('confirm-password-input').value.trim();
        
        if (password === confirmPassword) {
            try {
                // Obtener todos los usuarios
                const users = await getAllUsers();
                console.log("Usuarios obtenidos:", users);

                // Verificar si el usuario ya existe
                const existingUser = Object.values(users).find(user => user.username === username);
                console.log("Usuario existente:", existingUser);
                
                if (existingUser) {
                    console.log("Usuario con cuenta ya registrada");
                } else {
                    // Crear la cuenta
                    await createUser(username, email, password, description, "", "", "0");
                    console.log("La cuenta ha sido creada con éxito.");
                }
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        } else {
            console.log("Las contraseñas no coinciden.");
        }
    });
});
