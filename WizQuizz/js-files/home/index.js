window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

document.addEventListener('DOMContentLoaded', async function() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    header.appendChild(await loadTemplate('main-header.html'));
    footer.appendChild(await loadTemplate('main-footer.html'));

    const menuIcon = document.querySelector('.mobile-bars');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon.addEventListener('click', function () {
        mobileMenu.classList.toggle('show-menu');
    });

    const [whoData, newsData] = await Promise.all([
        loadJSON('data/home/who_content.json'),
        loadJSON('data/home/news_content.json')
    ]);

    renderContent(whoData.info, '.about-us-content');
    renderContent(newsData.news, '.news-content');

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    //PRUEBA CAMBIAR IMAGEN---------------------------------------
    let actualUser = sessionStorage.getItem("actualUser");
    let actualUserMail = sessionStorage.getItem("userMail");
    let userImage = document.getElementById("userImage");

    if(actualUser === null){
        userImage.style.display = "none";
    }else{
        document.getElementById("signInButton").style.display = "none";
        userImage.src = sessionStorage.getItem("imageUrl");
        userImage.style.display = "block";
    }
    //PRUEBA CAMBIAR IMAGEN---------------------------------------
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
            div.classList.add('hidden');
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
                             <div class="news-description"><a href=""><h2>${item.headline}</h2></a>
                             <p>${item.description}</p></div>`;
        }
        container.appendChild(div);
    });
}

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

//Comprobamos si estamos en DarkMode o LightMode
if(sessionStorage.getItem("screenMode") === "1"){
    document.body.style.backgroundColor = '#292e39';
    document.getElementById("username").style.color = '#FFFFFF'
}else{
    document.body.style.backgroundColor = '#FFFFFF';
    document.getElementById("username").style.color = '#060100'
}