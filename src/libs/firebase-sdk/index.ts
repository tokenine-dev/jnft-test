import Firebase from "firebase"
import * as firebase from "firebase/app";
import "firebase/functions";
import "firebase/firestore";

const SDKCONFIG = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG || "")

const app = firebase.default.initializeApp(SDKCONFIG)

// app.functions().useEmulator('localhost', 5001);
// app.firestore().useEmulator('localhost', 8080);

export const $firebase = Firebase
export const functions = app.functions()
export const firestore = app.firestore()
export const RTDB = app.database()
