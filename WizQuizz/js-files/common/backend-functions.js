import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCzspdVz53ABe4ry26GbjuZGoafKHWkINQ",
    authDomain: "wiz-quizz.firebaseapp.com",
    databaseURL: "https://wiz-quizz-default-rtdb.firebaseio.com",
    projectId: "wiz-quizz",
    storageBucket: "wiz-quizz.appspot.com",
    messagingSenderId: "698142113065",
    appId: "1:698142113065:web:ac9df1b25aba91759c8b38",
    measurementId: "G-7RR6QBL85G"
  };
const app = initializeApp(firebaseConfig)
const db = getDatabase()


export function setUserData(email, username, description, imageUrl, password){
    const reference = ref(db, "users/" + username);

    set(reference, {
        description: description,
        email: email,
        imageUrl: imageUrl,
        password: password
    });
}

export function setQuizData(id, name, description, imageUrl){
    const reference = ref(db, "quizes/" + id);

    set(reference, {
        description: description,
        name: name,
        imageUrl: imageUrl,
    });
}

export function addQuizQuestion(id, number, question, imageUrl, answer1, answer2, answer3, answer4, correctAnswers){
    const reference = ref(db, "quizes/" + id + "/questions/" + number);

    set(reference, {
        question: question,
        imageUrl: imageUrl,
        answer1: answer1,
        answer2: answer2,
        answer3: answer3,
        answer4: answer4,
        correctAnswers: correctAnswers
    });
}

export function getUserData(table, id, fieldNumber){
    const reference = ref(db, table + "/" + id);

	return get(reference).then((snapshot)=>{
		var user = [];

		snapshot.forEach(childSnapshot=>{
			user.push(childSnapshot.val());
		})
		
		
		return user[fieldNumber];
	})
}



// GETTER AND SETTERS EXAMPLES
// setQuizData(1, "Harry Potter", "Quiz about Harry Potter's world", "noimage.png")

// addQuizQuestion(1,1,"2+2","noimage.png",1,2,3,4,1)

// getUserData("quizes", "1", 0).then((userData) => {
//     const ejemplo = document.getElementById("test");
//     ejemplo.innerHTML = userData;
// });