// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSPc7GjjBLxPxPnB1oLnDUmKtpZQqbPXw",
  authDomain: "goat-4dd7b.firebaseapp.com",
  projectId: "goat-4dd7b",
  storageBucket: "goat-4dd7b.appspot.com",
  messagingSenderId: "407014452181",
  appId: "1:407014452181:web:9876291ada8274b47a6b5c",
  measurementId: "G-7Q5B6370QT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const provider = new GoogleAuthProvider();
// const facebookAuthProvider = new FacebookAuthProvider();
export { auth, db };
// export const analytics = getAnalytics(app);
// import firebase from "firebase/app";
// import "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDSPc7GjjBLxPxPnB1oLnDUmKtpZQqbPXw",
//   authDomain: "goat-4dd7b.firebaseapp.com",
//   projectId: "goat-4dd7b",
//   storageBucket: "goat-4dd7b.appspot.com",
//   messagingSenderId: "407014452181",
//   appId: "1:407014452181:web:9876291ada8274b47a6b5c",
//   measurementId: "G-7Q5B6370QT",
// };
// const a = firebase.getApp("goat-new-web");
// debugger;
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

// export default firebase;
