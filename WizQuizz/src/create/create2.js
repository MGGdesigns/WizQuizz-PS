import {addQuizQuestion} from "../../js-files/common/backend-functions.js";

document.addEventListener("DOMContentLoaded", function() {
    let numberofQuestions;
    let varAdd = 0;

    //Create Questions
    document.getElementById("submit").addEventListener("click", function(event) {
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

        numberofQuestions = parseInt(localStorage.getItem("numberofQuestions")) || 0;

        // Crear un objeto JSON con los datos
        var data = {
            "id": 9,
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

        // Se guarda el JSON ESTO HAY QUE CAMBIARLO POR LA BASE DE DATOS PORQUE NO DEJA METER EN EL JSON
        var jsonData1 = JSON.stringify(data);
        localStorage.setItem("questionsInfo", jsonData1);
        addQuizQuestion(7, numberofQuestions, title, "", answer1, answer2, answer3, answer4, respuesta);
        //HASTA AQUI ESTA MAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
    });

    document.getElementById("finishbutton").addEventListener("click", function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
        
        varAdd = 1;
        numberofQuestions++;
        localStorage.setItem("varAdd", varAdd);
        localStorage.setItem("numberofQuestions", numberofQuestions);
        window.location.href = "quizz-create.html";
    });
});