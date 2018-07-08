import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const options = {
    // TODO firebase stuff
};

const app = firebase.initializeApp(options);

const auth = firebase.auth();
const firestore = firebase.firestore();
