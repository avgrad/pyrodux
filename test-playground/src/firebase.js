import pyrodux from 'pyrodux';

const config = {
    apiKey: "YOUR_FIREBASE API_KEY_HERE",
    authDomain: "FIREBASE_APP_ID.firebaseapp.com",
    databaseURL: "https://FIREBASE_APP_ID.firebaseio.com",
    projectId: "FIREBASE_APP_ID",
    storageBucket: "FIREBASE_APP_ID.appspot.com",
    messagingSenderId: "000000000000"
};

export const app = pyrodux.initializeApp(config);

export const auth = pyrodux.auth();
export const firestore = pyrodux.firestore();

firestore.settings({
    timestampsInSnapshots: true
});
