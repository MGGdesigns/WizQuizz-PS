import {
    getQuizz,
    getAllQuizzes,
    getQuizzField,
    getCurrentQuestion,
    nextQuestion,
    getInfoLobby, addScore,
    querySearch
} from "../../js-files/common/backend-functions.js";

const currentUrl = window.location.href.split('=');
const idQuizz = currentUrl[1];

const music = new Audio('../../website-audio/play/in-game/in-game.mp3');
const correct = new Audio('../../website-audio/play/in-game/correct-answer.mp3');
const incorrect = new Audio('../../website-audio/play/in-game/incorrect-answer.mp3');

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

window.onload = function() {
    music.play();

    window.addEventListener('focus', function() {
        music.play();
    });

    window.addEventListener('blur', function() {
        music.pause();
    });
    music.loop = true;
    music.volume = 0.4;
    fadeOutAudio(music, 129000);
};

function setCursor(cursor) {
    const allElements = document.querySelectorAll('*');

    if (cursor === 'Default') {
        allElements.forEach(element => {
            element.style.cursor = 'default';
        });
    } else if (cursor === 'Wand') {
        allElements.forEach(element => {
            element.style.cursor = 'url("../../website-images/common/wand-cursor.png"), auto';
        });
    }
}

function fadeOutAudio(audio, duration) {
    const intervalDuration = 50;
    const steps = duration / intervalDuration;
    const stepSize = audio.volume / steps;

    const fadeOutInterval = setInterval(() => {
        try{
            audio.volume -= stepSize;
        } catch {}
        if (audio.volume <= 0) {
            audio.pause();
            clearInterval(fadeOutInterval);
        }
    }, intervalDuration);
}


//BOTON DE MUTE MUSICA
document.getElementById("musicOn").style.display = "none";

document.getElementById("musicOf").addEventListener("click", function(event) {
    music.pause();
    document.getElementById("musicOf").style.display = "none";
    document.getElementById("musicOn").style.display = "block";
});
//BOTON DE UNMUTE MUSICA
document.getElementById("musicOn").addEventListener("click", function(event) {
    music.play();
    document.getElementById("musicOf").style.display = "block";
    document.getElementById("musicOn").style.display = "none";
});

