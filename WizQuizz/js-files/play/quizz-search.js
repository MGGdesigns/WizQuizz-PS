import {getAllQuizzes, getAllUsers, getUserQuizzes} from "../common/backend-functions.js";

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

    header.appendChild(await loadTemplate('../common/create-header.html'));
    footer.appendChild(await loadTemplate('../common/footer.html'));

    const menuIcon = document.querySelector('.mobile-bars');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon.addEventListener('click', function () {
        mobileMenu.classList.toggle('show-menu');
    });

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

    //BUSCAR USUARIO ---------------------------------------------
    
    const searchButton = document.getElementById("search-tab-button");
    document.getElementById("resultsContainer").style.display = "block";
    searchButton.addEventListener('click', async function () {
        var input = document.getElementById('search-tab-input').value.toString().trim();
        var foundUsers = [];
        const resultsContainer = document.getElementById("resultsContainer");
        resultsContainer.innerHTML = "";
        
        try {
            const users = await getAllUsers();
            for (const user of Object.values(users)) {
                if (user.username === input) {
                    foundUsers.push({email: user.email, username: input, imageUrl: user.imageUrl});
                } 
            }
            if (foundUsers.length === 0) {
                const userContainer = document.createElement("div");
                    userContainer.classList.add("userContainer");
                    userContainer.textContent = "User not found";
                    resultsContainer.appendChild(userContainer); 
                
            } else {
                foundUsers.forEach(async result => {
                    const userContainer = document.createElement("div");
                    userContainer.classList.add("userContainer");
                
                    const profileImage = document.createElement("img");
                    profileImage.src = result.imageUrl; 
                    profileImage.alt = "Profile Image";
                    profileImage.classList.add("users-found-profile-image");
                
                    userContainer.appendChild(profileImage);

                    var quizzByUser = await getUserQuizzes(result.username);
                    var usernameQuizzezNumber = 0;

                    if (quizzByUser=== null){
                        console.log("error");
                        usernameQuizzezNumber = 0;
                    } else {
                        let quizzOfUser = Object.keys(quizzByUser);
                        usernameQuizzezNumber = quizzOfUser.length;
                    }


                    ////
                    
                    const usernameInfo = document.createElement("div");
                    const usernameQuizzezInfo = document.createElement("div");
                    usernameQuizzezInfo.textContent = usernameQuizzezNumber;
                    const QuizzesPlayedText = document.createElement("div");
                    console.log(usernameQuizzezInfo);
                    usernameInfo.textContent = result.username;
                    QuizzesPlayedText.textContent = "Quizzes";
                    
                    if (usernameQuizzezNumber === 1){
                        QuizzesPlayedText.textContent = "Quizz";
                    }
                    usernameInfo.className = "usernameInfo";
                    usernameQuizzezInfo.className = "usernameQuizzezInfo";
                    QuizzesPlayedText.className = "QuizzesPlayedText";

                    userContainer.appendChild(usernameInfo);
                    userContainer.appendChild(usernameQuizzezInfo);
                    userContainer.appendChild(QuizzesPlayedText);

                    
                    
                    userContainer.classList.add("userContainer");
                    userContainer.addEventListener('click', async function() {
                        // Redirigir a la página deseada, por ejemplo, la página de perfil del usuario
                        sessionStorage.setItem("foundUserMail", result.email);
                        window.location.href = '../../src/login/user-profile.html';
                    });
                
                    resultsContainer.appendChild(userContainer); 
                    
                });
                
            }
        } catch (error) {
            alert(error);
        }
        //BUSCAR USUARIO ---------------------------------------------
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

let filtered = 0;
let quizzId = 0;

function renderContent(content, containerSelector) {
    const container = document.querySelector(containerSelector);
    const quizzIds = Object.keys(content);
    console.log(quizzIds)
    let countQuizz = 0;
    content.forEach(item => {
        const div = document.createElement('div');
        if (containerSelector === 'aside') {
            div.classList.add('filter');
            div.innerHTML = `<span><img src="${item.icon}" alt="NavIcon" width="64" height="64"></span>
                         <span>${item.text}</span>`;
            div.addEventListener('click', async () => {
                const quizzContainer = document.querySelector('.quizz-selection');
                quizzContainer.innerHTML = '';
                let quizz;
                let countFilteredQuizz = 1;
                let allQuizzes = await getAllQuizzes();
                for (quizz of Object.values(allQuizzes)) {
                    if (quizz.category === item.text) {
                        quizzId = countFilteredQuizz;
                        renderQuizz(quizz, '.quizz-selection');
                    }
                    countFilteredQuizz++;
                }
                const selected = document.getElementsByClassName('selected');
                if (selected.length === 0) {
                    div.classList.add('selected');
                } else {
                    selected[0].classList.remove('selected');
                    div.classList.add('selected');
                }
                const hiddenElements = document.querySelectorAll('.hidden');
                hiddenElements.forEach((el) => observer.observe(el));
            });
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

function renderQuizz(content, containerSelector) {
    const container = document.querySelector(containerSelector);
    const div = document.createElement('div');
    if (containerSelector === '.quizz-selection') {
        div.classList.add('quizz');
        div.classList.add('hidden');
        div.innerHTML = `<a href="quizz-preview.html?id=${quizzId}">
                        <img src="${content.imageUrl}" width="400" height="225" class="image">
                        <h2>${content.title}</h2>
                        </a>`;
    }
    container.appendChild(div);
}

const clearFilters = document.querySelector('.clear-filters');
clearFilters.addEventListener('click', async async => {
    const selected = document.getElementsByClassName('selected');
    filtered = 0;
    if (selected.length !== 0) {
        selected[0].classList.remove('selected');
    }
    const quizzes = await getAllQuizzes();
    const quizzContainer = document.querySelector('.quizz-selection');
    quizzContainer.innerHTML = '';
    renderContent(quizzes, '.quizz-selection');
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
});

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

//Comprobamos si estamos en DarkMode o LightMode
console.log(sessionStorage.getItem("screenMode"));
if(sessionStorage.getItem("screenMode") === "1"){
    console.log("dark");
    document.body.style.backgroundColor = '#292e39';
}else{
    console.log("light");
    document.body.style.backgroundColor = '#FFFFFF';
}