import {getAllQuizzes} from "../common/backend-functions.js";

console.log(getAllQuizzes());
document.addEventListener('DOMContentLoaded', async function() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    header.appendChild(await loadTemplate('../common/create-header.html'));
    footer.appendChild(await loadTemplate('../common/footer.html'));

    const [filtersData, quizzData] = await Promise.all([
        loadJSON('../../data/play/filters_content.json'),
        loadJSON('../../data/play/quizz_content.json')
    ]);

    renderContent(filtersData.filters, 'aside');
    getAllQuizzes().then((data) => {
        renderContent(data, '.quizz-selection');
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

function renderContent(content, containerSelector) {
    const container = document.querySelector(containerSelector);
    const quizzIds = Object.keys(content);
    let countQuizz = 0;
    content.forEach(item => {
        const div = document.createElement('div');
        if (containerSelector === 'aside') {
            div.classList.add('filter');
            div.innerHTML = `<span><img src="${item.icon}" alt="NavIcon" width="64" height="64"></span>
                         <span>${item.text}</span>`;
        } else if (containerSelector === '.quizz-selection') {
            div.classList.add('quizz');
            div.classList.add('hidden');
            div.innerHTML = `<a href="quizz-preview.html?id=${quizzIds[countQuizz]}">
                        <img src="${item.imageUrl}" width="400" height="225" class="image">
                        <h2>${item.title}</h2>
                        </a>`;
            countQuizz++;
        }
        container.appendChild(div);
    });
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