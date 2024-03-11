document.addEventListener("DOMContentLoaded", function() {
    var localCloudQuestions = localStorage.getItem("questionsInfo");
    var parsedData = JSON.parse(localCloudQuestions);

    let varAdd = localStorage.getItem("varAdd");
    let numberofQuestions = localStorage.getItem("numberofQuestions");
    questionAdder(varAdd);

    //Create Quizz
    document.getElementById("descripcion").addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

        // Obtener los valores del formulario
        var titulo = document.getElementById("titulo").value;
        var littledescription = document.getElementById("littledescription").value;

        // Crear un objeto JSON con los datos
        var data = {
            "titulo": titulo,
            "littledescription": littledescription
        };

        // Convertir el objeto JSON a una cadena JSON
        var jsonData = JSON.stringify(data);

        // Aquí puedes enviar jsonData a tu servidor o realizar cualquier otra operación con él
        localStorage.setItem("quizzInfo", jsonData);
        var localCloudQuizz = localStorage.getItem("quizzInfo");
        document.getElementById("titulo").innerHTML = titulo;
        document.getElementById("littledescription").innerHTML = littledescription;

        //PRUEBAS
        document.getElementById("prueba").innerHTML = localCloud;
    });

    function questionAdder(indicator){
        if(varAdd === "1"){
            document.getElementById("goat2").style.display = "none";
            console.log(numberofQuestions);
            for(i=0; i<parseInt(numberofQuestions); i++){
                console.log("Iteracion: " + i);
                const Maincontainer = document.querySelector(".quizz-questions");
                const questionscontainer = document.getElementById("goat");
                const section = document.createElement('section');
                section.classList.add('quizz-questions');
                section.id = 'section' + i;
                section.innerHTML = `<div class="question">
                <div class="question-info">
                    <p id="questionTitleJS">${parsedData["questionTittle"]}</p>
                    <div class="num-of-question">
                        <h2>${i}</h2>
                    </div>  
                </div>
                <div class="answers">
                    <button class="cauldron-button"><span><img src="../../website-images/answer-options/cauldron.png"></span><span id="answer1JS"></span></button>
                    <button class="mage-staff-button"><span><img src="../../website-images/answer-options/mage-staff.png"></span><span id="answer2JS"></span></button>
                    <button class="mana-button"><span><img src="../../website-images/answer-options/mana.png"></span><span id="answer3JS"></span></button>
                    <button class="magic-ball-button"><span><img src="../../website-images/answer-options/magic-ball.png"></span><span id="answer4JS"></span></button>
                </div>
                </div>`;

                Maincontainer.appendChild(section); 
            }
        }else{
            const Maincontainer2 = document.querySelector(".quizquestions");
            const questionscontainer2 = document.getElementById("goat2");
            questionscontainer2.innerHTML = `<div class="noquestions">
            <div class="define">
                <h1>At the moment you dont have questions!</h1>
                <p></p>
                <h2>Click in the button below for add questions</h2>
            </div>
            </div>`;

            Maincontainer2.appendChild(questionscontainer2); 
        }
        console.log(localCloudQuestions);
    }
});