const express = require('express');
const path = require('path');
const cors = require('cors');
const { initializeApp } = require('firebase-admin/app');
var admin = require("firebase-admin");
var serviceAccount = require("./src/booking-app-6750f-4b6124a7337e.json")
const { getDatabase, ref, onValue, set, update, remove } = require('firebase/database');
const { getAuth, onAuthStateChanged, currentUser } = require('firebase/auth');
const { addDoc, collection, getFirestore, Timestamp, fromDate, orderBy, limit, onSnapshot, query, serverTimestamp, setDoc } = require('firebase/firestore');
const app = express();
const port = process.env.PORT || 8080;
const stripe = require('stripe')('sk_test_51KRid6JhNHZfzXZ6P4Vy6VtppsuokDqbPnbjQbgMyy3GyafwMEmRd2wesd1bgFqMdB02fXux4nnOllhdYbY4ddV200ZlZM1OMC');
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const upload = multer({dest: "uploads/"});
var type = upload.single('file');
const fs = require('fs');
const { getStorage } = require("firebase-admin/storage");
//const dom = require('express-dom');

//app.get('*.html', dom(), express.static(__dirname));

app.use(express.urlencoded({extended : true}));
app.use(express.json());

const endpointSecret =  'whsec_71ed46c7e6c22dbd550a4dadf1404c383d636573c9ba291a47c5f71f5b3f58bc';

app.use(cors({
    'Allow-Access-Control-Origin': '',
}));

app.use(express.static(__dirname));

//const firebase = require('firebase');
const App = require('firebase/app');
require('firebase/database');
const bodyParser = require('body-parser');
const { response } = require('express');
const { url } = require('inspector');

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '-' + dd + '-' + yyyy;

const firebaseConfig = {
    apiKey: "AIzaSyAN-hSy8cWKUKJS4SxjNcN9lrmvZPTy430",
    authDomain: "booking-app-6750f.firebaseapp.com",
    databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
    projectId: "booking-app-6750f",
    storageBucket: "booking-app-6750f.appspot.com",
    messagingSenderId: "687482685582",
    appId: "1:687482685582:web:a91f903ce5133c4f5aa1df",
    measurementId: "G-0WDDDKD9ZL"
};
App.initializeApp(firebaseConfig);

//  admin.initializeApp()

const auth = getAuth();
const db = getDatabase();

let itemName;
let userId;
let dates;
let img;
let datesLength;
let stat;
let itemPrice;
let app_fee;
let itemId = uuidv4();
let accid;
let code;
let serveUrl;
let imgSrc;
let rmName;
let crName;
let trName;
let roomDates;
let checkinInfo;
let rmSearchUrl;
let regList;
let deletedId;


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
    storageBucket: 'booking-app-6750f.appspot.com'
});

const adminDB = admin.database();
const database = admin.firestore();
const listingDb = database.collection('listings');
const profileDb = database.collection('drivers');
const lstLocationDb = database.collection('lstLocations');
const profLocationDb = database.collection('profLocations');



// update usersDb with allMessages+bookingId format
const usersDb = database.collection('allMessages');
let timestamp = serverTimestamp();
const databaseRef = ref(adminDB, 'messages/');

//console.log(serveUrl);

onValue(databaseRef, (snapshot) => {
    const data = snapshot.val();
        try{
            if(data != null){
                usersDb.doc().set({
                    name: data.name,
                    profilePicUrl: data.profilePicUrl,
                    text: data.text,
                });
            } 
        } catch(error) {
            console.error('Error writing new message to Firebase Database', error);
        } 
},{
    onlyOnce: true
});

app.post("/uploadfiles", upload.single('file'), 
function uploadFiles(req, res){
    
    //console.log(req.body);
    
    res.json({ message: "Successfully uploaded file" });

    let uploads = './uploads';
    let filepath = path.join(uploads, req.file.filename);
    //console.log(filepath);
    // app.get('/', (req, res) => {
    //     res.sendFile(filepath, { root: __dirname });
    // });
    
    onValue(databaseRef, (snapshot) => {
        const data = snapshot.val();
        usersDb.doc().set({
            name: data.name,
            profilePicUrl: data.profilePicUrl,
            imageUrl: filepath
            
            
        });

    }, {
        onlyOnce: true
    });

    // 4 - Update the chat message placeholder with the image's URL
    const updates = {};
    updates['messages/imageUrl'] = filepath;
    update(ref(adminDB),updates);

}
);

app.post("/uploadimgfiles", upload.single('file'), 
function uploadFiles(req, res){
    
    //console.log(req.body);
    
    res.json({ message: "Successfully uploaded file" });
    let uploads = './uploads/';
    let filepath = path.join(uploads, req.file.filename);
    console.log(filepath);
    // app.get('/', (req, res) => {
    //     res.sendFile(filepath, { root: __dirname });
    // });
    
    let profileRef = ref(adminDB,'profile/');
    if(profileRef != null){
      //  console.log(profileRef);
        onValue(profileRef, (snapshot) => {
            let data = snapshot.val();
            if(data != null ){
                let updates = {};
                updates['drivers/driverAccount/'+data.userId+'/profile/licenseImg'] = filepath;
                updates['/profile/licenseImg'] = filepath;
                update(ref(adminDB), updates);
        //        console.log(data);
                // profileDb.doc(data.Name).set({
                //     Name: data.Name,
                //     licenseImg: filepath,
                    
                //     userId: data.userId,
                //     profileImg: data.profileImg,
                //     itemId: itemId
                // });
                    
                
            }
        }, {
            onlyOnce: true
        })
    }
});

// app.post("/uploadprof", upload.single('file'), 
// function uploadFiles(req, res){
    
//     console.log(req.body);
    
//     res.json({ message: "Successfully uploaded file" });

//     let uploads = './uploads/';
//     let newfilepath = path.join(uploads, req.file.filename);
//     app.get('/', (req, res) => {
//         res.sendFile(filepath, { root: __dirname });
//     });
    
//     let profileRef = ref(adminDB,'profile/');
//     if(profileRef != null){
//         console.log(profileRef);
//         onValue(profileRef, (snapshot) => {
//             let data = snapshot.val();
//             if(data != null ){
//                 let updates = {};
//                 updates['drivers/driverAccount/'+data.userId+'/profile/profileImg'] = newfilepath;
//                 updates['/profile/profileImg'] = newfilepath;
//                 update(ref(adminDB), updates);
//             }
//         }, {
//             onlyOnce: true
//         })
//     }
// });

let profileRefdb = ref(adminDB,'profile/');
if(profileRefdb != null){
    //console.log(profileRefdb);
    onValue(profileRefdb, (snapshot) => {
        let data = snapshot.val();
       // console.log(data);
        if(data != null && data.location != null && data.profileImg != null){
            const profilesRef = profileDb.doc(data.Name);
            profilesRef.get().then((docSnapshot) => {
                if(data != null && data.Name != null && data.location != null && data.profileImg != null && data.price != null && !docSnapshot.exists){
                profileDb.doc(data.Name).set({
                    Name: data.Name,
                    licenseImg: data.licenseImg,
                    profileImg: data.profileImg,
                    location: data.location,
                    userId: data.userId,
                    price: data.price,
                    itemId: itemId
                });
                } 
            });
        }
    }, {
        onlyOnce: true
    })
}


