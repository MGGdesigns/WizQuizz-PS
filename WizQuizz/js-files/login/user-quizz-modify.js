import {getQuizz, modifyQuizz, removeQuizz, modifyQuizzQuestions} from "../common/backend-functions.js"

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
});

//Comprobamos si estamos en DarkMode o LightMode
let screenMode = sessionStorage.getItem("screenMode") | 0;
if(sessionStorage.getItem("screenMode") === "1"){
    document.getElementById("toogle").checked = true;
    document.body.style.backgroundColor = '#292e39';
}else{
    document.getElementById("toogle").checked = false;
    document.body.style.backgroundColor = '#FFFFFF';
}

document.getElementById("circleMode").addEventListener('click', function(){
    if(screenMode === 0){
        screenMode = 1;
        document.body.style.backgroundColor = '#292e39';
        sessionStorage.setItem("screenMode", screenMode);
    }else{
        document.body.style.backgroundColor = '#FFFFFF';
        screenMode = 0;
        sessionStorage.setItem("screenMode", screenMode);
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    let quizId = localStorage.getItem("quizzId");
    const objectiveQuizz = await getQuizz(quizId);
    let numberofQuestions;
    let correctAnswer;

    //Mostramos las preguntas que tiene ese quizz
    await getQuizz(quizId)
        .then(data => {
            numberofQuestions = data.questions.length;
            let questionCount = 1;
            let questionNumber;
            //Mostramos el cuadro de las preview
            for(let i=0; i<parseInt(numberofQuestions); i++){
                correctAnswer = data.questions[0].correctAnswers;
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
                    <textarea class="questionTitleJS" id="questionTitleJS${i}">${data.questions[i].question}</textarea>
                    <div class="num-of-question">
                        <h2>${questionNumber}</h2>
                    </div>  
                </div>
                <div class="answers">
                    <button class="cauldron-button"><span><img src="../../website-images/answer-options/cauldron.png"></span><textarea class="answerX" id="answer1JS${i}">${data.questions[i].answer1}</textarea><input class="questionAnswer${i}" type="radio" name="correctanswer${i}"></button></button>
                    <button class="mage-staff-button"><span><img src="../../website-images/answer-options/mage-staff.png"></span><textarea class="answerX" id="answer2JS${i}">${data.questions[i].answer2}</textarea><input class="questionAnswer${i}" type="radio" name="correctanswer${i}"></button></button>
                    <button class="mana-button"><span><img src="../../website-images/answer-options/mana.png"></span><textarea class="answerX" id="answer3JS${i}">${data.questions[i].answer3}</textarea><input class="questionAnswer${i}" type="radio" name="correctanswer${i}"></button></button>
                    <button class="magic-ball-button"><span><img src="../../website-images/answer-options/magic-ball.png"></span><textarea class="answerX" id="answer4JS${i}">${data.questions[i].answer4}</textarea><input class="questionAnswer${i}" type="radio" name="correctanswer${i}"></button></button>
                </div>
                </div>`;

                Maincontainer.appendChild(section); 
                questionCount++;
            }
        })
        .catch(error => {
            console.error(error); 
        });  

    //Cambiar imagen
    let quizzImage;
    let imageUrl;
    const input_image = document.getElementById("inputFile")
    quizzImage = document.getElementById("quizzImage")
    document.getElementById("addimage").addEventListener("click", function(event) {
        input_image.click();

        var fr;
        let storageImage;
        input_image.onchange = function (evt){
            var tgt = evt.target || window,
                files = tgt.files;
            
            if (FileReader && files && files.length) {
                fr = new FileReader();
                fr.onload = function () {
                    quizzImage.src = fr.result;
                    imageUrl = fr.result;
                }
                fr.readAsDataURL(files[0]);
            }
        }
    });
    
    document.getElementById("titulo").value = objectiveQuizz.title;
    document.getElementById("quizzImage").src = objectiveQuizz.imageUrl;
    document.getElementById("categories").value = objectiveQuizz.category;
    document.getElementById("littledescription").value = objectiveQuizz.description;

    //Al hacer click en el boton de submit
    document.getElementById("descripcion").addEventListener("submit", function(event) {
        event.preventDefault();

        let finalTitulo = document.getElementById("titulo").value;
        let finalQuizzImage = quizzImage.src;
        let finalCategory = document.getElementById("categories").value;
        let finalDescription = document.getElementById("littledescription").value;
        
        modifyQuizz(quizId, finalTitulo, finalDescription, finalQuizzImage, objectiveQuizz.author, objectiveQuizz.submitDate, objectiveQuizz.rating, objectiveQuizz.timesReviewed, finalCategory)
    });
    
    //Boton para borrar quizz
    document.getElementById("removeQuizz").addEventListener("click", async function(event) {
        var resultado = window.confirm("¿Estás seguro de que deseas continuar?");
        if (resultado) {
            await removeQuizz(quizId);
            alert("Quizz removed correctly!");
            window.location.href = "../../index.html";
        }
    });

    //Reset localStorage when click on Finish button
    document.getElementById("finishButton").addEventListener("click", function(event) {
        for(let i=0; i<numberofQuestions; i++){
            let quizzId = localStorage.getItem("quizzId");
            let finalQuestion = document.getElementById("questionTitleJS" + i).value;
            let finalAnswer1 = document.getElementById("answer1JS" + i).value;
            let finalAnswer2 = document.getElementById("answer2JS" + i).value;
            let finalAnswer3 = document.getElementById("answer3JS" + i).value;
            let finalAnswer4 = document.getElementById("answer4JS" + i).value;
            let opciones = document.getElementsByClassName("questionAnswer" + i);
            var finalCorrectAnswers;
            for (let j=0; j<4; j++) {
                if (opciones[j].checked) {
                    finalCorrectAnswers = j+1;
                }
            }
            modifyQuizzQuestions(quizzId, i, finalAnswer1, finalAnswer2, finalAnswer3, finalAnswer4, finalCorrectAnswers, "../../website-images/common/insert-image.png", finalQuestion)
        }
        localStorage.clear();
    });
});