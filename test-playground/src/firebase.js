import pyrodux from 'pyrodux';

const config = {
    // TODO
};

export const app = pyrodux.initializeApp(config);

export const auth = pyrodux.auth();
export const firestore = pyrodux.firestore();
