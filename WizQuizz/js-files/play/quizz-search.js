import {getAllQuizzes, getUserQuizzes, getQuizz, getUserByName} from "../common/backend-functions.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

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

const quizzData = [];

const observer = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

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

    const [filtersData] = await Promise.all([
        loadJSON('../../data/play/filters_content.json'),
    ]);

    renderContent(filtersData.filters, 'aside');
    getAllQuizzes().then((data) => {
        renderContent(data, '.quizz-wrapper');
        const sortedQuizzes = Object.values(data).sort((a, b) => b.rating - a.rating);
        const topQuizzes = sortedQuizzes.slice(0, 3);
        renderTopQuizzes(topQuizzes, '.top-quizz-wrapper');
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
            //Buscamos el ususario
            console.log(input)
            let user
            try {
                 user = await getUserByName(input);
            } catch{
                const userContainer = document.createElement("div");
                    userContainer.classList.add("UserNotfoundContainer");
                    userContainer.textContent = "User not found";
                    resultsContainer.appendChild(userContainer); 
            }
            
            if (user) {
                foundUsers.push(user);
            }

            //Si el usuario no existe
            if (foundUsers.length === 0 || !user) {
                const userContainer = document.createElement("div");
                    userContainer.classList.add("UserNotfoundContainer");
                    userContainer.textContent = "User not found";
                    resultsContainer.appendChild(userContainer); 
            
            //Preview de usuarios encontrados
            } else {
                for (const result of foundUsers) {
                    const userContainer = document.createElement("div");
                    userContainer.classList.add("userContainer");

                    //Imagen de perfil
                    const profileImage = document.createElement("img");
                    profileImage.src = result.imageUrl;
                    profileImage.alt = "Profile Image";
                    profileImage.classList.add("users-found-profile-image");
                    userContainer.appendChild(profileImage);
                    /*
                    //Numero de usuarios
                    var userListFollowers = result.following;
                    console.log(userListFollowers)
                    var usernameFollowersNumber = userListFollowers.length;
                    const usernameFollowersInfo = document.createElement("div");
                    usernameFollowersInfo.textContent = foundUsers + " Followers";
                    if (usernameFollowersNumber === 1){
                        usernameFollowersInfo.textContent = foundUsers + " Follower";
                    }

                    usernameFollowersInfo.textContent = foundUsers;
                    usernameFollowersInfo.className = "usernameFollowersInfo";
                    */

                    //Quizzes del usuario
                    var quizzByUser = await getUserQuizzes(result.username);
                    var usernameQuizzezNumber = 0;

                    if (quizzByUser=== null){
                        usernameQuizzezNumber = 0;
                    } else {
                        let quizzOfUser = Object.keys(quizzByUser);
                        usernameQuizzezNumber = quizzOfUser.length;
                    }

                    const usernameQuizzezInfo = document.createElement("div");
                    const QuizzesPlayedText = document.createElement("div");
                    usernameQuizzezInfo.className = "usernameQuizzezInfo";
                    QuizzesPlayedText.className = "QuizzesPlayedText";
                    usernameQuizzezInfo.textContent = usernameQuizzezNumber;
                    QuizzesPlayedText.textContent = "Quizzes";

                    if (usernameQuizzezNumber === 1){
                        QuizzesPlayedText.textContent = "Quizz";
                    }

                    //Nombre de usuario
                    const usernameInfo = document.createElement("div");
                    usernameInfo.textContent = result.username;
                    usernameInfo.className = "usernameInfo";

                    //Añadimos los elementos
                    userContainer.appendChild(usernameInfo);
                    //userContainer.appendChild(usernameFollowersInfo);
                    userContainer.appendChild(usernameQuizzezInfo);
                    userContainer.appendChild(QuizzesPlayedText);

                    userContainer.classList.add("userContainer");

                    //Al hacer click vamos al player profile del usuario seleccionado
                    userContainer.addEventListener('click', async function() {
                        window.location.href = "../login/player-profile.html?id=" + result.username;
                    });
                    resultsContainer.appendChild(userContainer);
                    if(sessionStorage.getItem("cursorView") === "Default"){
                        setCursor('Default');
                    }else if (sessionStorage.getItem("cursorView") === "Wand") {
                        setCursor('Wand');
                    }
                }
            }

        //En caso de error se imprime por consola
        } catch (error) {
            console.log(error);
        }

        //BUSCAR USUARIO ---------------------------------------------
    });

    //CAMBIO DE IDIOMA -------------------------------
    let typeLanguage = sessionStorage.getItem("languageStorage");
    if(typeLanguage === "Spanish"){
    fetch("../../data/language/quizz-search/spanish.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("clear").innerHTML = data.filters.clear;
        document.getElementById("filter1").innerHTML = data.filters.filter1;
        document.getElementById("filter2").innerHTML = data.filters.filter2;
        document.getElementById("filter3").innerHTML = data.filters.filter3;
        document.getElementById("filter4").innerHTML = data.filters.filter4;
        document.getElementById("filter5").innerHTML = data.filters.filter5;
        document.getElementById("filter6").innerHTML = data.filters.filter6;
        document.getElementById("filter7").innerHTML = data.filters.filter7;
        document.getElementById("filter8").innerHTML = data.filters.filter8;
        document.getElementById("filter9").innerHTML = data.filters.filter9;
        document.getElementById("filter10").innerHTML = data.filters.filter10;
        document.getElementById("filter11").innerHTML = data.filters.filter11;
        document.getElementById("filter12").innerHTML = data.filters.filter12;
        document.getElementById("filter13").innerHTML = data.filters.filter13;
        document.getElementById("filter14").innerHTML = data.filters.filter14;
        document.getElementById("filter15").innerHTML = data.filters.filter15;
        document.getElementById("title1").innerHTML = data.banner1.title1;
        document.getElementById("title2").innerHTML = data.banner2.title2;
        document.getElementById("search-tab-input").setAttribute("placeholder" , data.searcher.writeHere);

    })
    }else if(typeLanguage === "English"){
    console.log("en");
    }
    //CAMBIO DE IDIOMA -------------------------------
});