document.addEventListener('DOMContentLoaded', async function() {
    const main = document.querySelector('main');
    let totalQuestions;
    let quizzData;
    let questionsNum;
    const correctArray = [];
    let results = parseInt(sessionStorage.getItem("results")) || 0;

    if(idQuizz !== "online"){
        await getQuizz(idQuizz).then((data) => {
            quizzData = data;
        });
    } else {
        const id = await querySearch("/lobbys/1/quizzId");
        quizzData = await getQuizz(id);
        console.log(quizzData);
    }
    

    totalQuestions = quizzData.questions.length;
   
    sessionStorage.setItem("totalQuestions", totalQuestions);
    
    await renderQuestion(0);
    
    async function renderQuestion(index) {
        document.getElementById("quizTitle").innerHTML = quizzData.title;

        const section = document.createElement('section');
        let questionCount;
        if(idQuizz !== "online"){
            questionCount = localStorage.getItem("questionCount") || 1;
        } else {
            questionCount = await querySearch("lobbys/1/currentQuestion");
        }

        if (questionCount < 10) {
            questionsNum = "0" + questionCount;
        } else {
            questionsNum = questionCount;
        }

        section.classList.add('question');
        section.innerHTML = ` <div class="leftSide">
                                <img src="${quizzData.questions[index].imageUrl}" width="200" height="200" class="portrait">
                            </div>
                            <div class="questionTitle">
                                <p> ${quizzData.questions[index].question}</p>
                            </div>
                            <div class="questionNumber">
                                <p> ${questionsNum} </p>
                            </div>`;
        questionCount++;
        localStorage.setItem("questionCount", questionCount);                    
        main.appendChild(section);

        const answersBox = document.createElement('section');
        answersBox.classList.add('answerBox');
        answersBox.innerHTML = `<div class="answers">
                                    <button class="cauldron-button"><span><img src="../../website-images/answer-options/cauldron-x45.png"></span><span>${quizzData.questions[index].answer1}</span></button>
                                    <button class="mage-staff-button"><span><img src="../../website-images/answer-options/mage-staff-x45.png"></span><span>${quizzData.questions[index].answer2}</span></button>
                                    <button class="mana-button"><span><img src="../../website-images/answer-options/mana-x45.png"></span><span>${quizzData.questions[index].answer3}</span></button>
                                    <button class="magic-ball-button"><span><img src="../../website-images/answer-options/magic-ball-x45.png"></span><span>${quizzData.questions[index].answer4}</span></button>
                                    <a href=""> <button class="next-question" id="next-question"> <span id = "next">Next Question</span></button></a>
                                </div>`;
        main.appendChild(answersBox);
        
        const correctButtonIndex = quizzData.questions[index].correctAnswers;
       
        correctArray.push(correctButtonIndex -1);
        const buttonSelector =  document.querySelectorAll('.cauldron-button, .mage-staff-button, .mana-button, .magic-ball-button');
        const correctAnswers = buttonSelector[correctButtonIndex -1];
        correctAnswers.id = "correct-answer";


        ///Voy loco
        function createPDFdoc(){
            const doc = new jsPDF();
            let docInfo = "";
            let text_height = 20;
            quizzData.questions.forEach((question, i) => {
                const pregunta = quizzData.questions[i].question;
                const respuesta1 = quizzData.questions[i].answer1;
                const respuesta2 = quizzData.questions[i].answer2;
                const respuesta3 = quizzData.questions[i].answer3;
                const respuesta4 = quizzData.questions[i].answer4;
                const questionLines = doc.splitTextToSize(pregunta, 140);

                // Pregunta
                doc.setFont('Poppins');
                doc.setFontStyle("bold");
                doc.setFontSize(16);
                doc.setTextColor(0, 0, 255);
                doc.text("Question nº " + (i + 1) + ":", 10, text_height);
                doc.setTextColor(0);

                // Enunciado de la pregunta
                doc.setFontSize(14);
                doc.setFontStyle("normal");
                doc.text(questionLines, 20, text_height + 10);

                // Respuestas
                const answers = [respuesta1, respuesta2, respuesta3, respuesta4];
                
                for (let j = 0; j < answers.length; j++) {
                    const y = text_height + 30 + j * 10;
                    if(j === correctArray[i]){
                        doc.setFillColor(0, 255, 0);
                        doc.rect(20, y - 4, 5, 5, "F");
                    }
                    
                    doc.text(answers[j], 30, y);
                }
                text_height += 80;
                if(text_height > 240){
                    doc.addPage();
                    text_height = 20;
                }
            });
            const pdfBase64 = doc.output('datauristring');
            sessionStorage.setItem("WizQuizz pdf", pdfBase64);   
        }
        

        const nextQuizzQuestion = document.getElementById("next-question");
        nextQuizzQuestion.addEventListener('click', async function () {
            event.preventDefault();
            if (index < totalQuestions - 1) {

                main.innerHTML = '';
                renderQuestion(index + 1);
            } else {
                localStorage.setItem("questionCount", 1);
                createPDFdoc();
                await nextQuestion();
                if(idQuizz === "online"){
                    window.location.href = 'quizz-finish.html?id=online';

                } else {
                    window.location.href = 'quizz-finish.html?id=' + idQuizz;
                }
            }

            if (sessionStorage.getItem("onlineHost", "Yes")) {
                nextQuestion();
            }
        });

        if (sessionStorage.getItem("onlinePlayer") === "Yes") {
            document.getElementById("next-question").style.display = "none";
            setInterval(checkCurrentQuestion, 1000)
        }

        const buttons = document.querySelectorAll('.answers button:not(.next-question)');
        const correctButton = document.getElementById("correct-answer");

        buttons.forEach(button => {
            button.style.transition = 'background-color 2s ease';
        });
        buttons.forEach(button => {
            button.addEventListener('click', async function(event) {
                if (button.disabled) {
                    return;
                }
                buttons.forEach(btn => {
                    if (btn !== button && btn !== correctButton) {
                        btn.style.opacity = '0.5';
                    }
                    btn.disabled = true;
                });
    
                if (button === correctButton) {
                    let countUsers = 0;
                    // await addScore(sessionStorage.getItem("onlineId"));
                    if (sessionStorage.getItem("onlinePlayer") === "Yes") {
                        await addScore(sessionStorage.getItem("onlineId"), 1);
                    } else {
                        results++;
                    }
                    correctButton.style.backgroundColor = '#28fc64';
                    music.volume = 0.1;
                    correct.volume = 0.9;
                    fadeOutAudio(correct, 3000);
                    correct.play().then(r => fadeOutAudio(incorrect, 3000));
                } else {
                    correctButton.style.backgroundColor = '#28fc64';
                    button.style.backgroundColor = '#FF3333';
                    music.volume = 0.1;
                    incorrect.volume = 0.9;
                    incorrect.play().then(r => fadeOutAudio(incorrect, 3000));
                }
                localStorage.setItem("results", results);
            });
        });

        if(sessionStorage.getItem("cursorView") === "Default"){
            setCursor('Default');
        }else if (sessionStorage.getItem("cursorView") === "Wand") {
            setCursor('Wand');
        }

        //CAMBIO DE IDIOMA -------------------------------
        let typeLanguage = sessionStorage.getItem("languageStorage");
        if(typeLanguage === "Spanish"){
        fetch("../../data/language/in-game/spanish.json")
        .then(response => response.json())
        .then(data => {
            document.getElementById("next").innerHTML = data.question.next;

        })
        }else if(typeLanguage === "English"){
        console.log("en");
        }
        //CAMBIO DE IDIOMA -------------------------------
    }

    let question = 0;

    async function checkCurrentQuestion() {
        getCurrentQuestion().then(data => {
            // console.log("Data.val():", data.val());
            // console.log("Question:", question);
            // console.log(totalQuestions);
            if (data.val() !== question) {
                if (question < totalQuestions) {
                    question = data.val();
                    console.log("Updated question:", question);
                    main.innerHTML = '';
                    renderQuestion(question - 1);
                } else {
                    if(idQuizz === "online"){
                        window.location.href = 'multijugador-finish.html';

                    } else {
                        window.location.href = 'quizz-finish.html?id='+ idQuizz;

                    }
                }
            }
        });
    }
});