// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBBuoaQ8Y48USvwKCW4wAGY1GKI5uIBr0",
  authDomain: "headstarterpantry-app.firebaseapp.com",
  projectId: "headstarterpantry-app",
  storageBucket: "headstarterpantry-app.appspot.com",
  messagingSenderId: "271240406560",
  appId: "1:271240406560:web:0af0fcd102dfe92c163e45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}