let messages = [];
updates = {};
const recentMessageQuery = usersDb.get().then((QuerySnapshot) => {

        QuerySnapshot.forEach((doc) => {
            var message = doc.data();
            messages.push(message);
        });
       // console.log(messages);
        // update firestore with allMessages+bookingId for each chat room
        updates['allMessages'] = messages;
        update(ref(adminDB), updates);
    
});

let locList = [];
let profLocList = [];

regList = ref(db, 'listings/listings/');
profList = ref(db, 'profiles/profiles');
let dltrf = adminDB.ref('listing/');

app.post('/host/listings', (req, res) => {
    onValue(regList, (snapshot) => {
        const regListData = snapshot.val();
        if(regListData != null){
            for(let i = 0; i < regListData.length; i++){
                listingDb.get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                       // console.log('here!');
                      //  console.log(req.headers.cookie);
                        if(req.headers.cookie != 'undefined'){
                            //console.log(req.headers.cookie);
                            let storedC = req.headers.cookie+'';
                            storedC = storedC.split(';');
                            //console.log(storedC);
                            let result = [];
                            for(let i in storedC){
                                //console.log(storedC[i].split('='));
                                result.push(storedC[i].split('='));
                            }
                            //console.log(result);
                            for(let i in result){
                                if(result[i][0] === 'deletedId' || result[i][0] === ' deletedId'){
                                    deletedId = result[i][1];
                                    if(doc.data().itemId == deletedId){
                                        listingDb.doc(doc.data().listingName).delete().then(() => {
                                         //   console.log("Document successfully deleted");
                                            // restart server here.
                                        });
                                    }
                                    onValue(dltrf, (snapshot) => {
                                        let dltrfData = snapshot.val();
                                        if(dltrfData.itemId == deletedId){
                                            dltrf.remove();
                                        }
                                    });
                                }
                            }
                        }
                        
                    });
                });
            }
        }else{
            dltrf.remove();
            listingDb.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                   // console.log('here!');
                   // console.log(req.headers.cookie);
                    if(req.headers.cookie != 'undefined'){
                        //console.log(req.headers.cookie);
                        let storedC = req.headers.cookie+'';
                        storedC = storedC.split(';');
                        //console.log(storedC);
                        let result = [];
                        for(let i in storedC){
                            //console.log(storedC[i].split('='));
                            result.push(storedC[i].split('='));
                        }
                        //console.log(result);
                        for(let i in result){
                            if(result[i][0] === 'deletedId' || result[i][0] === ' deletedId'){
                                deletedId = result[i][1];
                                if(doc.data().itemId == deletedId){
                                    listingDb.doc(doc.data().listingName).delete().then(() => {
                                      //  console.log("Document successfully deleted");
                                        // restart server here.
                                    });
                                }
                            }
                        }
                    }
                    
                })
            });
        }
    });
});

onValue(regList, (snapshot) => {
    const listData = snapshot.val();
    if(listData != null){
        for(let i = 0; i < listData.length; i++){
            
            if(listData[i] != null && (listData[i].listingType == 'room' || listData[i].listingType == 'car')){
                let lstObj = {
                    loc: listData[i].location,
                    locType: listData[i].listingType,
                    itemId: listData[i].itemId
                };
                locList[i] = lstObj;
            } 
        }
       // console.log(locList);
        set(ref(db, 'lstLocations/'), {
            locList
        });
    }
}, {
    onlyOnce: true
});

onValue(profList, (snapshot) => {
    const profListData = snapshot.val();
    if(profListData != null){
        for(let i = 0; i < profListData.length; i++){
            let profLstObj = {
                loc: profListData[i].location,
                locType: 'driver',
                itemId: profListData[i].itemId
            };  
            profLocList[i] = profLstObj; 
        }
      //  console.log(profLocList);
        set(ref(db, 'profLocations/'), {
            profLocList
        });
    }
}, {
    onlyOnce: true
});

