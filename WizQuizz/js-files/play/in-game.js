import {getQuizz, getAllQuizzes} from "../../js-files/common/backend-functions.js";

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

function fadeOutAudio(audio, duration) {
    const intervalDuration = 50;
    const steps = duration / intervalDuration;
    const stepSize = audio.volume / steps;

    const fadeOutInterval = setInterval(() => {
        audio.volume -= stepSize;
        if (audio.volume <= 0) {
            audio.pause();
            clearInterval(fadeOutInterval);
        }
    }, intervalDuration);
}

document.addEventListener('DOMContentLoaded', async function() {
    const main = document.querySelector('main');
    let totalQuestions;
    let quizzData;
    let questionsNum;
    let results = parseInt(sessionStorage.getItem("results")) || 0;

    await getQuizz(idQuizz).then((data) => {
        quizzData = data;
    });

    totalQuestions = quizzData.questions.length ;
   
    sessionStorage.setItem("totalQuestions", totalQuestions);
    
    renderQuestion(0);
    
    function renderQuestion(index) {
        const section = document.createElement('section');
        let questionCount = localStorage.getItem("questionCount") || 1;
        console.log(questionCount);
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
                                    <a href=""> <button class="next-question" id="next-question"> <span>Next Question</span></button></a>
                                </div>`;
        main.appendChild(answersBox);
        
        const correctButtonIndex = quizzData.questions[index].correctAnswers;
        const buttonSelector =  document.querySelectorAll('.cauldron-button, .mage-staff-button, .mana-button, .magic-ball-button');
        const correctAnswers = buttonSelector[correctButtonIndex -1];
        correctAnswers.id = "correct-answer";

        const nextQuestion = document.getElementById("next-question");
        nextQuestion.addEventListener('click', function() {
            event.preventDefault();
            if (index < totalQuestions - 1) {
                main.innerHTML = '';
                renderQuestion(index + 1);
            } else {
                localStorage.setItem("questionCount", 1);
                window.location.href = 'quizz-finish.html?id='+ idQuizz;
            }
        });

        const buttons = document.querySelectorAll('.answers button:not(.next-question)');
        const correctButton = document.getElementById("correct-answer");

        buttons.forEach(button => {
            button.style.transition = 'background-color 2s ease';
        });
        buttons.forEach(button => {
            button.addEventListener('click', function(event) {
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
                    correctButton.style.backgroundColor = '#28fc64';
                    music.volume = 0.1;
                    correct.volume = 0.9;
                    fadeOutAudio(correct, 3000);
                    correct.play().then(r => fadeOutAudio(incorrect, 3000));
                    results++;
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
    }
});