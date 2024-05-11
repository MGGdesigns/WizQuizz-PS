import {getQuizz, updateRating} from "../common/backend-functions.js";


const currentUrl = window.location.href.split('=');
const quizzId = currentUrl[1];

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () =>{
        document.body.removeChild(loader);
    })
})

sessionStorage.setItem("onlinePlayer", "No");
sessionStorage.setItem("onlineHost", "No");

if(sessionStorage.getItem("cursorView") === "Default"){
    setCursor('Default');
}else if (sessionStorage.getItem("cursorView") === "Wand") {
    setCursor('Wand');
}

document.addEventListener('DOMContentLoaded', async function() {

    const menuIcon = document.querySelector('.mobile-bars');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon.addEventListener('click', function () {
        mobileMenu.classList.toggle('show-menu');
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

    const finish = document.getElementById("finish");
    const mark = document.getElementById("mark");
    const exit = document.getElementById("exit");
    const download = document.getElementById("download");
    var resultado = localStorage.getItem("results");
    var numofquestions = sessionStorage.getItem("totalQuestions");
    var varInteger = parseInt(numofquestions);

    const currentUrl = window.location.href.split('=');
    const idQuizz = currentUrl[1];

    //CAMBIO DE IDIOMA -------------------------------
    let typeLanguage = sessionStorage.getItem("languageStorage");
    if(typeLanguage === "Spanish"){
    fetch("../../data/language/finish-quizz/spanish.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("exit").value = data.buttons.play;
        document.getElementById("download").value = data.buttons.download;
        document.getElementById("review").innerHTML = data.right.review;

        if(resultado >= varInteger/2){
            finish.innerHTML = data.left.good;
            description.innerHTML = data.left.textGood;
            mark.innerHTML = resultado + "/" + numofquestions;
        }else{
            finish.innerHTML = data.left.bad;
            description.innerHTML = data.left.textBad;
            mark.innerHTML = resultado  + "/" + numofquestions;
        }
        if(resultado === null){
            mark.innerHTML = "Leave";
        }

    })
    }else{
        if(resultado >= varInteger/2){
            finish.innerHTML = "Congratulations!";
            description.innerHTML = "Congratulations! You have passed the quiz. You are a phenomenon, thank you very much for demonstrating your skills on WizQuizz!";
            mark.innerHTML = resultado + "/" + numofquestions;
        }else{
            finish.innerHTML = "Bad Luck!";
            description.innerHTML = "You failed... but nothing happens, don't be discouraged. Keep trying and you will see how little by little you learn and manage to pass, cheer up!";
            mark.innerHTML = resultado  + "/" + numofquestions;
        }
        if(resultado === null){
            mark.innerHTML = "Leave";
        }
    }
    //CAMBIO DE IDIOMA -------------------------------

    if(sessionStorage.getItem("cursorView") === "Default"){
        setCursor('Default');
    }else if (sessionStorage.getItem("cursorView") === "Wand") {
        setCursor('Wand');
    }

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

    localStorage.clear();
    download.addEventListener("click", function() {
        event.preventDefault();
        console.log("pulsado download");
        const pdfBase64 = sessionStorage.getItem("WizQuizz pdf");
        console.log(pdfBase64);
        const link = document.createElement('a');
        link.href = pdfBase64;
        link.download = 'WizQuizz pdf';
        link.click()
        
    });

    exit.addEventListener("click", function() {
        event.preventDefault();
        window.location.href = "../../src/play/quizz-preview.html?id=" + idQuizz;
    });
});

let quizzRating = 0;
let quizzTimesReviewed = 0;

getQuizz(quizzId).then((data) => {
    quizzRating = data.rating;
    quizzTimesReviewed = data.timesReviewed;
});

console.log(quizzRating);
console.log(quizzTimesReviewed);

const stars = document.querySelectorAll('.star-rating i');
let rating = 0;

stars.forEach((star, index) => {
    star.addEventListener('mouseover', function() {
        const hoveredRating = parseInt(this.getAttribute('data-rating'));
        if (rating === 0) {
            stars.forEach((star, i) => {
                if (i < hoveredRating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
        console.log("Hovered rating:", hoveredRating);
    });

    star.addEventListener('click', handleClick);
});

function handleClick() {
    rating = parseInt(this.getAttribute('data-rating'));
    stars.forEach((star) => {
        star.removeEventListener('click', handleClick);
    });
    stars.forEach((star, i) => {
        if (i < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    console.log("Current rating:", rating);
    quizzRating = (quizzRating * quizzTimesReviewed + rating)
    quizzTimesReviewed += 1;
    quizzRating = quizzRating / quizzTimesReviewed
    console.log(quizzRating)
    updateRating(quizzId, quizzRating, quizzTimesReviewed);
}


//Comprobamos si estamos en DarkMode o LightMode
console.log(sessionStorage.getItem("screenMode"));
if(sessionStorage.getItem("screenMode") === "1"){
    console.log("dark");
    document.body.style.backgroundColor = '#292e39';
    document.getElementById('infoaboutQuizzes').style.color = '#FFFFFF';
}else{
    console.log("light");
    document.body.style.backgroundColor = '#FFFFFF';
}