onValue(regList, (snapshot) => {
    const newData = snapshot.val();
    //console.log(newData);
    if(newData != null){
        for(let i = 0; i < newData.length; i++){
            if(newData[i] != null && newData[i].listingType === 'room'){
                let rmSearchUrl = ref(adminDB, 'rooms/'+newData[i].listingName);
                onValue(rmSearchUrl, (snapshot) => {
                    let rmsearchData = snapshot.val();
                    if(rmsearchData != null ){
                       // console.log(rmsearchData.bookingUrl);
                        if(rmsearchData.bookingUrl != null){
                            //console.log(rmsearchData.bookingUrl);
                            let splitDt = rmsearchData.bookingUrl.split('/');
                            serveUrl = splitDt[3];
                            const destination = serveUrl+'.html';
                            const filePath = serveUrl+'.html';

                            let contents = `
                            <!DOCTYPE html>
                            <html>
                            <head></head>
                            <script type="module" src="asset.js"></script>
                            <!-- Material Design Lite -->
                            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
                            <link rel="stylesheet" href="https://code.getmdl.io/1.1.3/material.orange-indigo.min.css">
                            <script defer src="https://code.getmdl.io/1.1.3/material.min.js"></script>
                
                            <!-- App Styling -->
                            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
                            <link rel="stylesheet" href="main.css">
                            <body>
                                <div>
                                    <div id="chatBox">
                                        <div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
                                        <header class="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700">
                                        <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
                                        <div id="bookme" class="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                                            <h3><i class="material-icons">chat_bubble_outline</i>BookMe</h3>
                                        </div>
                                        <div id="user-container">
                                            <div hidden id="user-pic"></div>
                                            <div hidden id="user-name"></div>
                                            <button hidden id="sign-out" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                                            Sign-out
                                            </button>
                                            <button id="sign-in" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                                            <i class="material-icons">account_circle</i>Sign-in with Google
                                            </button>
                                        </div>
                                        </div>
                                    </header>
                                    <main class="mdl-layout__content mdl-color--grey-100">
                                    <div>
                                        <div id="img" style="display: flex; flex-direction: row;">
                                            <img src=`+rmsearchData.img+` style="width: 400px; height: 400px;  border-radius: 100px; padding-top: 1em; padding-left: 1em;"></img>
                                            <div id="bookingInfo" style="padding-left: 2em;">
                                                <h1>`+rmsearchData.listingName+`</h1>
                                                <h3>Booked Dates: `+rmsearchData.roomDates[0]+` - `+rmsearchData.roomDates[1]+`</h3>
                                                <h3>Check-In Info: `+rmsearchData.checkin+`</h3>
                                                <button id="checkin" style="display: none;">Check In</button>
                                            </div>
                                            
                                            
                                        </div>
                                    </div> 
                                        <div id="messages-card-container" style="width: 100%; margin-left: 2em; display: flex; justify-content: center;" >
                                            <div id="messages-card" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop">
                                                <div class="mdl-card__supporting-text mdl-color-text--grey-600">
                                                <div id="messages">
                                                </div>
                                                <form id="message-form">
                                                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                                    <input class="mdl-textfield__input" type="text" id="message" autocomplete="off">
                                                    <label class="mdl-textfield__label" for="message">Message...</label>
                                                    </div>
                                                    <button id="submit" disabled type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                                                    Send
                                                    </button>
                                                </form>
                                                <form id="image-form" action="#" >
                                                    <input id="mediaCapture" type="file" accept="image/*" capture="camera">
                                                    <button id="submitImage" title="Add an image" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white">
                                                    <i class="material-icons">image</i>
                                                    </button>
                                                </form>
                                                </div>
                                                <div>
                                                    <a href="https://polar-scrubland-06961.herokuapp.com/host/index.html">Close Chat</a>
                                                </div>
                                            </div>
                
                                            <div id="must-signin-snackbar" class="mdl-js-snackbar mdl-snackbar">
                                                <div class="mdl-snackbar__text"></div>
                                                <button class="mdl-snackbar__action" type="button"></button>
                                            </div>
                
                                            <script type="module">
                                                // Import the functions you need from the SDKs you need
                                                import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
                                                import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
                                                import { initializeAuth,getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
                                                import { getDatabase, ref, set, push, child, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
                                                import {getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
                                                // TODO: Add SDKs for Firebase products that you want to use
                                                // https://firebase.google.com/docs/web/setup#available-libraries
                                                
                                                // Your web app's Firebase configuration
                                                // For Firebase JS SDK v7.20.0 and later, measurementId is optional
                                                const firebaseConfig = {
                                                    apiKey: "AIzaSyAN-hSy8cWKUKJS4SxjNcN9lrmvZPTy430",
                                                    authDomain: "booking-app-6750f.firebaseapp.com",
                                                    databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
                                                    projectId: "booking-app-6750f",
                                                    storageBucket: "booking-app-6750f.appspot.com",
                                                    messagingSenderId: "687482685582",
                                                    appId: "1:687482685582:web:a91f903ce5133c4f5aa1df",
                                                    measurementId: "G-0WDDDKD9ZL"
                                                    };
                                                
                                                // Initialize Firebase
                                                const app = initializeApp(firebaseConfig);
                                                const analytics = getAnalytics(app);
                                                const auth = getAuth();  
                                                const db = getDatabase(); 
                
                                                console.log(auth);
                                                let updates = {};
                
                                                onAuthStateChanged(auth, (user) => {
                                                    if(user){
                                                        console.log(user);
                                                        let status = document.createElement('h2');
                                                        status.innerText = 'Checked In';
                                                        let roomRef = ref(db, 'rooms/`+rmsearchData.listingName+`');
                                                        onValue(roomRef, (snapshot) => {
                                                            let data = snapshot.val();
                                                            
                                                            if(data.currentUser == user.uid && data.checkedIn == null){
                                                                document.getElementById('checkin').style.display = 'block';
                                                            } else if(data.host == user.uid && data.checkedIn == 'True'){
                                                                document.getElementById('bookingInfo').appendChild(status);
                                                            } else if(data.currentUser == user.uid && data.checkedIn == 'True'){
                                                                document.getElementById('bookingInfo').appendChild(status);
                                                            } 
                                                        });
                                                        document.getElementById('checkin').addEventListener('click', function(){
                                                            console.log('checked in!');
                                                            updates['rooms/`+rmsearchData.listingName+`/checkedIn'] = "True";
                                                            update(ref(db), updates);
                                                            let checkinBtn = document.getElementById('checkin');
                                                            checkinBtn.remove();
                                                           
                                                            document.getElementById('bookingInfo').appendChild(status);
                                                        });
                                                    }
                                                })
                                            </script>
                                            <script type="text/javascript">!function(n,e){var t,o,i,c=[],f={passive:!0,capture:!0},r=new Date,a="pointerup",u="pointercancel";function p(n,c){t||(t=c,o=n,i=new Date,w(e),s())}function s(){o>=0&&o<i-r&&(c.forEach(function(n){n(o,t)}),c=[])}function l(t){if(t.cancelable){var o=(t.timeStamp>1e12?new Date:performance.now())-t.timeStamp;"pointerdown"==t.type?function(t,o){function i(){p(t,o),r()}function c(){r()}function r(){e(a,i,f),e(u,c,f)}n(a,i,f),n(u,c,f)}(o,t):p(o,t)}}function w(n){["click","mousedown","keydown","touchstart","pointerdown"].forEach(function(e){n(e,l,f)})}w(n),self.perfMetrics=self.perfMetrics||{},self.perfMetrics.onFirstInputDelay=function(n){c.push(n),s()}}(addEventListener,removeEventListener);</script>
                                        </div>
                                    </main>
                                        </div>
                                    </div>
                                </div>
                            </body>
                            </html>`
        
            fs.writeFileSync(filePath, contents);
            let bucket = getStorage().bucket();
            bucket.upload(filePath, {destination, public:true, metadata:{cacheControl: 'public, max-age=60'}});
               

            }
                    
                    }
                }, {
                    onlyOnce: true
                });
        
            } else if(newData[i] != null && newData[i].listingType === 'car'){
                let crSearchUrl = ref(adminDB, 'cars/'+newData[i].listingName);
                onValue(crSearchUrl, (snapshot) => {
                    let crsearchData = snapshot.val();
                    if(crsearchData != null ){
                        if(crsearchData.bookingUrl != null){
                            let splitDt = crsearchData.bookingUrl.split('/');
                            serveUrl = splitDt[3];
                            const destination = serveUrl+'.html';
                            const filePath = serveUrl+'.html';
                            let contents = `
                            <!DOCTYPE html>
                            <html>
                            <head></head>
                            <script type="module" src="asset.js"></script>
                            <!-- Material Design Lite -->
                            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
                            <link rel="stylesheet" href="https://code.getmdl.io/1.1.3/material.orange-indigo.min.css">
                            <script defer src="https://code.getmdl.io/1.1.3/material.min.js"></script>
        
                            <!-- App Styling -->
                            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
                            <link rel="stylesheet" href="main.css">
                            <body>
                                <div>
                                    <div id="chatBox">
                                        <div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
                                        <header class="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700">
                                        <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
                                        <div id="bookme" class="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                                            <h3><i class="material-icons">chat_bubble_outline</i>BookMe</h3>
                                        </div>
                                        <div id="user-container">
                                            <div hidden id="user-pic"></div>
                                            <div hidden id="user-name"></div>
                                            <button hidden id="sign-out" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                                            Sign-out
                                            </button>
                                            <button id="sign-in" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                                            <i class="material-icons">account_circle</i>Sign-in with Google
                                            </button>
                                        </div>
                                        </div>
                                    </header>
                                    <main class="mdl-layout__content mdl-color--grey-100">
                                    <div>
                                        <div id="img" style="display: flex; flex-direction: row;">
                                            <img src=`+crsearchData.listingImg+` style="width: 400px; height: 400px;  border-radius: 100px; padding-top: 1em; padding-left: 1em;"></img>
                                            <div id="bookingInfo" style="padding-left: 2em;">
                                                <h1>`+crsearchData.listingName+`</h1>
                                                <h3>Booked Dates: `+crsearchData.carDates[0]+` - `+crsearchData.carDates[1]+`</h3>
                                                <button id="pickup" style="display: none;">Pick Up</button>
                                                
                                            </div>
                                            
                                            
                                        </div>
                                    </div> 
                                        <div id="messages-card-container" style="width: 100%; margin-left: 2em; display: flex; justify-content: center;" >
                                            <div id="messages-card" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop">
                                                <div class="mdl-card__supporting-text mdl-color-text--grey-600">
                                                <div id="messages">
                                                </div>
                                                <form id="message-form">
                                                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                                    <input class="mdl-textfield__input" type="text" id="message" autocomplete="off">
                                                    <label class="mdl-textfield__label" for="message">Message...</label>
                                                    </div>
                                                    <button id="submit" disabled type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                                                    Send
                                                    </button>
                                                </form>
                                                <form id="image-form" action="#" >
                                                    <input id="mediaCapture" type="file" accept="image/*" capture="camera">
                                                    <button id="submitImage" title="Add an image" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white">
                                                    <i class="material-icons">image</i>
                                                    </button>
                                                </form>
                                                </div>
                                                <div>
                                                    <a href="https://polar-scrubland-06961.herokuapp.com/index.html">Close Chat</a>
                                                </div>
                                            </div>
        
                                            <div id="must-signin-snackbar" class="mdl-js-snackbar mdl-snackbar">
                                                <div class="mdl-snackbar__text"></div>
                                                <button class="mdl-snackbar__action" type="button"></button>
                                            </div>
        
                                            <script type="module">
                                            // Import the functions you need from the SDKs you need
                                            import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
                                            import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
                                            import { initializeAuth,getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
                                            import { getDatabase, ref, set, push, child, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
                                            import {getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
                                            // TODO: Add SDKs for Firebase products that you want to use
                                            // https://firebase.google.com/docs/web/setup#available-libraries
                                            
                                            // Your web app's Firebase configuration
                                            // For Firebase JS SDK v7.20.0 and later, measurementId is optional
                                            const firebaseConfig = {
                                                apiKey: "AIzaSyAN-hSy8cWKUKJS4SxjNcN9lrmvZPTy430",
                                                authDomain: "booking-app-6750f.firebaseapp.com",
                                                databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
                                                projectId: "booking-app-6750f",
                                                storageBucket: "booking-app-6750f.appspot.com",
                                                messagingSenderId: "687482685582",
                                                appId: "1:687482685582:web:a91f903ce5133c4f5aa1df",
                                                measurementId: "G-0WDDDKD9ZL"
                                                };
                                            
                                            // Initialize Firebase
                                            const app = initializeApp(firebaseConfig);
                                            const analytics = getAnalytics(app);
                                            const auth = getAuth();  
                                            const db = getDatabase(); 
            
                                            console.log(auth);
                                            let updates = {};
            
                                            onAuthStateChanged(auth, (user) => {
                                                if(user){
                                                    console.log(user);
                                                    let status = document.createElement('h2');
                                                    status.innerText = 'Picked Up';
                                                    let carRef = ref(db, 'cars/`+crsearchData.listingName+`');
                                                    onValue(carRef, (snapshot) => {
                                                        let data = snapshot.val();
                                                        
                                                        if(data.currentUser == user.uid && data.pickedUp == null){
                                                            document.getElementById('pickup').style.display = 'block';
                                                        } else if(data.host == user.uid && data.pickedUp == 'True'){
                                                            
                                                            document.getElementById('bookingInfo').appendChild(status);
                                                        } else if(data.currentUser == user.uid && data.pickedUp == 'True'){
                                                           
                                                            document.getElementById('bookingInfo').appendChild(status);
                                                        }
                                                    });
                                                    document.getElementById('pickup').addEventListener('click', function(){
                                                        console.log('picked up!');
                                                        updates['cars/`+crsearchData.listingName+`/pickedUp'] = "True";
                                                        update(ref(db), updates);
                                                        let pickUpBtn = document.getElementById('pickup');
                                                        pickUpBtn.remove();
                                                        document.getElementById('bookingInfo').appendChild(status);
                                                    });
                                                }
                                            })
                                        </script>
                                            <script type="text/javascript">!function(n,e){var t,o,i,c=[],f={passive:!0,capture:!0},r=new Date,a="pointerup",u="pointercancel";function p(n,c){t||(t=c,o=n,i=new Date,w(e),s())}function s(){o>=0&&o<i-r&&(c.forEach(function(n){n(o,t)}),c=[])}function l(t){if(t.cancelable){var o=(t.timeStamp>1e12?new Date:performance.now())-t.timeStamp;"pointerdown"==t.type?function(t,o){function i(){p(t,o),r()}function c(){r()}function r(){e(a,i,f),e(u,c,f)}n(a,i,f),n(u,c,f)}(o,t):p(o,t)}}function w(n){["click","mousedown","keydown","touchstart","pointerdown"].forEach(function(e){n(e,l,f)})}w(n),self.perfMetrics=self.perfMetrics||{},self.perfMetrics.onFirstInputDelay=function(n){c.push(n),s()}}(addEventListener,removeEventListener);</script>
                                        </div>
                                    </main>
                                        </div>
                                    </div>
                                </div>
                            </body>
                            </html>`
    
                            fs.writeFileSync(filePath, contents);
                            let bucket = getStorage().bucket();
                            bucket.upload(filePath, {destination, public:true, metadata:{cacheControl: 'public, max-age=60'}});
                
                                        }
                                    
                                    }
                                }, {
                                    onlyOnce: true
                                });
                        
                            }   else if(newData[i] != null && newData[i].listingType === 'tour'){
                                let trSearchUrl = ref(adminDB, 'tours/'+newData[i].listingName);
                                onValue(trSearchUrl, (snapshot) => {
                                    let trsearchData = snapshot.val();
                                    if(trsearchData != null ){
                                        if(trsearchData.bookingUrl != null){
                                            let splitDt = trsearchData.bookingUrl.split('/');
                                            serveUrl = splitDt[3];
                                            const destination = serveUrl+'.html';
                                            const filePath = serveUrl+'.html';
                                            let contents = `
                                            <!DOCTYPE html>
                                            <html>
                                            <head></head>
                                            <script type="module" src="asset.js"></script>
                                            <!-- Material Design Lite -->
                                            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
                                            <link rel="stylesheet" href="https://code.getmdl.io/1.1.3/material.orange-indigo.min.css">
                                            <script defer src="https://code.getmdl.io/1.1.3/material.min.js"></script>
                        
                                            <!-- App Styling -->
                                            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
                                            <link rel="stylesheet" href="main.css">
                                            <body>
                                                <div>
                                                    <div id="chatBox">
                                                        <div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
                                                        <header class="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700">
                                                        <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
                                                        <div id="bookme" class="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                                                            <h3><i class="material-icons">chat_bubble_outline</i>BookMe</h3>
                                                        </div>
                                                        <div id="user-container">
                                                            <div hidden id="user-pic"></div>
                                                            <div hidden id="user-name"></div>
                                                            <button hidden id="sign-out" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                                                            Sign-out
                                                            </button>
                                                            <button id="sign-in" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                                                            <i class="material-icons">account_circle</i>Sign-in with Google
                                                            </button>
                                                        </div>
                                                        </div>
                                                    </header>
                                                    <main class="mdl-layout__content mdl-color--grey-100">
                                                    <div>
                                                        <div id="img" style="display: flex; flex-direction: row;">
                                                            <img src=`+trsearchData.listingImg+` style="width: 400px; height: 400px;  border-radius: 100px; padding-top: 1em; padding-left: 1em;"></img>
                                                            <div id="bookingInfo" style="padding-left: 2em;">
                                                                <h1>`+trsearchData.listingName+`</h1>
                                                                <h3>Booked Dates: `+trsearchData.tourDates[0]+` - `+trsearchData.tourDates[1]+`</h3>
                                                                <button id="start" style="display: none;">Start Tour</button>
                                                                
                                                            </div>
                                                            
                                                            
                                                        </div>
                                                    </div> 
                                                        <div id="messages-card-container" style="width: 100%; margin-left: 2em; display: flex; justify-content: center;" >
                                                            <div id="messages-card" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop">
                                                                <div class="mdl-card__supporting-text mdl-color-text--grey-600">
                                                                <div id="messages">
                                                                </div>
                                                                <form id="message-form">
                                                                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                                                    <input class="mdl-textfield__input" type="text" id="message" autocomplete="off">
                                                                    <label class="mdl-textfield__label" for="message">Message...</label>
                                                                    </div>
                                                                    <button id="submit" disabled type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                                                                    Send
                                                                    </button>
                                                                </form>
                                                                <form id="image-form" action="#" >
                                                                    <input id="mediaCapture" type="file" accept="image/*" capture="camera">
                                                                    <button id="submitImage" title="Add an image" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white">
                                                                    <i class="material-icons">image</i>
                                                                    </button>
                                                                </form>
                                                                </div>
                                                                <div>
                                                                    <a href="https://polar-scrubland-06961.herokuapp.com/index.html">Close Chat</a>
                                                                </div>
                                                            </div>
                        
                                                            <div id="must-signin-snackbar" class="mdl-js-snackbar mdl-snackbar">
                                                                <div class="mdl-snackbar__text"></div>
                                                                <button class="mdl-snackbar__action" type="button"></button>
                                                            </div>
        
                                                             <script type="module">
                                                                // Import the functions you need from the SDKs you need
                                                                import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
                                                                import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
                                                                import { initializeAuth,getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
                                                                import { getDatabase, ref, set, push, child, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
                                                                import {getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
                                                                // TODO: Add SDKs for Firebase products that you want to use
                                                                // https://firebase.google.com/docs/web/setup#available-libraries
                                                                // Your web app's Firebase configuration
                                                                // For Firebase JS SDK v7.20.0 and later, measurementId is optional
                                                                const firebaseConfig = {
                                                                    apiKey: "AIzaSyAN-hSy8cWKUKJS4SxjNcN9lrmvZPTy430",
                                                                    authDomain: "booking-app-6750f.firebaseapp.com",
                                                                    databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
                                                                    projectId: "booking-app-6750f",
                                                                    storageBucket: "booking-app-6750f.appspot.com",
                                                                    messagingSenderId: "687482685582",
                                                                    appId: "1:687482685582:web:a91f903ce5133c4f5aa1df",
                                                                    measurementId: "G-0WDDDKD9ZL"
                                                                    };
                                                                
                                                                // Initialize Firebase
                                                                const app = initializeApp(firebaseConfig);
                                                                const analytics = getAnalytics(app);
                                                                const auth = getAuth();  
                                                                const db = getDatabase(); 
        
                                                                console.log(auth);
                                                                let updates = {};
        
                                                                onAuthStateChanged(auth, (user) => {
                                                                    if(user){
                                                                        console.log(user);
                                                                        let status = document.createElement('h2');
                                                                        status.innerText = 'Tour Started';
                                                                        let tourRef = ref(db, 'tours/`+trsearchData.listingName+`');
                                                                        onValue(tourRef, (snapshot) => {
                                                                            let data = snapshot.val();
                                                                            if(data.currentUser == user.uid && data.tourStarted == null){
                                                                                document.getElementById('start').style.display = 'block';
                                                                            } else if(data.host == user.uid && data.tourStarted == 'True'){
                                                                               
                                                                                document.getElementById('bookingInfo').appendChild(status);
                                                                            } else if(data.currentUser == user.uid && data.tourStarted == 'True'){
                                                                               
                                                                                document.getElementById('bookingInfo').appendChild(status);
                                                                            }
                                                                        });
                                                                        document.getElementById('start').addEventListener('click', function(){
                                                                            console.log('checked in!');
                                                                            updates['tours/`+trsearchData.listingName+`/tourStarted'] = "True";
                                                                            update(ref(db), updates);
                                                                            let tourStartBtn = document.getElementById('start');
                                                                            tourStartBtn.remove();
                                                                           
                                                                            document.getElementById('bookingInfo').appendChild(status);
                                                                        });
                                                                    }
                                                                })
                                                            </script>
                                                            <script type="text/javascript">!function(n,e){var t,o,i,c=[],f={passive:!0,capture:!0},r=new Date,a="pointerup",u="pointercancel";function p(n,c){t||(t=c,o=n,i=new Date,w(e),s())}function s(){o>=0&&o<i-r&&(c.forEach(function(n){n(o,t)}),c=[])}function l(t){if(t.cancelable){var o=(t.timeStamp>1e12?new Date:performance.now())-t.timeStamp;"pointerdown"==t.type?function(t,o){function i(){p(t,o),r()}function c(){r()}function r(){e(a,i,f),e(u,c,f)}n(a,i,f),n(u,c,f)}(o,t):p(o,t)}}function w(n){["click","mousedown","keydown","touchstart","pointerdown"].forEach(function(e){n(e,l,f)})}w(n),self.perfMetrics=self.perfMetrics||{},self.perfMetrics.onFirstInputDelay=function(n){c.push(n),s()}}(addEventListener,removeEventListener);</script>
                                                        </div>
                                                    </main>
                                                        </div>
                                                    </div>
                                                </div>
                                            </body>
                                            </html>`
                    
                                            fs.writeFileSync(filePath, contents);
                                            let bucket = getStorage().bucket();
                                            bucket.upload(filePath, {destination, public:true, metadata:{cacheControl: 'public, max-age=60'}});
                                    
                                
                                                        }
                                                    
                                                    }
                                                }, {
                                                    onlyOnce: false
                                                });
                                        
                                            } 
            if(newData[i] != null){
                const loginRef = ref(db, 'hosts/hostAccount/'+newData[i].host+'/stripe/login');
                onValue(loginRef, (snapshot) => {
                    const data = snapshot.val();
                    if(data === null){
                        app.post('/host/analytics', async (req, res) => {
                            let url = req.headers.referer;
                                if(url.includes('?')){
                                   // console.log('parameterized url');
                                    let url1 = url.split('&');
                                    let url2 = url1[0].split('?');
                                    let url3 = url2[1].split('=');
                                    code = url3[1];
                                  //  console.log(code);
                            
                                    if(req.headers.cookie != 'undefined'){
                                    //console.log(req.headers.cookie);
                                    let storedC = req.headers.cookie+'';
                                    storedC = storedC.split(';');
                                    //console.log(storedC);
                                    let result = [];
                                    for(let i in storedC){
                                        //console.log(storedC[i].split('='));
                                        result.push(storedC[i].split('='));
                                    }
                                    //console.log(result);
                                    for(let i in result){
                                        if(result[i][0] === 'analyticsUID' || result[i][0] === ' analyticsUID'){
                                            userId = result[i][1];
                                         //   console.log(userId);
                                            const rsponse = await stripe.oauth.token({
                                                grant_type: 'authorization_code',
                                                code: code,
                                                assert_capabilities: ['transfers']
                                            });
                                            
                                            var connected_account_id = await rsponse.stripe_user_id;
                                        //    console.log(connected_account_id);
                            
                                            if(connected_account_id != 'undefined'){
                                                const link = await stripe.accounts.createLoginLink(connected_account_id);
                                            //    console.log(link);
                                                let updates = {};
                                                updates['hosts/hostAccount/'+userId+'/stripe/login'] = link.url;
                                                updates['hosts/hostAccount/'+userId+'/stripe/accid'] = connected_account_id;
                                                update(ref(db), updates);
                                            }
                                            
                                        }
                                    }
                                    }
                                }
                                
                        });
                    }
                }, {
                    onlyOnce: true
                });
                
            }
            }
        }
    }, {
    onlyOnce: true
});

