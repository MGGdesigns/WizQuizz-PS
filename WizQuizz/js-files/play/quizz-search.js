import {getAllQuizzes, getUserQuizzes, getQuizz, getUserByName} from "../common/backend-functions.js";

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

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
                }
            }

        //En caso de error se imprime por consola
        } catch (error) {
            console.log(error);
        }

        //BUSCAR USUARIO ---------------------------------------------
    });
});

//BUSCAR QUIZZ ----------------------------------------------------------------------------------
let selectedQuizzes = []
    
const searchQuizzButton = document.getElementById("search-quizz-button");
document.getElementById("resultsContainer").style.display = "block";
searchQuizzButton.addEventListener('click', async function () {

        const quizzResultsContainer = document.getElementById("quizzResultsContainer");
        quizzResultsContainer.innerHTML="";
        quizzResultsContainer.classList.add("quizz-selection")
    
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

            //Titulp
            const quizzTitle = document.createElement("h2");
            quizzTitle.textContent = result.title;
            quizzTitle.style.textAlign = "center";
            quizzContainer.appendChild(quizzTitle);

            //Autor
            const authorContainer = document.createElement("div");
            authorContainer.style.marginBottom = "10px";
            authorContainer.style.textAlign = "left";
            const quizzAuthor = document.createElement("p");
            quizzAuthor.textContent = "Author: " + result.author;
            authorContainer.appendChild(quizzAuthor);
            quizzContainer.appendChild(authorContainer);

            //Numero de preguntas y puntuacion
            const infoContainer = document.createElement("div");
            infoContainer.style.display = "flex";
            infoContainer.style.justifyContent = "space-between";
            infoContainer.style.alignItems = "center";
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
    content.forEach(item => {
        quizzData.push({quizzname: item.title, id: quizzIds[countQuizz]})
        
        
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
    console.log(content.title)
    console.log(quizzId)
    console.log("ahora")
    quizzData.push({quizzname: content.title, id: quizzId})
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

//Comprobamos si estamos en DarkMode o LightMode
console.log(sessionStorage.getItem("screenMode"));
if(sessionStorage.getItem("screenMode") === "1"){
    console.log("dark");
    document.body.style.backgroundColor = '#292e39';
}else{
    console.log("light");
    document.body.style.backgroundColor = '#FFFFFF';
} 