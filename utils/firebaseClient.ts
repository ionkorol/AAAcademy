import firebase from "firebase/app";
import "firebase/firestore";
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAr0AhtbxdlgBCweYokJMr3pENlkphIJrA",
  authDomain: "alwaysactive-83134.firebaseapp.com",
  projectId: "alwaysactive-83134",
  storageBucket: "alwaysactive-83134.appspot.com",
  messagingSenderId: "659659483899",
  appId: "1:659659483899:web:3f6046295df7773365de5e",
  measurementId: "G-4CS3JS54PT",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firebaseClient = firebase
export default firebaseClient;
