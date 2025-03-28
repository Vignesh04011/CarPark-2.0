import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDVLimzDiY7usGGjEEcbnZcKLV--v16Xwo",
    authDomain: "carpark-d0fcd.firebaseapp.com",
    projectId: "carpark-d0fcd",
    storageBucket: "carpark-d0fcd.appspot.com",
    messagingSenderId: "808968772557",
    appId: "1:808968772557:web:ca6a763f27fac90cb24284",
    measurementId: "G-0Y0BBLCV49"
};

// Initialize Firebase only if it's not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
const auth = getAuth(app);

export { auth, app };
