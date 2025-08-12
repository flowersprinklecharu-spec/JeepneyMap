import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyAA7LWi3tSQIWiSZC9d0foBNb3Idxd4DEw",
  authDomain: "react-contact-2.firebaseapp.com",
  projectId: "react-contact-2",
  storageBucket: "react-contact-2.firebasestorage.app",
  messagingSenderId: "583054998379",
  appId: "1:583054998379:web:a894c39ac8bf95f3936a2e"
};

  const app = firebase.initializeApp(firebaseConfig);

  const database = app.database();

  export {database};