const firebaseConfig = {
  apiKey: "AIzaSyBBbG4o_O-ByW4j0beuc35s8Q-e-Mq4NgY",
  authDomain: "taskify-5627f.firebaseapp.com",
  projectId: "taskify-5627f",
  storageBucket: "taskify-5627f.firebasestorage.app",
  messagingSenderId: "814938609058",
  appId: "1:814938609058:web:03100864f5baf0bd210efb",
  measurementId: "G-MDPB3VVDEQ"
};

  // Initialize Firebase
// 2. Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 3. Define globally accessible variables
window.auth = firebase.auth();
window.db = firebase.firestore();