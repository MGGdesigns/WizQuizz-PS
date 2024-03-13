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

export function setQuizData(id, name, description, author, submitDate, imageUrl){
    const reference = ref(db, "quizes/" + id);

    set(reference, {
        id: id,
        description: description,
        name: name,
        author: author,
        submitDate: submitDate,
        imageUrl: imageUrl
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

export function getData(table, id, fieldNumber){
    const reference = ref(db, table + "/" + id);

	return get(reference).then((snapshot)=>{
		var user = [];

		snapshot.forEach(childSnapshot=>{
			user.push(childSnapshot.val());
		})
		
		
		return user[fieldNumber];
	})
}

export function getQuizzes() {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, 'quizes/');

    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            resolve(snapshot.val());
        }, (error) => {
            reject(error);
        });
    });
}

export function getQuizz(id) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, 'quizes/' + id);

    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            resolve(snapshot.val());
        }, (error) => {
            reject(error);
        });
    });
}

export function getDataQuizz(id) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, 'quizes/' + id);
    let data;

    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        });
    });
}


// GETTER AND SETTERS EXAMPLES
setQuizData(6, "The Binding of Isaac", "Quiz about The Binding of Isaac videogame", "Zorro", "13/03/2024", "https://i.blogs.es/7c841a/the-binding-of-isaac-afterbirth-/1366_2000.jpg")

addQuizQuestion(1,2,"Who were Harry's parents?","noimage.png","William and Elizabeth Potter","Mauro & Paula Potter","James and Lily Potter","Henry and Maggie Potter",4)