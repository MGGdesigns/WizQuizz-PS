import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import {
    getDatabase,
    ref,
    set,
    get,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updatePassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const firestore = getFirestore(app);
const lobbyRef = ref(db, 'lobbys/1');
export{ firestore, onValue, lobbyRef };

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
    console.log("creating User ...");
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        userId = userCredential.user.uid;
        alert(userId);
        console.log(userId);
        sendEmailVerification(auth.currentUser);
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
        // ..
    });

    const reference = ref(db, "users/" + userId);
    const refUsername = ref(db, "username-user/" + stringToHash(username));
    await set(refUsername, {
        uid: userId
    });

    await set(reference, {
        username: username,
        description: description,
        imageUrl: imageUrl,
        accountCreationDate: accountCreationDate,
        quizzesFinished: quizzesFinished,
        following: following
    });

    return userId;
}

export async function resetPassword(email){

    const auth = getAuth();
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Email sent");
        return 0;
    } catch (error) {
        console.error("Error sending email:", error.code, error.message);
        return -1; 
    }
}

export function modifyUserImage(uid, username, description, imageUrl, accountCreationDate, quizzesFinished, following){
    //El id tiene que ser esto stringToHash(email)
    set(ref(db, "users/" + uid), {
		username: username,
        description: description,
        imageUrl: imageUrl,
		accountCreationDate: accountCreationDate,
		quizzesFinished: quizzesFinished,
        following: following
    });
}

export async function createLobby(code, quizzTitle, quizzId, numOfUsers){
	const id = 1;

    await set(ref(db, "lobbys/" + id), {
		code: code,
        quizzId: quizzId,
        quizzTitle: quizzTitle,
        numOfUsers: numOfUsers,
        currentQuestion: 0
    });

    return id;
}

export async function nextQuestion(){
    const id = 1;
    let currentQuestion = await getCurrentQuestion();
    let updateQuestion = currentQuestion.val() + 1;
    await update(ref(db, "lobbys/" + id), {
        currentQuestion: updateQuestion
    });
}

export async function getCurrentQuestion(){
    const id = 1;
    return await get(ref(db, "lobbys/" + id + "/currentQuestion"))
}

export async function updateNumOfUsers(numOfUsers){
    const id = 1;

    await update(ref(db, "lobbys/" + id), {
        numOfUsers: numOfUsers
    });
}

export async function getInfoLobby(id) {
    
    const reference = ref(db, 'lobbys/' + id);

    const snapshot = await get(reference);

    return await snapshot.val();
}

//FALTA HACER DE ALGUNA MANERA DE QUE CUANDO SE AÑADA UN USER MAS, SE SUME COMO SU ID PARA QUE NO SE SOBREESCRIBAN, (ALGO SIMILAR A LO DE CUANDO AÑADES PREGUNTAS AL UN QUIZZ)
export async function addUserIntoLobby(userName, num){

    await update(ref(db, "lobbys/" + 1 + "/users/" + num), {
        userName: userName,
        score: 0
    });
}

export async function addScore(num, score){
    let newScore = await getScore(num);
    newScore = Number(newScore) + Number(score);
    await update(ref(db, "lobbys/" + 1 + "/users/" + num), {
        userName: userName,
        score: newScore
    });
}

export async function getScore(num){
    return await get(ref(db, "lobbys/" + 1 + "/users/" + num + "/score"));
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

export async function unfollow(uid, usernameToUnfollow){
    const hashToUnfollow = stringToHash(usernameToUnfollow);
    await remove (ref(db, "users/" + uid + "/following/" + hashToUnfollow));
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
export async function getUser(uid){
    
	const reference = ref(db, "users/" + uid);
    const snapshot = await get(reference);
    return snapshot.val();
}

export async function getUserByName(name){
    try {
        const id = await stringToHash(name);
        
        const usernameUserRef = ref(db, "username-user/" + id + "/uid");
        
        const snapshot = await get(usernameUserRef);
        console.log(snapshot.val());
        const userId = snapshot.val();
        
        if (!userId) {
            throw new Error('Usuario no encontrado');
            // return null;
        }
        
        const userRef = ref(db, "users/" + userId);
        
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
}

export async function getAllQuizzes(){
    const reference = ref(db, "quizzes");
    let data;

    const snapshot = await get(reference);
    return await snapshot.val();
}

export async function getAllUsers(){
    const reference = ref(db, "users");
    let data;
    const snapshot = await get(reference);
    return await snapshot.val();
}

export async function getQuizzField(id, field){
    const reference = ref(db, "quizzes/" + id + "/" + field);
    let data;
    
    const snapshot = await get(reference);
    return await snapshot.val();
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

export async function follow(uid, userToFollow){
    const user = stringToHash(userMail);
    const reference = ref(db, "users/" + uid + "/following/" + stringToHash(userToFollow.username));
    const currentDate = new Date().toDateString();
    set(reference, {
        dummy:currentDate
    })
}


export async function getFollowing(uid){
    const reference = ref(db, "users/" + uid + "/following");
    let data;
    const snapshot = await get(reference);
    return await snapshot.val();
}

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