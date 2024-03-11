document.addEventListener("DOMContentLoaded", function() {
    //Create Questions
    document.getElementById("submit").addEventListener("click", function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

        // Obtener los valores del formulario
        var tittle = document.getElementById("questionTittle").value;
        var answer1 = document.getElementById("answer1").value;
        var answer2 = document.getElementById("answer2").value;
        var answer3 = document.getElementById("answer3").value;
        var answer4 = document.getElementById("answer4").value;

        // Crear un objeto JSON con los datos
        var data = {
            "questionTittle": tittle,
            "answer1": answer1,
            "answer2": answer2,
            "answer3": answer3,
            "answer4": answer4
        };

        // Convertir el objeto JSON a una cadena JSON
        var jsonData = JSON.stringify(data);

        // Aquí puedes enviar jsonData a tu servidor o realizar cualquier otra operación con él
        localStorage.setItem("questionsInfo", jsonData);
        var localCloudQuestions = localStorage.getItem("questionsInfo");
    });

    let varAdd = 0;

    document.getElementById("finishbutton").addEventListener("click", function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
        
        varAdd = 1;
        localStorage.setItem("varAdd", varAdd);
        window.location.href = "quizz-create.html";
    });
});