import {setQuizzQuestion, getAllUsers} from "../../js-files/common/backend-functions.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitioned", () =>{
        document.body.removeChild("loader");
    })
})

document.addEventListener("DOMContentLoaded", async function() {
    //CAMBIO DE IDIOMA CREATE-------------------------------
    let typeLanguage = sessionStorage.getItem("languageStorage");
    if(typeLanguage === "Spanish"){
        console.log("es");
        fetch("../../data/language/create-question/spanish.json")
        .then(response => response.json())
        .then(data => {
            document.getElementById("questionTittle").setAttribute("placeholder", data.quizzInfo.title);
            document.getElementById("answer1").setAttribute("placeholder", data.quizzQuestions.answer1);
            document.getElementById("answer2").setAttribute("placeholder", data.quizzQuestions.answer2);
            document.getElementById("answer3").setAttribute("placeholder", data.quizzQuestions.answer3);
            document.getElementById("answer4").setAttribute("placeholder", data.quizzQuestions.answer4);
            document.getElementById("cancel").value = data.quizzQuestions.cancel;
            document.getElementById("submit").value = data.quizzQuestions.addAnswer;
        })
    }else if(typeLanguage === "English"){
        console.log("en");
    }
    //CAMBIO DE IDIOMA CREATE-------------------------------

    //PRUEBA CAMBIAR IMAGEN---------------------------------------
    let actualUser = sessionStorage.getItem("actualUser");
    let actualUserMail = sessionStorage.getItem("userMail");
    let userImage = document.getElementById("userImage");

    if(actualUser === null){
        userImage.style.display = "none";
    }else{
        document.getElementById("signInButton").style.display = "none";
        userImage.src = sessionStorage.getItem("imageUrl");
        userImage.style.display = "block";
    }
    //PRUEBA CAMBIAR IMAGEN---------------------------------------

    let numberofQuestions;
    let varAdd = 0;

    const menuIcon = document.querySelector('.mobile-bars');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon.addEventListener('click', function () {
        mobileMenu.classList.toggle('show-menu');
    });

    //Create Questions
    document.getElementById("submit").addEventListener("click", async function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

        // Obtener los valores del formulario
        var title = document.getElementById("questionTittle").value;
        var answer1 = document.getElementById("answer1").value;
        var answer2 = document.getElementById("answer2").value;
        var answer3 = document.getElementById("answer3").value;
        var answer4 = document.getElementById("answer4").value;
        var opciones = document.getElementsByClassName("questionAnswer");
        var respuesta;
        for (var i = 0; i < opciones.length; i++) {
            if (opciones[i].checked) {
                respuesta = i+1;
                break;
            }
        }

        // Verificar que los campos requeridos no estén vacíos
        if (title.trim() === ''){
            alert("Por favor, completa el campo del titulo.");
            return;
        }else if(answer1.trim() === ''){
            alert("Por favor, completa la respuesta 1.");
            return;
        }else if(answer2.trim() === ''){
            alert("Por favor, completa la respuesta 2.");
            return;
        }else if(answer3.trim() === ''){
            alert("Por favor, completa la respuesta 3.");
            return;
        }else if(answer4.trim() === ''){
            alert("Por favor, completa la respuesta 4.");
            return;
        }else if(!respuesta){
            alert("Por favor, seleccione una respuesta correcta.");
            return;
        }

        numberofQuestions = parseInt(localStorage.getItem("numberofQuestions")) || 0;

        var quizzId = localStorage.getItem("quizzId");
        // Crear un objeto JSON con los datos
        var data = {
            "id": quizzId,
            "title": title,
            "image": "../../website-images/common/insert-image.png",
            "answers": [
                {
                    "icon": "<img src='../../website-images/answer-options/cauldron-x45.png'>",
                    "text1": answer1
                },
                {
                    "icon": "<img src='../../website-images/answer-options/mage-staff-x45.png'>",
                    "text2": answer2
                },
                {
                    "icon": "<img src='../../website-images/answer-options/mana-x45.png'>",
                    "text3": answer3
                },
                {
                    "icon": "<img src='../../website-images/answer-options/magic-ball-x45.png'>",
                    "text4": answer4
                }
            ]
        };

        var jsonData1 = JSON.stringify(data);
        localStorage.setItem("questionsInfo", jsonData1);
        setQuizzQuestion(quizzId, numberofQuestions, title, "../../website-images/common/insert-image.png", answer1, answer2, answer3, answer4, respuesta);
        varAdd = 1;
        numberofQuestions++;
        localStorage.setItem("varAdd", varAdd);
        localStorage.setItem("numberofQuestions", numberofQuestions);
        setTimeout(function() {
            window.location.href = "quizz-create.html";
        }, 500);
    });

    let numberOfQuestion = localStorage.getItem("questionCount") || "1";
    if(numberOfQuestion < 10){
        numberOfQuestion = "0" + numberOfQuestion;
    }else{
        numberOfQuestion = numberOfQuestion;
    }
    document.getElementById("numberOfQuestion").innerHTML = numberOfQuestion;
});

//Comprobamos si estamos en DarkMode o LightMode
if(sessionStorage.getItem("screenMode") === "1"){
    document.body.style.backgroundColor = '#292e39';
}else{
    document.body.style.backgroundColor = '#FFFFFF';
}