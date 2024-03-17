document.addEventListener('DOMContentLoaded', function() {
    const finish = document.getElementById("finish");
    const mark = document.getElementById("mark");
    const exit = document.getElementById("exit");
    var resultado = sessionStorage.getItem("results");
    var numofquestions = sessionStorage.getItem("totalQuestions");
    var varInteger = parseInt(numofquestions);

    const currentUrl = window.location.href.split('=');
    const idQuizz = currentUrl[1];

    console.log(numofquestions);

    if(resultado >= varInteger/2){
        finish.innerHTML = "Congratulations!";
        mark.innerHTML = resultado + "/" + numofquestions;
    }else{
        finish.innerHTML = "Bad Luck!";
        mark.innerHTML = resultado  + "/" + numofquestions;
    }
    if(resultado === null){
        mark.innerHTML = "Leave";
    }

    sessionStorage.clear();
    exit.addEventListener("click", function() {
        event.preventDefault();
        window.location.href = "../../src/play/quizz-preview.html?id=" + idQuizz;
    });
});