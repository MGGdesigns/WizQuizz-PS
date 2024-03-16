import {getQuizz} from "../common/backend-functions.js";

const currentUrl = window.location.href.split('=');
const idQuizz = currentUrl[1];

document.addEventListener('DOMContentLoaded', async function() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    header.appendChild(await loadTemplate('../common/create-header.html'));
    footer.appendChild(await loadTemplate('../common/footer.html'));

    getQuizz(idQuizz).then((data) => {
        renderDescriptionContent(data, '.preview');
        renderQuestionsContent(data.questions, '.quizz-questions');
        const hiddenElements = document.querySelectorAll('.hidden');
        hiddenElements.forEach((el) => observer.observe(el));
    });
});

async function loadTemplate(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
    }
    const text = await response.text();
    const template = document.createElement('template');
    template.innerHTML = text;
    return document.importNode(template.content, true);
}

async function loadJSON(file) {
    const response = await fetch(file);
    if (!response.ok) {
        throw new Error(`Failed to fetch JSON: ${response.statusText}`);
    }
    return response.json();
}

function renderQuestionsContent(content, containerSelector) {
    const container = document.querySelector(containerSelector);
    let questionsCount = 1;
    content.forEach(item => {
        let questionsNum;
        const section = document.createElement('section');
        if (containerSelector === '.quizz-questions') {
            if (questionsCount < 10) {
                questionsNum = '0' + questionsCount;
            } else {
                questionsNum = questionsCount;
            }
            section.classList.add('question');
            section.classList.add('hidden');
            section.innerHTML = `<div class="question-info">
                         <p>${item.question}</p>
                         <div class="num-of-question">
                             <h2>${questionsNum}</h2>
                         </div>
                     </div>
                     <div class="answers">
                     <button class="cauldron-button"><span><img src="../../website-images/answer-options/cauldron.png"></span><span>${item.answer1}</span></button>
                     <button class="mage-staff-button"><span><img src="../../website-images/answer-options/mage-staff.png"></span><span>${item.answer2}</span></button>
                     <button class="mana-button"><span><img src="../../website-images/answer-options/mana.png"></span><span>${item.answer3}</span></button>
                     <button class="magic-ball-button"><span><img src="../../website-images/answer-options/magic-ball.png"></span><span>${item.answer4}</span></button>
                    </div>`;
        }
        questionsCount++;
        container.appendChild(section);
    });
}

function renderDescriptionContent(content, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (containerSelector === '.preview') {
        const section = document.createElement('section');
        const aux_section = document.createElement('section');
        section.classList.add('quizz-info');
        section.innerHTML = `<img src="${content.imageUrl}" width="560" height="315">
                     <div class="quizz-lower-info">
                         <div class="additional-info">
                             <p>Author: ${content.author}</p>
                             <p>Submit date: ${content.submitDate}</p>
                         </div>
                         <a href="in-game.html?id=${idQuizz}"><input class="quizz-start-button" type="button" value="START GAME"></a>
                     </div>`;

        aux_section.classList.add('quizz-description');
        aux_section.innerHTML = `<h1>${content.title}</h1>
                                <p>${content.description}</p>`;
        container.appendChild(section);
        container.appendChild(aux_section);
    }
}

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});
