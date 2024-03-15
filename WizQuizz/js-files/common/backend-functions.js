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

export function stringToHash(string) {
 
    let hash = 0;
 
    if (string.length == 0) return hash;
    let i;
    let char;
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

function resetId(){
    const reference = ref(db, "idGenerator/");
    set(reference, {
        actualId: 0
    })
}

async function generateId() {
    const reference = ref(db, "idGenerator");

    try {
        const snapshot = await get(reference);
        const actualId = snapshot.val().actualId;

        const newId = actualId + 1;

        await set(ref(db, '/idGenerator/' + "actualId"), newId);

        return newId;
    } catch (error) {
        console.error('Error while increasing id in Firebase:', error);
        throw error;
    }
}

export function createUser(username, email, password, description, imageUrl, accountCreationDate, quizzesFinished){
    const reference = ref(db, "users/" + stringToHash(email));
    set(reference, {
        username: username,
        email: email,
        password: password,
        description: description,
        imageUrl: imageUrl,
        accountCreationDate: accountCreationDate,
        quizzesFinished: quizzesFinished
    });
}

export async function createQuizz(title, description, imageUrl, author, submitDate, rating, timesPlayed){
	const id = await generateId();

    set(ref(db, "quizzes/" + id), {
		title: title,
        description: description,
		imageUrl: imageUrl,
        author: author,
        submitDate: submitDate,
		rating: rating,
		timesPlayed: timesPlayed,
    });
}

export function modifyQuizz(id, title, description, imageUrl, author, submitDate, rating, timesPlayed){

    set(ref(db, "quizzes/" + id), {
		title: title,
        description: description,
		imageUrl: imageUrl,
        author: author,
        submitDate: submitDate,
		rating: rating,
		timesPlayed: timesPlayed
    });
}

export async function setQuizzQuestion(id, number, question, imageUrl, answer1, answer2, answer3, answer4, correctAnswers){
    const reference = await ref(db, "quizzes/" + id + "/questions/" + number);

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
export async function getUser(email){
	const id = await stringToHash(email);
	const reference = ref(db, "users/" + id);
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
    const reference = ref(db, 'quizzes/' + id);

    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            resolve(snapshot.val());
        }, (error) => {
            reject(error);
        });
    });
}

export function getAllQuizzes(){
    const reference = ref(db, "quizzes");
    let data;
    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        })
    })
}

export function getAllUsers(){
    const reference = ref(db, "users");
    let data;
    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        })
    })
}

export function getQuizzField(id, field){
    const reference = ref(db, "quizzes/" + id + "/" + field);
    let data;
    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        })
    })
}

export function querySearch(query){
    const reference = ref(db, query);
    let data;
    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        })
    })
}

// GETTER AND SETTERS EXAMPLES

// THE LINE UNDER THE COMMENT WILL RESTART THE ID COUNTER, ONLY USE WHEN DB IS EMPTY

// // // resetId();

// YOU CAN UNCOMMENT UNDER THIS LINE 

// createUser("user1", "email@gmail.com", "password", "description", "imageUrl", "15/03/2024", "0");
// await createQuizz("title", "description", "imageUrl", "user1", "submitDate", "rating", "timesPlayed");
// setQuizzQuestion(1,1,"2+2","noimage.png","1","2","3","4",1);
// setQuizzQuestion(1,2,"1+1","noimage.png","1","2","3","4",4);

// getUser("email@gmail.com").then((data) => {
//     console.log(data);
// })

// getQuizz(1).then((data) => {
//     console.log(data);
// })

// await createQuizz("title2", "This is a more elaborate description", "imageUrl", "user1", "submitDate", "rating", "timesPlayed");

// getAllQuizzes().then((data) => {
//     console.log(data);
// })

// getAllUsers().then((data) => {
//     console.log(data);
// })

// querySearch("/quizzes/1/description").then((data) => {
//     console.log(data);
// })