let drvProfileRef = ref(adminDB, 'profiles/profiles');
onValue(drvProfileRef, (snapshot) => {
    const data = snapshot.val();
    if(data != null){
      //  console.log('profiles',data);
        for(let i = 0; i < data.length; i++){
            drName = data[i].Name;
            const loginRef = ref(db, 'drivers/driverAccount/'+data[i].userId+'/stripe/login');
            onValue(loginRef, (snapshot) => {
                const data = snapshot.val();
                if(data === null){
                    app.post('/host/drvanalytics', async (req, res) => {
                        let url = req.headers.referer;
                        if(url.includes('?')){
                        //    console.log('parameterized url');
                            let url1 = url.split('&');
                            let url2 = url1[0].split('?');
                            let url3 = url2[1].split('=');
                            code = url3[1];
                         //   console.log(code);
                    
                            if(req.headers.cookie != 'undefined'){
                            //console.log(req.headers.cookie);
                            let storedC = req.headers.cookie+'';
                            storedC = storedC.split(';');
                            //console.log(storedC);
                            let result = [];
                            for(let i in storedC){
                                //console.log(storedC[i].split('='));
                                result.push(storedC[i].split('='));
                            }
                            //console.log(result);
                            for(let i in result){
                                if(result[i][0] === 'analyticsUID' || result[i][0] === ' analyticsUID'){
                                    userId = result[i][1];
                                  //  console.log(userId);
                                    const rsponse = await stripe.oauth.token({
                                        grant_type: 'authorization_code',
                                        code: code,
                                        assert_capabilities: ['transfers']
                                    });
                                    
                                    var connected_account_id = await rsponse.stripe_user_id;
                                 //   console.log(connected_account_id);
                    
                                    if(connected_account_id != 'undefined'){
                                        const link = await stripe.accounts.createLoginLink(connected_account_id);
                                     //   console.log(link);
                                        let updates = {};
                                        updates['drivers/driverAccount/'+userId+'/stripe/login'] = link.url;
                                        updates['drivers/driverAccount/'+userId+'/stripe/accid'] = connected_account_id;
                                        update(ref(db), updates);
                                    }
                                    
                                }
                            }
                            }
                        }
                       
                    });
                }
            }, {
                onlyOnce: true
            });
            let drSearchUrl = ref(adminDB, 'bookedDrivers/'+drName);
            onValue(drSearchUrl, (snapshot) => {
                let drsearchData = snapshot.val();
                if(drsearchData != null ){
                    if(drsearchData.bookingUrl != null){
                        let splitDt = drsearchData.bookingUrl.split('/');
                        serveUrl = splitDt[3];
                        const destination = serveUrl+'.html';
                                            const filePath = serveUrl+'.html';
                                            let contents = `
                                            <!DOCTYPE html>
                                            <html>
                                            <head></head>
                                            <script type="module" src="asset.js"></script>
                                            <!-- Material Design Lite -->
                                            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
                                            <link rel="stylesheet" href="https://code.getmdl.io/1.1.3/material.orange-indigo.min.css">
                                            <script defer src="https://code.getmdl.io/1.1.3/material.min.js"></script>
                                
                                            <!-- App Styling -->
                                            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&amp;lang=en">
                                            <link rel="stylesheet" href="main.css">
                                            <body>
                                                <div>
                                                    <div id="chatBox">
                                                        <div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
                                                        <header class="mdl-layout__header mdl-color-text--white mdl-color--light-blue-700">
                                                        <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
                                                        <div id="bookme" class="mdl-layout__header-row mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
                                                            <h3><i class="material-icons">chat_bubble_outline</i>BookMe</h3>
                                                        </div>
                                                        <div id="user-container">
                                                            <div hidden id="user-pic"></div>
                                                            <div hidden id="user-name"></div>
                                                            <button hidden id="sign-out" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                                                            Sign-out
                                                            </button>
                                                            <button id="sign-in" class="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
                                                            <i class="material-icons">account_circle</i>Sign-in with Google
                                                            </button>
                                                        </div>
                                                        </div>
                                                    </header>
                                                    <main class="mdl-layout__content mdl-color--grey-100">
                                                    <div>
                                                        <div id="img" style="display: flex; flex-direction: row;">
                                                            <img src=`+drsearchData.img+` style="width: 400px; height: 400px;  border-radius: 100px; padding-top: 1em; padding-left: 1em;"></img>
                                                            <div id="bookingInfo" style="padding-left: 2em;">
                                                                <h1>`+drsearchData.driverName+`</h1>
                                                                <h3>Booked Dates: `+drsearchData.driverDates[0]+` - `+drsearchData.driverDates[1]+`</h3>
                                                                <button id="present" style="display: none;">Driver Present</button>
                                                                
                                                            </div>
                                                            
                                                            
                                                        </div>
                                                    </div> 
                                                        <div id="messages-card-container" style="width: 100%; margin-left: 2em; display: flex; justify-content: center;" >
                                                            <div id="messages-card" class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--6-col-tablet mdl-cell--6-col-desktop">
                                                                <div class="mdl-card__supporting-text mdl-color-text--grey-600">
                                                                <div id="messages">
                                                                </div>
                                                                <form id="message-form">
                                                                    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                                                                    <input class="mdl-textfield__input" type="text" id="message" autocomplete="off">
                                                                    <label class="mdl-textfield__label" for="message">Message...</label>
                                                                    </div>
                                                                    <button id="submit" disabled type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                                                                    Send
                                                                    </button>
                                                                </form>
                                                                <form id="image-form" action="#" >
                                                                    <input id="mediaCapture" type="file" accept="image/*" capture="camera">
                                                                    <button id="submitImage" title="Add an image" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-color--amber-400 mdl-color-text--white">
                                                                    <i class="material-icons">image</i>
                                                                    </button>
                                                                </form>
                                                                </div>
                                                                <div>
                                                                    <a href="https://polar-scrubland-06961.herokuapp.com/index.html">Close Chat</a>
                                                                </div>
                                                            </div>
                                
                                                            <div id="must-signin-snackbar" class="mdl-js-snackbar mdl-snackbar">
                                                                <div class="mdl-snackbar__text"></div>
                                                                <button class="mdl-snackbar__action" type="button"></button>
                                                            </div>
                                
                                                            <script type="module">
                                                            // Import the functions you need from the SDKs you need
                                                            import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
                                                            import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-analytics.js";
                                                            import { initializeAuth,getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";
                                                            import { getDatabase, ref, set, push, child, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
                                                            import {getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/9.6.8/firebase-firestore.js";
                                                            // TODO: Add SDKs for Firebase products that you want to use
                                                            // https://firebase.google.com/docs/web/setup#available-libraries
                                                            
                                                            // Your web app's Firebase configuration
                                                            // For Firebase JS SDK v7.20.0 and later, measurementId is optional
                                                            const firebaseConfig = {
                                                                apiKey: "AIzaSyAN-hSy8cWKUKJS4SxjNcN9lrmvZPTy430",
                                                                authDomain: "booking-app-6750f.firebaseapp.com",
                                                                databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
                                                                projectId: "booking-app-6750f",
                                                                storageBucket: "booking-app-6750f.appspot.com",
                                                                messagingSenderId: "687482685582",
                                                                appId: "1:687482685582:web:a91f903ce5133c4f5aa1df",
                                                                measurementId: "G-0WDDDKD9ZL"
                                                                };
                                                            
                                                            // Initialize Firebase
                                                            const app = initializeApp(firebaseConfig);
                                                            const analytics = getAnalytics(app);
                                                            const auth = getAuth();  
                                                            const db = getDatabase(); 
                                
                                                            console.log(auth);
                                                            let updates = {};
                                
                                                            onAuthStateChanged(auth, (user) => {
                                                                if(user){
                                                                    console.log(user);
                                                                    let status = document.createElement('h2');
                                                                    status.innerText = 'Driver is Present.';
                                                                    let driverRef = ref(db, 'bookedDrivers/`+drsearchData.driverName+`');
                                                                    onValue(driverRef, (snapshot) => {
                                                                        let data = snapshot.val();
                                                                        console.log(data.currentUser);
                                                                        if(data.currentUser == user.uid && data.driverPresent == null){
                                                                            document.getElementById('present').style.display = 'block';
                                                                        } else if(data.driverId == user.uid && data.driverPresent == 'True'){
                                                                            let status = document.createElement('h2');
                                                                            status.innerText = 'Your presence is confirmed.';
                                                                            document.getElementById('bookingInfo').appendChild(status);
                                                                        } else if(data.currentUser == user.uid && data.driverPresent == 'True'){
                                                                           
                                                                            document.getElementById('bookingInfo').appendChild(status);
                                                                        }
                                                                    });
                                                                    document.getElementById('present').addEventListener('click', function(){
                                                                        console.log('Present!');
                                                                        updates['bookedDrivers/`+drsearchData.driverName+`/driverPresent'] = "True";
                                                                        update(ref(db), updates);
                                                                        let presentBtn = document.getElementById('present');
                                                                        presentBtn.remove();
                                                                        document.getElementById('bookingInfo').appendChild(status);
                                                                    });
                                                                }
                                                            })
                                                        </script>
                                                            
                                                            <script type="text/javascript">!function(n,e){var t,o,i,c=[],f={passive:!0,capture:!0},r=new Date,a="pointerup",u="pointercancel";function p(n,c){t||(t=c,o=n,i=new Date,w(e),s())}function s(){o>=0&&o<i-r&&(c.forEach(function(n){n(o,t)}),c=[])}function l(t){if(t.cancelable){var o=(t.timeStamp>1e12?new Date:performance.now())-t.timeStamp;"pointerdown"==t.type?function(t,o){function i(){p(t,o),r()}function c(){r()}function r(){e(a,i,f),e(u,c,f)}n(a,i,f),n(u,c,f)}(o,t):p(o,t)}}function w(n){["click","mousedown","keydown","touchstart","pointerdown"].forEach(function(e){n(e,l,f)})}w(n),self.perfMetrics=self.perfMetrics||{},self.perfMetrics.onFirstInputDelay=function(n){c.push(n),s()}}(addEventListener,removeEventListener);</script>
                                                        </div>
                                                    </main>
                                                        </div>
                                                    </div>
                                                </div>
                                            </body>
                                            </html>`
                                            fs.writeFileSync(filePath, contents);
                                            let bucket = getStorage().bucket();
                                            bucket.upload(filePath, {destination, public:true, metadata:{cacheControl: 'public, max-age=60'}});
    

                        }
                    
                    }
                }, {
                    onlyOnce: true
                });

            
        }
    }
})

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
    res.sendFile(path.join(__dirname, '/signup.html'));
    res.sendFile(path.join(__dirname, '/login.html'));
    res.sendFile(path.join(__dirname, '/UserAccount.html'));
    res.sendFile(path.join(__dirname, '/css/material-kit.css'));
    res.sendFile(path.join(__dirname, '/checkout.html'));
    res.sendFile(path.join(__dirname, '/drvlogin.html'));
    res.sendFile(path.join(__dirname, '/drive.html'));
    res.sendFile(path.join(__dirname,'/img/e3420969-2cfb-4cf8-8946-5083af5a915b.jpg'));
    res.sendFile(path.join(__dirname,'/img/f73312aa-cf2b-4e47-896d-d727e6d70ec5.jpg'));
    res.sendFile(path.join(__dirname,'img/f73312aa-cf2b-4e47-896d-d727e6d70ec5.jpg'));
    res.sendFile(path.join(__dirname,'/img/e3420969-2cfb-4cf8-8946-5083af5a915b.jpg'));
    res.sendFile(path.join(__dirname,'/img/2b14229b-02f3-4dd3-8923-21e28975e600.jpg'));
    res.sendFile(path.join(__dirname,'/img/28e615a5-4cef-4df9-87db-bb46fd206a30.jpg'));
    res.sendFile(path.join(__dirname,'/img/93eb5c84-7d64-442d-bfdc-2d7495b308c5.jpg'));
    res.sendFile(path.join(__dirname,'/img/204a45e9-24d9-4701-b4f3-cf109b168637.jpg'));
    res.sendFile(path.join(__dirname,'/img/a0289f1a-b448-4ec7-b8d5-ebbc4b25492d.jpg'));
    res.sendFile(path.join(__dirname,'img/a506bc65-344d-456d-95ab-d95e8f2ecddc.jpg'));
    res.sendFile(path.join(__dirname,'/img/2e335617-544a-49b6-b856-f251e5615ac9.jpg'));
    res.sendFile(path.join(__dirname,'/img/bd6f6723-2ee9-4845-9b9a-e87d1345b345.jpg'));
    res.sendFile(path.join(__dirname,'/img/fa7aef72-6466-461a-b47c-a44960394cf7.jpg'));
    res.sendFile(path.join(__dirname,'/img/a48e12a0-c932-4bae-bc50-cd52a6948b58.jpg'));
    res.sendFile(path.join(__dirname,'/img/89184f79-a27a-418d-9635-95418bb73b4a.jpg'));
    res.sendFile(path.join(__dirname,'/img/574d9408-6a61-46c9-aeef-175417bd6cee.jpg'));
    res.sendFile(path.join(__dirname,'/img/da032bb6-db3f-4823-a297-95bf9750fbed.jpg'));
    res.sendFile(path.join(__dirname,'/img/06b1ebbf-f49e-4701-8444-bc8db0f4a638.jpg'));
    res.sendFile(path.join(__dirname,'/img/fc56fd06-37dd-49d8-ba9f-79b69bd8a61b.jpg'));
    res.sendFile(path.join(__dirname,'/img/2b3ca510-a22d-436f-914b-66930527aaf4.jpg'));
    res.sendFile(path.join(__dirname,'/img/a506bc65-344d-456d-95ab-d95e8f2ecddc.jpg'));
    res.sendFile(path.join(__dirname,'/server/booking-app-6750f-firebase-adminsdk-h0nzw-3227c0e12b.json'));

    res.sendFile(path.join(__dirname, '/'+serveUrl+'.html'));


    
});

