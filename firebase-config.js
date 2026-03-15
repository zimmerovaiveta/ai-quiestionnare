// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjFyaXCdW8OgmxHm2DAj0rIXpIfwP9UM0",
    authDomain: "tmo-ai-adoption-questionnaire.firebaseapp.com",
    projectId: "tmo-ai-adoption-questionnaire",
    storageBucket: "tmo-ai-adoption-questionnaire.firebasestorage.app",
    messagingSenderId: "942210567431",
    appId: "1:942210567431:web:0a1a1e18dfdb9db8cf09a2",
    measurementId: "G-QN6YHZN5M0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();
