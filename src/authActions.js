import pyrodux from './';
import internalActions from './internalActions';

/**
 * @param {string} email - E-Mail address to log in.
 * @param {string} password - Password to use to log in
 */
export const doLoginWithEmailPassword = (email, password) => dispatch => {
  const auth = pyrodux.getAuth();
  return auth
    .signInWithEmailAndPassword(email, password)
    .then(authUser => dispatch(internalActions.setAuthUser(authUser)))
    .catch(err => pyrodux.tryRethrowError(err));
};

export const doLogout = () => dispatch => {
  const auth = pyrodux.getAuth();
  return auth.signOut();
};

/**
 * @param {string} email - E-Mail address to create an account for
 * @param {string} password - Password to be used for the new account
 */
export const doSignUpWithEmailPassword = (email, password) => dispatch => {
  const auth = pyrodux.getAuth();
  return auth
    .createUserWithEmailAndPassword(email, password)
    .catch(err => pyrodux.tryRethrowError(err));
};

/**
 * @param {string} email
 * @param {function} [successCallback]
 * @param {function} [errorCallback]
 * @param {object} [actionCodeSettings]
 */
const doSendPasswordResetEmail = (
  email,
  successCallback,
  errorCallback,
  actionCodeSettings
) => dispatch => {
  // TODO export
  const auth = pyrodux.getAuth();
  return auth
    .sendPasswordResetEmail(email, actionCodeSettings)
    .then(() => {
      if (typeof successCallback === 'function') successCallback();
    })
    .catch(err => {
      if (typeof errorCallback === 'function') errorCallback(err.message); // TODO keep this??
      pyrodux.tryRethrowError(err);
    });
};

/**
 * @param {string} code - the code from the E-Mail
 * @param {string} newPassword - the new Password for the user
 */
const doConfirmPasswordResetEmail = (code, newPassword) => dispatch => {
  // TODO export
  const auth = pyrodux.getAuth();
  auth
    .confirmPasswordReset(code, newPassword)
    .catch(err => pyrodux.tryRethrowError(err));
};

const updateUserProfile = (displayName, photoURL) => dispatch => {
  // TODO export
  const auth = pyrodux.getAuth();
  return auth.currentUser.updateProfile({ displayName, photoURL });
};

const updateUserEmail = newEmail => dispatch => {
  // TODO export
  const auth = pyrodux.getAuth();
  return auth.currentUser.updateEmail(newEmail);
};

const updateUserPassword = newPassword => dispatch => {
  // TODO export
  const auth = pyrodux.getAuth();
  return auth.currentUser.updatePassword(newPassword);
};

const sendEmailVerification = actionCodeSettings => dispatch => {
  // TODO export
  // TODO https://firebase.google.com/docs/reference/js/firebase.User#sendEmailVerification
  const auth = pyrodux.getAuth();
  return auth.sendEmailVerification(actionCodeSettings);
};

const applyActionCode = code => dispatch => {
  // used to complete email verification
  // TODO export
  const auth = pyrodux.getAuth();
  return auth.applyActionCode(code);
};
