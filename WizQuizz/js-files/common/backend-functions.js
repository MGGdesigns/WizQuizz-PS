import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    get,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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

export async function login(email, password) {
    const auth = getAuth();
    let result = [];

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        result.push(user.uid);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        result.push(errorCode, errorMessage);
    }

    return result;
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

export async function createUser(username, email, password, description, imageUrl, accountCreationDate, quizzesFinished, following){
    const auth = await getAuth();
    let userId;
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        userId = userCredential.user.uid;
        alert(userId);
        console.log(userId);
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });

    const reference = ref(db, "users/" + userId);
    const refUsername = ref(db, "username-user/" + stringToHash(username));
    await set(refUsername, {
        uid: userId
    });

    await set(reference, {
        username: username,
        email: email,
        password: password,
        description: description,
        imageUrl: imageUrl,
        accountCreationDate: accountCreationDate,
        quizzesFinished: quizzesFinished,
        following: following
    });

    
}

export function modifyUserImage(id, username, email, password, description, imageUrl, accountCreationDate, quizzesFinished, following){
    //El id tiene que ser esto stringToHash(email)
    set(ref(db, "users/" + id), {
		username: username,
        email: email,
		password: password,
        description: description,
        imageUrl: imageUrl,
		accountCreationDate: accountCreationDate,
		quizzesFinished: quizzesFinished,
        following: following
    });
}

export async function createQuizz(title, description, imageUrl, author, submitDate, rating, timesReviewed, category){
	const id = await generateId();

    await set(ref(db, "quizzes/" + id), {
		title: title,
        description: description,
		imageUrl: imageUrl,
        author: author,
        submitDate: submitDate,
		rating: rating,
		timesReviewed: timesReviewed,
        category: category
    });
    const authorHash = await stringToHash(author);
    await set(ref(db, "username-quizzes/" + authorHash + "/" + id), {
        dummy: "dummy"
    })

    return id;
}

export async function getUserQuizzes(username){
    const authorHash = await stringToHash(username);
    return await querySearch("/username-quizzes/" + authorHash);
}

export function modifyQuizz(id, title, description, imageUrl, author, submitDate, rating, timesReviewed, category){

    update(ref(db, "quizzes/" + id), {
		title: title,
        description: description,
		imageUrl: imageUrl,
        author: author,
        submitDate: submitDate,
		rating: rating,
		timesReviewed: timesReviewed,
        category: category
    });
}

export async function modifyQuizzQuestions(id, questionNumber, answer1, answer2, answer3, answer4, correctAnswers, imageUrl, question){

    await update(ref(db, "quizzes/" + id + "/questions/" + questionNumber), {
		answer1: answer1,
        answer2: answer2,
        answer3: answer3,
        answer4: answer4,
        correctAnswers: correctAnswers,
        imageUrl: imageUrl,
        question: question
    });
}

export async function removeQuizz(id){
    const author = await querySearch("quizzes/" + id + "/author");
    const authorHash = await stringToHash(author);
    await remove(ref(db, "quizzes/" + id));
    await remove(ref(db, "username-quizzes/" + authorHash + "/" + id));
}

export async function unfollow(user, userToUnfollow){
    
    await remove (ref(db, "users/" + user + "/following/" + userToUnfollow));
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
    const snapshot = await get(reference);
    return snapshot.val();
	return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            resolve(snapshot.val());
        }, (error) => {
            reject(error);
        });
    });
}

export async function getUserByName(name){
    try {
        const id = await stringToHash(name);
        
        const usernameUserRef = ref(db, "username-user/" + id + "/email");
        
        const snapshot = await get(usernameUserRef);
        console.log(snapshot.val());
        const userEmail = snapshot.val();
        
        if (!userEmail) {
            throw new Error('Usuario no encontrado');
            // return null;
        }
        
        const userHash = await stringToHash(userEmail);
        const userRef = ref(db, "users/" + userHash);
        
        const userSnapshot = await get(userRef);

        return userSnapshot.val();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getQuizz(id) {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db, 'quizzes/' + id);

    const snapshot = await get(reference);

    return await snapshot.val();

    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            resolve(snapshot.val());
        }, (error) => {
            reject(error);
        });
    });
}

export async function getAllQuizzes(){
    const reference = ref(db, "quizzes");
    let data;

    const snapshot = await get(reference);
    return await snapshot.val();
    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        })
    })
}

export async function getAllUsers(){
    const reference = ref(db, "users");
    let data;
    const snapshot = await get(reference);
    return await snapshot.val();

    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        })
    })
}

export async function getQuizzField(id, field){
    const reference = ref(db, "quizzes/" + id + "/" + field);
    let data;
    
    const snapshot = await get(reference);
    return await snapshot.val();
    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            resolve(data);
        }, (error) => {
            reject(error);
        })
    })
}

export async function querySearch(query){
    const reference = ref(db, query);
    try {
        const snapshot = await get(reference);
        return snapshot.val();
    } catch (error) {
        // Manejar el error aquí si es necesario
        console.error("Error al realizar la búsqueda:", error);
        throw error;
    }
}

export function updateRating(id, rating, timesReviewed) {
    const reference = ref(db, "quizzes/" + id);

    update(reference, {
        rating: rating,
        timesReviewed: timesReviewed
    });
}

export async function follow(username, email, password, description, imageUrl, accountCreationDate, quizzesFinished, following){
    
    /*const user = stringToHash(userMail);
    const reference = ref(db, "users/" + user + "/following/" + stringToHash(userToFollow.email));

    set(reference, {
        dummy:"empty"
    })*/
    
    const user = stringToHash(email);
    set(ref(db, "users/" + user), {
		username: username,
        email: email,
		password: password,
        description: description,
        imageUrl: imageUrl,
		accountCreationDate: accountCreationDate,
		quizzesFinished: quizzesFinished,
        following: following
    });


}
/*
export async function getFollowing(userMail){
    const user = stringToHash(userMail);
	const reference = ref(db, "users/" + user + "/following/");
    let data;
    const snapshot = await get(reference);
    const r = await snapshot.val();
    console.log(r)
    return r

    return new Promise((resolve, reject) => {
        onValue(reference, (snapshot) => {
            data = snapshot.val();
            console.log(data)
            resolve(data);
        }, (error) => {
            reject(error);
        })
    })
}*/



/*
database.ref('data').once('value', function(snapshot) {
  var data = snapshot.val();
  console.log(data.name);
  console.log(data.age);
});
*/


// GETTER AND SETTERS EXAMPLES

// THE LINE UNDER THE COMMENT WILL RESTART THE ID COUNTER, ONLY USE WHEN DB IS EMPTY

// resetId();

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

// createQuizz("title3", "Description3", "imageUrl", "user1", "submitDate", "rating", "timesPlayed").then((id) => {
//     console.log(id);
// });

// getQuizz(1).then((data) => {
//     console.log(data.questions[1].answer2);
// })