import {setQuizData, getQuizz, getDataQuizz, getQuizzes} from "../../js-files/common/backend-functions.js";

document.addEventListener("DOMContentLoaded", function() {
    var localCloudQuestions = localStorage.getItem("questionsInfo");
    var parsedData = JSON.parse(localCloudQuestions);

    async function obtenerNumeroDeQuizzes() {
        try {
            let data = await getQuizzes();
            let numberofQuiz = Object.keys(data).length;
            return numberofQuiz; // Si deseas retornar el valor
        } catch (error) {
            console.error(error);
        }
    }
    
    obtenerNumeroDeQuizzes().then((numero) => {
        let varAdd = localStorage.getItem("varAdd");
        let numberofQuestions = localStorage.getItem("numberofQuestions");
        questionAdder(varAdd);
        document.getElementById("descripcion").addEventListener("submit", function(event) {
            event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada

            var titulo = document.getElementById("titulo").value;
            var littledescription = document.getElementById("littledescription").value;
            var data = {
                "titulo": titulo,
                "littledescription": littledescription
            };

            //Añadimos a la base de datos la informacion
            setQuizData(numero+1, titulo, littledescription, "Angel", "13/03/2024", "");
            // Convertir el objeto JSON a una cadena JSON
            var jsonData = JSON.stringify(data);
            // Aquí puedes enviar jsonData a tu servidor o realizar cualquier otra operación con él
            localStorage.setItem("quizzInfo", jsonData);
            var localCloudQuizz = localStorage.getItem("quizzInfo");
            document.getElementById("titulo").innerHTML = titulo;
            document.getElementById("littledescription").innerHTML = littledescription;
        });

        function questionAdder(indicator){
            let allInfo;
            getDataQuizz(numero)
                .then(data => {
                    //Mostramos el cuadro de las preview
                    if(varAdd === "1"){
                        console.log(data.questions[0].question);
                        document.getElementById("goat2").style.display = "none";
                        for(let i=0; i<parseInt(numberofQuestions); i++){
                            const Maincontainer = document.querySelector(".quizz-questions");
                            const questionscontainer = document.getElementById("goat");
                            const section = document.createElement('section');
                            section.classList.add('quizz-questions');
                            section.id = 'section' + i;
                            section.innerHTML = `<div class="question">
                            <div class="question-info">
                                <p id="questionTitleJS">${data.questions[i].question}</p>
                                <div class="num-of-question">
                                    <h2>${data.id}</h2>
                                </div>  
                            </div>
                            <div class="answers">
                                <button class="cauldron-button"><span><img src="../../website-images/answer-options/cauldron.png"></span><span id="answer1JS">${data.questions[i].answer1}</span></button>
                                <button class="mage-staff-button"><span><img src="../../website-images/answer-options/mage-staff.png"></span><span id="answer2JS">${data.questions[i].answer2}</span></button>
                                <button class="mana-button"><span><img src="../../website-images/answer-options/mana.png"></span><span id="answer3JS">${data.questions[i].answer3}</span></button>
                                <button class="magic-ball-button"><span><img src="../../website-images/answer-options/magic-ball.png"></span><span id="answer4JS">${data.questions[i].answer4}</span></button>
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
                })
                .catch(error => {
                    // Este bloque se ejecutará si ocurre algún error durante la ejecución de la Promesa
                    console.error(error); // Imprime el error en la consola
                });   
        }
        });
});