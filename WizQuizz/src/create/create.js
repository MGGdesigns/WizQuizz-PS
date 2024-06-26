import {createQuizz, getQuizz, getAllUsers} from "../../js-files/common/backend-functions.js";

//Comprobamos si estamos en DarkMode o LightMode
if(sessionStorage.getItem("screenMode") === "1"){
    document.body.style.backgroundColor = '#292e39';
}else{
    document.body.style.backgroundColor = '#FFFFFF';
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

//LO DE CAMBIAR LA IMAGEN
document.addEventListener('DOMContentLoaded', async function() {
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
});

window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    loader.classList.add("loader-hidden");

    loader.addEventListener("transitioned", () =>{
        document.body.removeChild("loader");
    })
})

document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.querySelector('.mobile-bars');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuIcon.addEventListener('click', function () {
        mobileMenu.classList.toggle('show-menu');
    });

    //Variables
    var localCloudQuestions = localStorage.getItem("questionsInfo");
    var parsedData = JSON.parse(localCloudQuestions);
    let result;
    let varAdd = localStorage.getItem("varAdd");
    let numberofQuestions = localStorage.getItem("numberofQuestions");
    let titulo;
    let littledescription;
    let quizzCategory;
    let quizzCategoryStorage;
    let data;
    let image;
    let quizzImage;
    let questionNumber;
    let check = localStorage.getItem("check") || 0;
    
    //Llamadas a funciones
    questionAdder(varAdd);

    //Reset localStorage when click on Finish button
    document.getElementById("finishButton").addEventListener("click", function(event) {
        localStorage.clear();
    });

    //Add an Quizz image
    const input_image = document.getElementById("inputFile")
    quizzImage = document.getElementById("quizzImage")
    document.getElementById("addimage").addEventListener("click", function(event) {
        input_image.click();

        var fr;
        let imageUrl;
        let storageImage;
        input_image.onchange = function (evt){
            var tgt = evt.target || window,
                files = tgt.files;
            
            if (FileReader && files && files.length) {
                fr = new FileReader();
                fr.onload = function () {
                    quizzImage.src = fr.result;
                    imageUrl = fr.result;
                    storageImage = localStorage.setItem("storageImage", imageUrl);
                }
                fr.readAsDataURL(files[0]);
            }
        }
    });

    //Escondemos el boton de Finish Quizz
    if(varAdd !== "1"){
        document.getElementById("finishQuizzQuestions").style.display = "none";
    }
//--------------------------------------------------------------------------------------------------------------------------------------------
    //Comprobamos que se haya introducido un titulo y descripcion e imagen
    let infoQuizz = localStorage.getItem("quizzInfo");
    infoQuizz = JSON.parse(infoQuizz);
    image = localStorage.getItem("storageImage");
    if(image !== null){
        quizzImage.src = image;
    }
    if(infoQuizz !== "null" && infoQuizz !== null){
        document.getElementById("titulo").value = infoQuizz["titulo"];
        document.getElementById("littledescription").innerHTML = infoQuizz["littledescription"];
    }

    //Obtenemos su categoria
    quizzCategoryStorage = localStorage.getItem("quizzCategoryStorage");
    if(quizzCategoryStorage !== null){
        document.getElementById("categories").value = quizzCategoryStorage;
    }

    let formCategory = document.getElementById("categories");
    formCategory.addEventListener('change', function(){
        var selectedOption = this.options[formCategory.selectedIndex];
        quizzCategory = selectedOption.text;
        localStorage.setItem("quizzCategoryStorage", quizzCategory);
    });
    
    document.getElementById("descripcion").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        //Incrementamos el numero de veces que se ha clickado en "Save"
        check++;
        localStorage.setItem("check", check);

        //Mostramos por pantalla un aviso de creacion
        alert("Quizz information saved succesfully!");

        //Comprobamos si se ha introducido los campos
        titulo = document.getElementById("titulo").value;
        littledescription = document.getElementById("littledescription").value;
        data = {
            "titulo": titulo,
            "littledescription": littledescription
        };

        // Convertir el objeto JSON a una cadena JSON
        var jsonData = JSON.stringify(data);
        localStorage.setItem("quizzInfo", jsonData);

        //Guardamos la imagen en LOCAL
        image = localStorage.getItem("storageImage");

        //Obtenemos la fecha de creación
        const fecha = new Date();
        let dia = fecha.getDate();
        let mes = fecha.getMonth() + 1;
        let año = fecha.getFullYear();
        let fechaCompleta = String(dia) + "-" + String(mes) + "-" + String(año);

        //Añadimos a la base de datos la informacion
        let nameuser = sessionStorage.getItem("actualUser") || "WizQuizz";

        //Comprobamos que haya alguna categoria
        if(quizzCategory === "" || quizzCategory === undefined){
            quizzCategory = "";
        }
        
        //Comprobamos si hay una imagen
        if(image === null){
            image = localStorage.getItem("defaultImage");
        }

        result = createQuizz(titulo, littledescription, image, nameuser, fechaCompleta, 0, 0, quizzCategory);
        result.then(data =>{
            let quizzId = data;
            localStorage.setItem("quizzId", quizzId);
        })
    });
