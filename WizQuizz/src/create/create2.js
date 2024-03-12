document.addEventListener("DOMContentLoaded", function() {
    //Create Questions
    document.getElementById("submit").addEventListener("click", function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

        // Obtener los valores del formulario
        var title = document.getElementById("questionTittle").value;
        var answer1 = document.getElementById("answer1").value;
        var answer2 = document.getElementById("answer2").value;
        var answer3 = document.getElementById("answer3").value;
        var answer4 = document.getElementById("answer4").value;

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
        fetch('questions-data.json')
            .then(response => response.json())
            .then(existingData => {
                existingData.questions.push(data);
                // Convertir y guardar los datos actualizados en el archivo JSON
                const updatedJsonData = JSON.stringify(existingData, null, 2);

                // Sobrescribir el archivo JSON existente con los datos actualizados
                fetch('questions-data.json', {
                    method: 'PUT',
                    body: updatedJsonData,
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
                .then(() => {
                    console.log('El JSON se ha actualizado correctamente.');
                })
                .catch(error => console.error('Error al guardar el archivo JSON:', error));
            })
            .catch(error => console.error('Error al cargar el archivo JSON:', error));
        //HASTA AQUI ESTA MAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
    });

    let varAdd = 0;
    let numberofQuestions;
    if(numberofQuestions === null){
        numberofQuestions = 0;
    }else{
        numberofQuestions = localStorage.getItem("numberofQuestions");
    }

    document.getElementById("finishbutton").addEventListener("click", function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
        
        varAdd = 1;
        numberofQuestions++;
        localStorage.setItem("varAdd", varAdd);
        localStorage.setItem("numberofQuestions", numberofQuestions);
        window.location.href = "quizz-create.html";
    });
});