app.post("/upload_files", upload.single('file'), 
    function uploadFiles(req, res){
      //  console.log(req.body);
                    
        res.json({ message: "Successfully uploaded file" });
        let uploads = './uploads/';
        let filepath = path.join(uploads, req.file.filename);
       // console.log(filepath);
        app.get('/', (req, res) => {
            res.sendFile(filepath, { root: __dirname });
        });

        const listingRef = ref(adminDB,'listing/');
        if(listingRef != null){
          //  console.log(listingRef);
            onValue(listingRef, (snapshot) => {
                const data = snapshot.val();
                if(data != null && data.listingType == 'tour'){
                    updates = {};
                    updates['tours/'+data.listingName+'/listingImg'] = filepath;
                    update(ref(adminDB), updates);
                 //   console.log(data);
                    const listingsRef = listingDb.doc(data.listingName);
                    listingsRef.get().then((docSnapshot) => {
                        if(data != null && !docSnapshot.exists){
                        listingDb.doc(data.listingName).set({
                            host: data.host,
                            listingImg: filepath,
                            listingName: data.listingName,
                            listingPrice: data.listingPrice,
                            listingType: data.listingType,
                            originCoord: data.originCoord,
                            destinationCoord: data.destinationCoord,
                            destinationName: data.destinationName,
                            originName: data.originName,
                            itemId: itemId
                        });
                        } 
                    });
                } else if(data != null && (data.listingType == 'room' || data.listingType == 'car')){
                  //  console.log(data);
                    const listingsRef = listingDb.doc(data.listingName);
                    listingsRef.get().then((docSnapshot) => {
                        if(data != null && !docSnapshot.exists){
                            console.log(filepath);
                        listingDb.doc(data.listingName).set({
                            host: data.host,
                            listingImg: filepath,
                            listingName: data.listingName,
                            listingPrice: data.listingPrice,
                            listingType: data.listingType,
                            itemId: itemId,
                            location: data.location
                        });
                        } 
                    });
                }
                
        }, {
           
        });
        }
       
    }
);

