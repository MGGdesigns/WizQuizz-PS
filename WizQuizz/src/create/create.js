import {createQuizz, getQuizz} from "../../js-files/common/backend-functions.js";

document.addEventListener("DOMContentLoaded", function() {
    var localCloudQuestions = localStorage.getItem("questionsInfo");
    var parsedData = JSON.parse(localCloudQuestions);

    let result;

    let varAdd = localStorage.getItem("varAdd");
    let numberofQuestions = localStorage.getItem("numberofQuestions");
    questionAdder(varAdd);

    //Reset localStorage when click on Finish button
    document.getElementById("finishButton").addEventListener("click", function(event) {
        localStorage.clear();
    });

    //Add an Quizz image
    const input_image = document.getElementById("inputFile")
    const quizzImage = document.getElementById("quizzImage")
    document.getElementById("addimage").addEventListener("click", function(event) {
        addimage.onclick = function(){
            input_image.value = null;
            input_image.click();
        }

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
//--------------------------------------------------------------------------------------------------------------------------------------------
    document.getElementById("descripcion").addEventListener("submit", function(event) {
        event.preventDefault();

        var titulo = document.getElementById("titulo").value;
        var littledescription = document.getElementById("littledescription").value;
        var data = {
            "titulo": titulo,
            "littledescription": littledescription
        };

        // Convertir el objeto JSON a una cadena JSON
        var jsonData = JSON.stringify(data);
        localStorage.setItem("quizzInfo", jsonData);

        var localCloudQuizz = localStorage.getItem("quizzInfo");
        document.getElementById("titulo").innerHTML = titulo;
        document.getElementById("littledescription").innerHTML = littledescription;

        //Descargamos la imagen en LOCAL
        let image = localStorage.getItem("storageImage");
        if(image.startsWith("data:image")){
            // Realiza una solicitud HTTP para obtener el contenido de la imagen
            fetch(image)
            .then(response => {
                // Verifica si la solicitud fue exitosa
                if (!response.ok) {
                throw new Error("Error al descargar la imagen: " + response.statusText);
                }
                // Convierte la respuesta en un blob (objeto binario grande)
                return response.blob();
            })
            .then(blob => {
                // Crea un objeto URL para la imagen descargada
                let image = URL.createObjectURL(blob);
                
                // Crea un elemento <a> para descargar la imagen
                let link = document.createElement("a");
                link.href = image;
                link.download = "imagen.png"; // Nombre del archivo a descargar
                document.body.appendChild(link);
                
                // Simula hacer clic en el enlace para iniciar la descarga
                link.click();

                // Limpia el objeto URL después de la descarga
                URL.revokeObjectURL(image);
            })
            .catch(error => {
                console.error("Error:", error);
            });
        }else{
            console.log("estoy undefinded");
        }

        //Añadimos a la base de datos la informacion
        result = createQuizz(titulo, littledescription, image, "Angel", "13/03/2024", "rating", "timesPlayed");
        result.then(data =>{
            let quizzId = data;
            localStorage.setItem("quizzId", quizzId);
        })
    });
//--------------------------------------------------------------------------------------------------------------------------------------------
    function questionAdder(indicator){
        console.log("quizzId");
        var quizzIdFinal = localStorage.getItem("quizzId");
        getQuizz(quizzIdFinal)
            .then(data => {
                //Mostramos el cuadro de las preview
                if(varAdd === "1"){
                    document.getElementById("goat2").style.display = "none";
                    for(let i=0; i<parseInt(numberofQuestions); i++){
                        const Maincontainer = document.querySelector(".quizz-questions");
                        const questionscontainer = document.getElementById("goat");
                        const section = document.createElement('section');
                        section.classList.add('quizz-questions');
                        section.id = 'section' + i;
                        section.innerHTML = `<div class="question">
                        <div class="question-info">
                            <p id="questionTitleJS">${data.questions[i].question}</p>
                            <div class="num-of-question">
                                <h2>${Object.keys(data.questions)[i]}</h2>
                            </div>  
                        </div>
                        <div class="answers">
                            <button class="cauldron-button"><span><img src="../../website-images/answer-options/cauldron.png"></span><span id="answer1JS">${data.questions[i].answer1}</span></button>
                            <button class="mage-staff-button"><span><img src="../../website-images/answer-options/mage-staff.png"></span><span id="answer2JS">${data.questions[i].answer2}</span></button>
                            <button class="mana-button"><span><img src="../../website-images/answer-options/mana.png"></span><span id="answer3JS">${data.questions[i].answer3}</span></button>
                            <button class="magic-ball-button"><span><img src="../../website-images/answer-options/magic-ball.png"></span><span id="answer4JS">${data.questions[i].answer4}</span></button>
                        </div>
                        </div>`;

                        Maincontainer.appendChild(section); 
                    }
                }else{
                    const Maincontainer2 = document.querySelector(".quizquestions");
                    const questionscontainer2 = document.getElementById("goat2");
                    questionscontainer2.innerHTML = `<div class="noquestions">
                    <div class="define">
                        <h1>At the moment you dont have questions!</h1>
                        <p></p>
                        <h2>Click in the button below for add questions</h2>
                    </div>
                    </div>`;

                    Maincontainer2.appendChild(questionscontainer2); 
                }
            })
            .catch(error => {
                console.error(error); 
            });   
    }
});