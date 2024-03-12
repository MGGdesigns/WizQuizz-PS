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

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.answers button:not(.next-question)');
    const correctButton = document.getElementById("correct-answer");
    const nextQuestion = document.getElementById("next-question");

    let results = parseInt(localStorage.getItem("results")) || 0;
    let numofquestions = parseInt(localStorage.getItem("numofquestions")) || 0;
    
    function increaseNumOfQuestions(){
        numofquestions++;
        localStorage.setItem("numofquestions", numofquestions);
    } 

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
    nextQuestion.addEventListener("click", function() {
        event.preventDefault();
        window.location.href = "../../src/play/quizz-finish.html";
    });
});