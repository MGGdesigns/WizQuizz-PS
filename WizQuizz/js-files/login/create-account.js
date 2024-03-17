import { getAllUsers, createUser } from "../common/backend-functions.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitioned", () =>{
        document.body.removeChild("loader");
    })
})

document.addEventListener('DOMContentLoaded', async function() {
    var createAccountButton = document.querySelector(".create-account-button");
   
    createAccountButton.addEventListener('click', async function() {
        var username = document.getElementById("nickname-input").value.trim();
        var email = document.getElementById('email-input').value.trim();
        var password = document.getElementById('password-input').value.trim();
        var description = "In the annals of magic, there exists a whispered legend of a wizard unparalleled: Zephyrion, the Arcane Sovereign. With robes swirling like tempests, he wields spells of unfathomable power. From ancient tomes, he conjures storms of brilliance, shaping reality itself. His name resonates through time as a beacon of mystic mastery.";
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
                    alert("Usuario con cuenta ya registrada");
                } else {
                    // Crear la cuenta
                    //Obtenemos la fecha de creación
                    const fecha = new Date();
                    let dia = fecha.getDate();
                    let mes = fecha.getMonth() + 1;
                    let año = fecha.getFullYear();
                    let fechaCompleta = String(dia) + "-" + String(mes) + "-" + String(año);
                    await createUser(username, email, password, description, "../../website-images/common/insert-image.png", fechaCompleta, "0");
                    console.log("La cuenta ha sido creada con éxito.");
                    
                }
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
                alert("Error al obtener usuarios:", error);
            }
        } else {
            console.log("Las contraseñas no coinciden.");
            alert("Las contraseñas no coinciden.");
        }
    });
});