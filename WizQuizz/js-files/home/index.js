document.addEventListener('DOMContentLoaded', async function() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    header.appendChild(await loadTemplate('../common/main-header.html'));
    footer.appendChild(await loadTemplate('../common/footer.html'));

    const [whoData, newsData] = await Promise.all([
        loadJSON('../../data/home/who_content.json'),
        loadJSON('../../data/home/news_content.json')
    ]);

    renderContent(whoData.info, '.about-us-content');
    renderContent(newsData.news, '.news-content');
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
    let count_news = 0;
    content.forEach(item => {
        const div = document.createElement('div');
        if (containerSelector === '.about-us-content') {
            div.classList.add('about-us-info');
            if (count_news % 2 === 0) {
                div.innerHTML = `<img src="${item.image}" width="320" height="180" class="image" alt="">
                                <p>${item.text}</p>`;
                count_news++;
            } else {
                div.innerHTML = `<p>${item.text}</p>
                                <img src="${item.image}" width="320" height="180" class="image" alt="">`;
                count_news++;
            }
        } else if (containerSelector === '.news-content') {
            div.classList.add('new');
            div.innerHTML = `<a href=""><img src="${item.image}" width="560" height="315" alt=""></a>
                             <a href=""><h2>${item.headline}</h2></a>
                             <p>${item.description}</p>`;
        }
        container.appendChild(div);
    });
}