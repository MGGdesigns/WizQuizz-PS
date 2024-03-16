import {createQuizz, getQuizz} from "../../js-files/common/backend-functions.js";

document.addEventListener("DOMContentLoaded", function() {
    //Variables
    var localCloudQuestions = localStorage.getItem("questionsInfo");
    var parsedData = JSON.parse(localCloudQuestions);
    let result;
    let varAdd = localStorage.getItem("varAdd");
    let numberofQuestions = localStorage.getItem("numberofQuestions");
    let titulo;
    let littledescription;
    let data;
    let image;
    let quizzImage;
    let questionNumber;
    
    //Llamadas a funciones
    questionAdder(varAdd);

    //Reset localStorage when click on Finish button
    document.getElementById("finishButton").addEventListener("click", function(event) {
        localStorage.clear();
    });

    //Add an Quizz image
    const input_image = document.getElementById("inputFile")
    quizzImage = document.getElementById("quizzImage")
    document.getElementById("addimage").addEventListener("click", function(event) {
        input_image.click();

        var fr;
        let imageUrl;
        let storageImage;
        input_image.onchange = function (evt){
            var tgt = evt.target || window,
                files = tgt.files;
            
            if (FileReader && files && files.length) {
                fr = new FileReader();
                fr.onload = function () {
                    quizzImage.src = fr.result;
                    imageUrl = fr.result;
                    storageImage = localStorage.setItem("storageImage", imageUrl);
                }
                fr.readAsDataURL(files[0]);
            }
        }
    });

    //Escondemos el boton de Finish Quizz
    if(varAdd !== "1"){
        document.getElementById("finishQuizzQuestions").style.display = "none";
    }
//--------------------------------------------------------------------------------------------------------------------------------------------
    //Comprobamos que se haya introducido un titulo y descripcion e imagen
    let infoQuizz = localStorage.getItem("quizzInfo");
    infoQuizz = JSON.parse(infoQuizz);
    image = localStorage.getItem("storageImage");
    if(image !== null){
        quizzImage.src = image;
    }
    if(infoQuizz !== "null" && infoQuizz !== null){
        document.getElementById("titulo").value = infoQuizz["titulo"];
        document.getElementById("littledescription").innerHTML = infoQuizz["littledescription"];
    }

    document.getElementById("descripcion").addEventListener("submit", function(event) {
        event.preventDefault();

        //Comprobamos si se ha introducido los campos
        titulo = document.getElementById("titulo").value;
        littledescription = document.getElementById("littledescription").value;
        data = {
            "titulo": titulo,
            "littledescription": littledescription
        };

        // Convertir el objeto JSON a una cadena JSON
        var jsonData = JSON.stringify(data);
        localStorage.setItem("quizzInfo", jsonData);

        //Guardamos la imagen en LOCAL
        image = localStorage.getItem("storageImage");

        //Obtenemos la fecha de creación
        const fecha = new Date();
        let dia = fecha.getDate();
        let mes = fecha.getMonth() + 1;
        let año = fecha.getFullYear();
        let fechaCompleta = String(dia) + "-" + String(mes) + "-" + String(año);

        //Añadimos a la base de datos la informacion
        result = createQuizz(titulo, littledescription, image, "Angel", fechaCompleta, "rating", "timesPlayed");
        result.then(data =>{
            let quizzId = data;
            localStorage.setItem("quizzId", quizzId);
        })
    });
//--------------------------------------------------------------------------------------------------------------------------------------------
    function questionAdder(indicator){
        //Ir al siguiente JScript al clickar al boton
        document.getElementById("AddQuestioN").addEventListener("click", function(event) {
            event.preventDefault();
            window.location.href = "../create/create-questions.html";
        });

        var quizzIdFinal = localStorage.getItem("quizzId");
        getQuizz(quizzIdFinal)
            .then(data => {
                //Mostramos el cuadro de las preview
                if(indicator === "1"){
                    document.getElementById("goat2").style.display = "none";
                    let questionCount = 1;
                    for(let i=0; i<parseInt(numberofQuestions); i++){
                        //Añadimos el 0 al numero en la bola
                        if(questionCount < 10){
                            questionNumber = "0" + questionCount;
                        }else{
                            questionNumber = questionCount;
                        }

                        const Maincontainer = document.querySelector(".quizz-questions");
                        const questionscontainer = document.getElementById("goat");
                        const section = document.createElement('section');
                        section.classList.add('quizz-questions');
                        section.id = 'section' + i;
                        section.innerHTML = `<div class="question">
                        <div class="question-info">
                            <p id="questionTitleJS">${data.questions[i].question}</p>
                            <div class="num-of-question">
                                <h2>${questionNumber}</h2>
                            </div>  
                        </div>
                        <div class="answers">
                            <button class="cauldron-button"><span><img src="../../website-images/answer-options/cauldron.png"></span><span id="answer1JS">${data.questions[i].answer1}</span></button>
                            <button class="mage-staff-button"><span><img src="../../website-images/answer-options/mage-staff.png"></span><span id="answer2JS">${data.questions[i].answer2}</span></button>
                            <button class="mana-button"><span><img src="../../website-images/answer-options/mana.png"></span><span id="answer3JS">${data.questions[i].answer3}</span></button>
                            <button class="magic-ball-button"><span><img src="../../website-images/answer-options/magic-ball.png"></span><span id="answer4JS">${data.questions[i].answer4}</span></button>
                        </div>
                        </div>`;

                        questionCount++;
                        localStorage.setItem("questionCount", questionCount);
                        Maincontainer.appendChild(section); 
                    }
                }
            })
            .catch(error => {
                console.error(error); 
            });   
    }

    //Comprobamos si se ha añadido alguna pregunta
    if(varAdd !== "1"){
        const Maincontainer2 = document.querySelector(".quizquestions");
        const questionscontainer2 = document.getElementById("goat2");
        questionscontainer2.innerHTML = `<div class="noquestions">
        <div class="define">
            <h1>At the moment you dont have questions!</h1>
            <p></p>
            <h2>Click in the button below to add questions</h2>
        </div>
        </div>`;

        Maincontainer2.appendChild(questionscontainer2); 
    }
});