// const storage = admin.storage();
// let bucket = storage.bucket('uploads');
// console.log(bucket);


listingDb.onSnapshot((doc) => {
   // console.log(doc);
    let listings = [];
    listingDb.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let listing = doc.data();
            listings.push(listing);
            //console.log(listings.length);

            set(ref(db, 'listings/'), {
                listings
            });
        });
    });
});


profileDb.onSnapshot((doc) => {
    let profiles = [];
    profileDb.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let profile = doc.data();
            profiles.push(profile);
        // console.log(profiles.length);

            set(ref(db, 'profiles/'), {
                profiles
            });
        });
    });
});


//const stripe = require('stripe')('sk_test_51KRid6JhNHZfzXZ6P4Vy6VtppsuokDqbPnbjQbgMyy3GyafwMEmRd2wesd1bgFqMdB02fXux4nnOllhdYbY4ddV200ZlZM1OMC');

app.post('/create-checkout-session', async (req, res) => {
    if(req.headers.cookie != 'undefined'){
        //console.log(req.headers.cookie);
        let storedC = req.headers.cookie+'';
        storedC = storedC.split(';');
        //console.log(storedC);
        let result = [];
        for(let i in storedC){
           // console.log(storedC[i].split('='));
            result.push(storedC[i].split('='));
        }
       // console.log(result);
        for(let i in result){
            if(result[i][0] === 'uid' || result[i][0] === ' uid'){
                userId = result[i][1];
            }
        }
    }
    
    
    // TODO(1): Access item data from db
    let itemRef = ref(db, 'users/userAccount/'+userId+'/itemdata'+today);
            
    onValue(itemRef, (snapshot) => {
        const data = snapshot.val();
        itemName = data.item;
        itemId = data.itemId;
        let idRef = ref(db, 'listings/listings/');
        let drvIdRef = ref(db, 'profiles/profiles/');
        if(data.itemType === 'room' || data.itemType === 'car' || data.itemType === 'tour'){
            onValue(idRef, (snapshot) => {
                const data = snapshot.val();
                for(let i = 0; i < data.length; i++){
                    if(data[i].itemId === itemId){
                        let hostuid = data[i].host;
                        let hostRef = ref(db, 'hosts/hostAccount/'+hostuid+'/stripe/accid');
                        onValue(hostRef, (snapshot) => {
                            accid = snapshot.val();
                        }, {
                            onlyOnce: true
                        });
                    }
                }
            }, {
                onlyOnce: true
            });
        } else {
            onValue(drvIdRef, (snapshot) => {
                const data = snapshot.val();
                for(let i = 0; i < data.length; i++){
                    if(data[i].itemId === itemId){
                        let driveruid = data[i].userId;
                        let driverRef = ref(db, 'drivers/driverAccount/'+driveruid+'/stripe/accid');
                        onValue(driverRef, (snapshot) => {
                            accid = snapshot.val();
                        }, {
                            onlyOnce: true
                        });
                    }
                }
            }, {
                onlyOnce: true
            });
        }
        datesLength = data.datesLength;
        itemPrice = data.itemPrice*100;
        app_fee = 0.15*itemPrice;

       // console.log(itemName);
      //  console.log(datesLength);
    }, {
        onlyOnce: true
    });

    //console.log(itemName);
   // console.log(datesLength);

    if(itemName != null){
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                 
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: itemName,
                    },
                    unit_amount: itemPrice,
                  },
                  quantity: datesLength
                  
                  
                },
              ],
            mode: 'payment',
            success_url: 'https://polar-scrubland-06961.herokuapp.com/success.html',
            cancel_url: 'https://polar-scrubland-06961.herokuapp.com/cancel.html',
            payment_intent_data: {
                application_fee_amount: app_fee,
                transfer_data: {
                    destination: accid
                }
            }
        });
       // console.log(session);
        res.redirect(303, session.url);
       // console.log(res);
    }
   

    app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
        const sig = request.headers['stripe-signature'];
        let event;
    
        try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
    
        switch (event.type) {
           case 'checkout.session.async_payment_failed':
                session = event.data.object;
                // Then define and call a function to handle the event checkout.session.async_payment_failed
               break;
            case 'checkout.session.async_payment_succeeded':
                session = event.data.object;
                // Then define and call a function to handle the event checkout.session.async_payment_succeeded
                break;
            case 'checkout.session.completed':
                session = event.data.object;
                // Then define and call a function to handle the event checkout.session.completed
                break;
            case 'checkout.session.expired':
                session = event.data.object;
                // Then define and call a function to handle the event checkout.session.expired
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    
        response.send();

    });
    
});

app.listen(port);
console.log('Server started at http://localhost:'+port);

// let server = app.listen(port);
// server.on('connection', function(socket){
//     console.log('A new connection was just made by server socket!');
//     socket.setKeepAlive(true, 0)
// })

