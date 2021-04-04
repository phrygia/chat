import firebase from "firebase";
import "firebase/auth"; //인증
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
    apiKey: "AIzaSyDbIHp4DgdMxbxwTe5Uq2qKikizKdPQCRo",
    authDomain: "phrygia-talk.firebaseapp.com",
    databaseURL: "https://phrygia-talk.firebaseio.com",
    projectId: "phrygia-talk",
    storageBucket: "phrygia-talk.appspot.com",
    messagingSenderId: "132305409008",
    appId: "1:132305409008:web:9abdba5bd7ec05ab19c335",
    measurementId: "G-TQMLR8B6BX",
};
firebase.initializeApp(firebaseConfig);
// firebase.analytics();    // 통계

export default firebase;
