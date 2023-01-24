// import { initializeApp } from 'firebase-admin/app';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
import { getDatabase, ref as sRef, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
import { ref, getStorage, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-storage.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-performance.js";

// var serviceAccount = "./server/booking-app-6750f-firebase-adminsdk-h0nzw-3227c0e12b.json";

// var admin = initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
//     storageBucket: 'booking-app-6750f.appspot.com',
//     databaseAuthVariableOverride: {
//         uid: "my-service-worker"
//     }
// });


// const adminDB = admin.database();

// console.log(adminDB);

const config = {
apiKey: "AIzaSyAN-hSy8cWKUKJS4SxjNcN9lrmvZPTy430",
authDomain: "booking-app-6750f.firebaseapp.com",
databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
projectId: "booking-app-6750f",
storageBucket: "booking-app-6750f.appspot.com",
messagingSenderId: "687482685582",
appId: "1:687482685582:web:a91f903ce5133c4f5aa1df",
measurementId: "G-0WDDDKD9ZL"
};

initializeApp(config);
const db = getDatabase();

// Signs-in Friendly Chat.
async function signIn() {
var provider = new GoogleAuthProvider();
signInWithPopup(getAuth(), provider);
}

// Signs-out of Friendly Chat.
function signOutUser() {
signOut(getAuth());
}

// Initiate firebase auth
function initFirebaseAuth() {
onAuthStateChanged(getAuth(), authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
return getAuth().currentUser.photoURL;
}

// Returns the signed-in user's display name.
function getUserName() {
return getAuth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
return !!getAuth().currentUser;
} 

// Template for messages.
var MESSAGE_TEMPLATE =
'<div class="message-container">' +
'<div class="spacing"><div class="pic"></div></div>' +
'<div class="message"></div>' +
'<div class="name"></div>' +
'</div>';

var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');

messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener('click', signOutUser);
signInButtonElement.addEventListener('click', signIn);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
return url + '?sz=150';
}
return url;
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
if (user) {
// User is signed in!
// Get the signed-in user's profile pic and name.
var profilePicUrl = getProfilePicUrl();
var userName = getUserName();

// Set the user's profile pic and name.
userPicElement.style.backgroundImage =
'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
userNameElement.textContent = userName;

// Show user's profile and sign-out button.
userNameElement.removeAttribute('hidden');
userPicElement.removeAttribute('hidden');
signOutButtonElement.removeAttribute('hidden');

// Hide sign-in button.
signInButtonElement.setAttribute('hidden', 'true');

// We save the Firebase Messaging Device token and enable notifications.
// saveMessagingDeviceToken();
} else {
// User is signed out!
// Hide user's profile and sign-out button.
userNameElement.setAttribute('hidden', 'true');
userPicElement.setAttribute('hidden', 'true');
signOutButtonElement.setAttribute('hidden', 'true');

// Show sign-in button.
signInButtonElement.removeAttribute('hidden');
}
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
// Return true if the user is signed in Firebase
if (isUserSignedIn()) {
return true;
}

// Display a message to the user using a Toast.
var data = {
message: 'You must sign-in first',
timeout: 2000,
};
signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
return false;
}

// Saves a new message on the Cloud Firestore.
async function saveMessage(messageText) {
// try {
//     await addDoc(collection(getFirestore(), 'messages'), {
//     name: getUserName(),
//     text: messageText,
//     profilePicUrl: getProfilePicUrl(),
//     timestamp: serverTimestamp()
//     });
// }
// catch(error) {
//     console.error('Error writing new message to Firebase Database', error);
// }
let data = {
name: getUserName(),
text: messageText,
profilePicUrl: getProfilePicUrl()
}
console.log(data);
console.log(getAuth().lastNotifiedUid);
let uid = getAuth().lastNotifiedUid;
document.cookie = "chatUid="+uid;
function writeUserData(name, email, imageUrl) {
set(sRef(db, 'messages/'), {
uid: uid,
name: getUserName(),
text: messageText,
profilePicUrl: getProfilePicUrl()
});
}
writeUserData(uid, getUserName(), messageText, getProfilePicUrl);
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
element.value = '';
element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
e.preventDefault();
// Check that the user entered a message and is signed in.
if (messageInputElement.value && checkSignedInWithMessage()) {
saveMessage(messageInputElement.value).then(function () {
// Clear message text field and re-enable the SEND button.
resetMaterialTextfield(messageInputElement);
toggleButton();
});
}
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
if (messageInputElement.value) {
submitButtonElement.removeAttribute('disabled');
} else {
submitButtonElement.setAttribute('disabled', 'true');
}
}

function createAndInsertMessage(id, timestamp) {
const container = document.createElement('div');
container.innerHTML = MESSAGE_TEMPLATE;
const div = container.firstChild;
div.setAttribute('id', id);

// If timestamp is null, assume we've gotten a brand new message.
// https://stackoverflow.com/a/47781432/4816918
timestamp = timestamp ? timestamp.toMillis() : Date.now();
div.setAttribute('timestamp', timestamp);

// figure out where to insert new message
const existingMessages = messageListElement.children;
if (existingMessages.length === 0) {
messageListElement.appendChild(div);
} else {
let messageListNode = existingMessages[0];

while (messageListNode) {
const messageListNodeTime = messageListNode.getAttribute('timestamp');

if (!messageListNodeTime) {
throw new Error(
    `Child ${messageListNode.id} has no 'timestamp' attribute`
);
}

if (messageListNodeTime > timestamp) {
break;
}

messageListNode = messageListNode.nextSibling;
}

messageListElement.insertBefore(div, messageListNode);
}

return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
var div =
document.getElementById(id) || createAndInsertMessage(timestamp);

// profile picture
if (picUrl) {
div.querySelector('.pic').style.backgroundImage =
'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
}

div.querySelector('.name').textContent = name;
var messageElement = div.querySelector('.message');

if (text) {
// If the message is text.
messageElement.textContent = text;
// Replace all line breaks by <br>.
messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
} else if (imageUrl) {
// If the message is an image.
var image = document.createElement('img');
image.addEventListener('load', function () {
messageListElement.scrollTop = messageListElement.scrollHeight;
});
image.src = imageUrl;

messageElement.innerHTML = '';
messageElement.appendChild(image);
}
// Show the card fading-in and scroll to view the new message.
setTimeout(function () {
div.classList.add('visible');
}, 1);
messageListElement.scrollTop = messageListElement.scrollHeight;
messageInputElement.focus();
}

const messageRef = sRef(db, 'allMessages');
onValue(messageRef, (snapshot) => {
    const data = snapshot.val();
    if(data != null){
        console.log(data);
        let setToList = [new Set(data)];
        for(let i = 0; i < data.length; i++){
            if(data[i].text != null || data[i].imageUrl != null){
                displayMessage(i, data[i].timestamp, data[i].name, data[i].text, data[i].profilePicUrl, data[i].imageUrl );
            }  
            
        }
    }       
});

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Events for image upload.
imageButtonElement.addEventListener('click', function (e) {
e.preventDefault();
mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
event.preventDefault();
var file = event.target.files[0];


// Clear the selection in the file picker input.
imageFormElement.reset();

// Check if the file is an image.
if (!file.type.match('image.*')) {
var data = {
message: 'You can only share images',
timeout: 2000,
};
signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
return;
}
// Check if the user is signed-in
if (checkSignedInWithMessage()) {
saveImageMessage(file);
}
}

// Saves a new message containing an image in Firebase.
// This first saves the image in Firebase storage.
async function saveImageMessage(file){
try{
// 1 - Add a message with a loading icon that will get updated with the shared image
function writeUserData(name, email, imageUrl) {
set(sRef(db, 'messages/'), {
name: getUserName(),
imageUrl: LOADING_IMAGE_URL,
profilePicUrl: getProfilePicUrl()
});
}
writeUserData(getUserName(), LOADING_IMAGE_URL, getProfilePicUrl);

const formData = new FormData();
formData.append("file", file);
console.log(formData);
fetch("http://localhost:8080/uploadfiles", {
method: 'POST',
body: formData
})
.then((res) => console.log(res))
.then((err) => ("Error occured", err)); 

}
catch(error){
console.error('There was an error uploading a file to Cloud Storage: ', error);
}
}

function saveMessagingDeviceToken() {
try{
const currentToken = getToken(getMessaging());
if(currentToken){
console.log('Got FCM device token:', currentToken);
// Saving the Device Token to Real-Time Database.
const updates = {};
updates['messages/fcmTokens'] = currentToken;
update(ref(db), updates);

// This will fire when a message is received while the app is in the foreground.
// When the app is in the background, firebase-messaging-sw.js will receive the message instead.
onMessage(getMessaging(), (message) => {
    console.log(
        'New foreground notification from Firebase Messaging!',
        message.notification
    );
});
} else {
// Need to request permissions to show notifications.
requestNotificationsPermissions();
}
} catch(error) {
console.error('Unable to get messaging token.', error);
}
}

function requestNotificationsPermissions(){
console.log('Requesting notifications permission...');
const permission = Notification.requestPermission();
if(permission === 'granted'){
console.log('Notification permission granted.');
// Notification permission granted
saveMessagingDeviceToken();
} else {
console.log('Unable to get permission to notify.');
}
}

initFirebaseAuth();
authStateObserver(getAuth().currentUser);

document.getElementById('bookme').addEventListener('click', function(){
window.location = 'http://localhost:8080/host/index.html';
});
