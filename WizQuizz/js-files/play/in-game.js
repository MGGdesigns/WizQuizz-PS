const music = new Audio('../../website-audio/play/in-game/in-game.mp3');
const correct = new Audio('../../website-audio/play/in-game/correct-answer.mp3');
const incorrect = new Audio('../../website-audio/play/in-game/incorrect-answer.mp3');

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
    let questions;
    try {
        const response = await fetch('../../data/play/in-game.json');
        const data = await response.json();
        questions = data.questions;
        totalQuestions = questions.length;
        renderQuestion(questions[0], 0);
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }

    

    let results = parseInt(localStorage.getItem("results")) || 0;
    let numofquestions = parseInt(localStorage.getItem("numofquestions")) || 0;
    function increaseNumOfQuestions(){
        numofquestions++;
        localStorage.setItem("numofquestions", numofquestions);
    } 

    function renderQuestion(question, index) {
        const section = document.createElement('section');
        section.classList.add('question');

        const leftSide = document.createElement('div');
        leftSide.classList.add('leftSide');

        if (question.image) {
            const image = document.createElement('img');
            image.src = question.image;
            image.width = 200;
            image.height = 200;
            image.classList.add('portrait');
            leftSide.appendChild(image);
        }

        const questionTitle = document.createElement('div');
        questionTitle.classList.add('questionTitle');
        questionTitle.innerHTML = `<p>${question.title}</p>`;

        const questionNumber = document.createElement('div');
        questionNumber.classList.add('questionNumber');
        questionNumber.innerHTML = `<p>${index + 1}</p>`;

        section.appendChild(leftSide);
        section.appendChild(questionTitle);
        section.appendChild(questionNumber);
        main.appendChild(section);

        const answersBox = document.createElement('section');
        answersBox.classList.add('answerBox');
        const answersDiv = document.createElement('div');
        answersDiv.classList.add('answers');
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerHTML = `<span><img src="${answer.icon}"></span><span>${answer.text}</span>`;
            button.classList.add(answer.class);
            if(answer.result === "correct-answer"){
                button.id = "correct-answer";
            }
            answersDiv.appendChild(button);
            
        });

        const nextButton = document.createElement('button');
        nextButton.classList.add('next-question');
        nextButton.id = "next-question";
        nextButton.innerHTML = '<span>Next Question</span>';
        const link = document.createElement('a');
        
        link.appendChild(nextButton);
        main.appendChild(answersBox);
        answersBox.appendChild(answersDiv);
        answersDiv.appendChild(nextButton);

        const nextQuestion = document.getElementById("next-question");
        nextQuestion.addEventListener('click', function() {
            if (index < totalQuestions - 1) {
                main.innerHTML = '';
                renderQuestion(questions[index + 1], index + 1);
            } else {
                window.location.href = 'quizz-finish.html';
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
                    increaseNumOfQuestions();
                    localStorage.setItem("results", results);
                });
            });    
    }
});