//BUSCAR QUIZZ ----------------------------------------------------------------------------------
let selectedQuizzes = []
    
const searchQuizzButton = document.getElementById("search-quizz-button");
document.getElementById("resultsContainer").style.display = "block";
searchQuizzButton.addEventListener('click', async function () {

        const quizzResultsContainer = document.getElementById("quizzResultsContainer");
        quizzResultsContainer.innerHTML="";
        quizzResultsContainer.classList.add("quizz-wrapper")
    
        var input = document.getElementById('search-tab-input').value.toString().trim();        
        const quizzes = await getAllQuizzes();
        let found = Object.values(quizzes).find(quizz => quizz.title === input)
        selectedQuizzes.push(found)

        for (const result of selectedQuizzes) {

            //Contenedor del quizz
            const quizzContainer = document.createElement("div");
            quizzContainer.classList.add('quizz');
            quizzContainer.style.width = "400px";
            quizzContainer.style.height = "380px";
            quizzContainer.style.display = "flex";
            quizzContainer.style.flexDirection = "column";

            //Titulo
            const quizzTitle = document.createElement("h2");
            quizzTitle.textContent = result.title;
            quizzTitle.style.textAlign = "center";
            quizzContainer.appendChild(quizzTitle);

            //Autor
            const authorContainer = document.createElement("div");
            authorContainer.style.marginBottom = "10px";
            authorContainer.style.textAlign = "left";
            authorContainer.style.fontFamily = "Poppins";
            authorContainer.style.color = "#FFFF";
            const quizzAuthor = document.createElement("p");
            quizzAuthor.textContent = "Author: " + result.author;
            authorContainer.appendChild(quizzAuthor);
            quizzContainer.appendChild(authorContainer);

            //Numero de preguntas y puntuacion
            const infoContainer = document.createElement("div");
            infoContainer.style.display = "flex";
            infoContainer.style.justifyContent = "space-between";
            infoContainer.style.alignItems = "center";
            infoContainer.style.fontFamily = "Poppins";
            infoContainer.style.color = "#FFFF";
            const quizzSize = document.createElement("p");
            quizzSize.textContent = "Number of Questions: " + result.questions.length;
            infoContainer.appendChild(quizzSize);

            const starsHTML = Array.from({ length: 5 }, (_, index) => {
                if (index < Math.round(result.rating)) {
                    return '<i class="fa fa-star enable" aria-hidden="true"></i>';
                } else {
                    return '<i class="fa fa-star disable" aria-hidden="true"></i>';
                }
            }).join('');

            const ratingStars = document.createElement("div");
            ratingStars.classList.add("rating-stars");
            ratingStars.innerHTML = starsHTML;
            infoContainer.appendChild(ratingStars);

            quizzContainer.appendChild(infoContainer);

            //Imagen de perfil
            const quizzImage = document.createElement("img");
            quizzImage.src = result.imageUrl;
            quizzImage.alt = "Quizz Image";
            quizzImage.style.width = "98%";
            quizzImage.style.height = "70%";
            quizzImage.style.marginBottom = "10px";
            quizzImage.style.marginRight = "10px";
            quizzImage.style.marginTop = "10px";
            quizzContainer.appendChild(quizzImage);

            const quizzLink = document.createElement("a");

            const ident = quizzData.find(item => item.quizzname === result.title)?.id;
            quizzLink.href = "quizz-preview.html?id=" + ident;
            quizzLink.appendChild(quizzContainer);
            quizzResultsContainer.appendChild(quizzLink);
            if(sessionStorage.getItem("cursorView") === "Default"){
                setCursor('Default');
            }else if (sessionStorage.getItem("cursorView") === "Wand") {
                setCursor('Wand');
            }
        }
});

    //BUSCAR QUIZZ ----------------------------------------------------------
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
    let countQuizz = 0;
    let count = 1;
    content.forEach(item => {
        quizzData.push({quizzname: item.title, id: quizzIds[countQuizz]})
        
        
        const div = document.createElement('div');
        if (containerSelector === 'aside') {
            div.classList.add('filter');
            div.innerHTML = `<span><img src="${item.icon}" alt="NavIcon" width="64" height="64"></span>
                         <span id = "filter${count}">${item.text}</span>`;
            div.addEventListener('click', async () => {
                const quizzContainer = document.querySelector('.quizz-wrapper');
                quizzContainer.innerHTML = '';
                let quizz;
                let countFilteredQuizz = 1;
                let allQuizzes = await getAllQuizzes();
                for (quizz of Object.values(allQuizzes)) {
                    if (quizz.category === item.text) {
                        quizzId = countFilteredQuizz;
                        renderQuizz(quizz, '.quizz-wrapper');
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
        } else if (containerSelector === '.quizz-wrapper') {
            div.classList.add('quizz');
            div.classList.add('hidden');
            div.innerHTML = `<a href="quizz-preview.html?id=${quizzIds[countQuizz]}">
                        <img src="${item.imageUrl}" width="384" height="216" class="image">
                        <h2>${item.title}</h2>
                        </a>`;
            countQuizz++;
        }
        container.appendChild(div);
        count++;
    });
    if(sessionStorage.getItem("cursorView") === "Default"){
        setCursor('Default');
    }else if (sessionStorage.getItem("cursorView") === "Wand") {
        setCursor('Wand');
    }
}

function renderQuizz(content, containerSelector) {
    const container = document.querySelector(containerSelector);
    const div = document.createElement('div');
    if (containerSelector === '.quizz-wrapper') {
        div.classList.add('quizz');
        div.classList.add('hidden');
        div.innerHTML = `<a href="quizz-preview.html?id=${quizzId}">
                        <img src="${content.imageUrl}" width="384" height="216" class="image">
                        <h2>${content.title}</h2>
                        </a>`;
    quizzData.push({quizzname: content.title, id: quizzId})
    }
    container.appendChild(div);
    if(sessionStorage.getItem("cursorView") === "Default"){
        setCursor('Default');
    }else if (sessionStorage.getItem("cursorView") === "Wand") {
        setCursor('Wand');
    }
}

async function renderTopQuizzes(content, containerSelector) {
    let countTop = 0;
    const container = document.querySelector(containerSelector);
    const topData = await loadJSON('../../data/play/podium.json');
    content.forEach((quizz) => {
        const div = document.createElement('div');
        const quizzDataIndex = quizzData.findIndex(item => item.quizzname === quizz.title);
        const quizzId = quizzDataIndex !== -1 ? quizzData[quizzDataIndex].id : null;
        if (quizzId) {
            div.classList.add('top-quizz');
            div.classList.add('hidden');
            div.innerHTML = `<img class="medal" src="${topData.top[countTop].icon}" width="32" height="32" class="image">
                            <a href="quizz-preview.html?id=${quizzId}">
                            <img src="${quizz.imageUrl}" width="288" height="162" class="image">
                            <h2>${quizz.title}</h2>
                            </a>`;
            countTop++;
            container.appendChild(div);
        }
    });
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
    if(sessionStorage.getItem("cursorView") === "Default"){
        setCursor('Default');
    }else if (sessionStorage.getItem("cursorView") === "Wand") {
        setCursor('Wand');
    }
}

const clearFilters = document.querySelector('.clear-filters');
clearFilters.addEventListener('click', async async => {
    const selected = document.getElementsByClassName('selected');
    filtered = 0;
    if (selected.length !== 0) {
        selected[0].classList.remove('selected');
    }
    const quizzes = await getAllQuizzes();
    const quizzContainer = document.querySelector('.quizz-wrapper');
    quizzContainer.innerHTML = '';
    renderContent(quizzes, '.quizz-wrapper');
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));
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