//--------------------------------------------------------------------------------------------------------------------------------------------
    function questionAdder(indicator){
        //Ir al siguiente JScript al clickar al boton
        document.getElementById("AddQuestioN").addEventListener("click", function(event) {
            event.preventDefault();
            if(check >= 1){
                window.location.href = "../create/create-questions.html";
            }else{
                alert("Please to add questions first save your Quizz Information clicking on Save.");
            }
        });

        var quizzIdFinal = localStorage.getItem("quizzId");
        getQuizz(quizzIdFinal)
            .then(data => {
                //Mostramos el cuadro de las preview
                if(indicator === "1"){
                    document.getElementById("goat2").style.display = "none";
                    let questionCount = 1;
                    for(let i=0; i<parseInt(numberofQuestions); i++){
                        //Añadimos el 0 al numero en la bola
                        if(questionCount < 10){
                            questionNumber = "0" + questionCount;
                        }else{
                            questionNumber = questionCount;
                        }

                        const Maincontainer = document.querySelector(".quizz-questions");
                        const questionscontainer = document.getElementById("goat");
                        const section = document.createElement('section');
                        section.classList.add('quizz-questions');
                        section.id = 'section' + i;
                        section.innerHTML = `<div class="question">
                        <div class="question-info">
                            <p id="questionTitleJS">${data.questions[i].question}</p>
                            <div class="num-of-question">
                                <h2>${questionNumber}</h2>
                            </div>  
                        </div>
                        <div class="answers">
                            <button class="cauldron-button"><span><img src="../../website-images/answer-options/cauldron.png"></span><span id="answer1JS">${data.questions[i].answer1}</span></button>
                            <button class="mage-staff-button"><span><img src="../../website-images/answer-options/mage-staff.png"></span><span id="answer2JS">${data.questions[i].answer2}</span></button>
                            <button class="mana-button"><span><img src="../../website-images/answer-options/mana.png"></span><span id="answer3JS">${data.questions[i].answer3}</span></button>
                            <button class="magic-ball-button"><span><img src="../../website-images/answer-options/magic-ball.png"></span><span id="answer4JS">${data.questions[i].answer4}</span></button>
                        </div>
                        </div>`;

                        questionCount++;
                        localStorage.setItem("questionCount", questionCount);
                        Maincontainer.appendChild(section);
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
                        }                    }
                }
            })
            .catch(error => {
                console.error(error); 
            });
    }

    //Comprobamos si se ha añadido alguna pregunta
    if(varAdd !== "1"){
        const Maincontainer2 = document.querySelector(".quizquestions");
        const questionscontainer2 = document.getElementById("goat2");
        questionscontainer2.innerHTML = `<div class="noquestions">
        <div class="define">
            <h1 id="info1" class="h1define">At the moment you dont have questions!</h1>
            <p></p>
            <h2 id="info2" class="h2define">Click in the button below to add questions</h2>
        </div>
        </div>`;

        Maincontainer2.appendChild(questionscontainer2); 
    }
});

//CAMBIO DE IDIOMA CREATE-------------------------------
let typeLanguage = sessionStorage.getItem("languageStorage");
if(typeLanguage === "Spanish"){
    fetch("../../data/language/create-quizz/spanish.json")
    .then(response => response.json())
    .then(data => {
        document.getElementById("addimage").value = data.quizzInfo.addImage;
        document.querySelector('#categories option[value="default"]').textContent = data.quizzInfo.cathegory;
        document.getElementById("titulo").setAttribute("placeholder", data.quizzInfo.title);
        document.getElementById("littledescription").setAttribute("placeholder", data.quizzInfo.description);
        document.getElementById("save").innerHTML = data.quizzInfo.save;
        document.getElementById("info1").innerHTML = data.noQuestions.info1;
        document.getElementById("info2").innerHTML = data.noQuestions.info2;
        document.getElementById("AddQuestioN").value = data.noQuestions.addQuestion;
    })
}else if(typeLanguage === "English"){
    console.log("en");
}
//CAMBIO DE IDIOMA CREATE-------------------------------