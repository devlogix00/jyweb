const express = require('express');
const path = require('path');
const cors = require('cors');
//const { initializeApp } = require('firebase-admin/app');
//var admin = require("firebase-admin");
//var serviceAccount = require("./server/booking-app-6750f-firebase-adminsdk-h0nzw-3227c0e12b.json")
//const { getDatabase, ref, onValue } = require('firebase/database');
//const { getAuth, onAuthStateChanged, currentUser } = require('firebase/auth');
//const { addDoc, collection, getFirestore, Timestamp, fromDate, orderBy, limit, onSnapshot, query, serverTimestamp, setDoc } = require('firebase/firestore');
const app = express();
const port = process.env.PORT || 8181;
//const stripe = require('stripe')('sk_test_51KRid6JhNHZfzXZ6P4Vy6VtppsuokDqbPnbjQbgMyy3GyafwMEmRd2wesd1bgFqMdB02fXux4nnOllhdYbY4ddV200ZlZM1OMC');
const fetch = require("node-fetch");
app.use(express.urlencoded({extended : true}));
app.use(express.json());

//const endpointSecret =  'whsec_71ed46c7e6c22dbd550a4dadf1404c383d636573c9ba291a47c5f71f5b3f58bc';

app.use(cors({
    'Allow-Access-Control-Origin': '',
}));

app.use(express.static(__dirname));

//const firebase = require('firebase');
//const App = require('firebase/app');
//require('firebase/database');
const bodyParser = require('body-parser');
const { response } = require('express');

// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();

// today = mm + '-' + dd + '-' + yyyy;

// const firebaseConfig = {
//     apiKey: "AIzaSyAN-hSy8cWKUKJS4SxjNcN9lrmvZPTy430",
//     authDomain: "booking-app-6750f.firebaseapp.com",
//     databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com",
//     projectId: "booking-app-6750f",
//     storageBucket: "booking-app-6750f.appspot.com",
//     messagingSenderId: "687482685582",
//     appId: "1:687482685582:web:a91f903ce5133c4f5aa1df",
//     measurementId: "G-0WDDDKD9ZL"
// };
// App.initializeApp(firebaseConfig);

//  admin.initializeApp()

// const auth = getAuth();
// const db = getDatabase();

// let itemName;
// let userId;
// let dates;
// let img;
// let datesLength;
// let stat;

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://booking-app-6750f-default-rtdb.firebaseio.com"
// });

// const database = admin.firestore();
// const usersDb = database.collection('allBookings');
// let timestamp = serverTimestamp();

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
    res.sendFile(path.join(__dirname, '/signup.html'));
    res.sendFile(path.join(__dirname, '/login.html'));
    res.sendFile(path.join(__dirname, '/home.html'));
    res.sendFile(path.join(__dirname, '/analytics.html'));
    res.sendFile(path.join(__dirname, '/css/material-kit.css'));
    
    // res.sendFile(path.join(__dirname,'/img/e3420969-2cfb-4cf8-8946-5083af5a915b.jpg'));
    // res.sendFile(path.join(__dirname,'/img/f73312aa-cf2b-4e47-896d-d727e6d70ec5.jpg'));
    // res.sendFile(path.join(__dirname,'/img/f73312aa-cf2b-4e47-896d-d727e6d70ec5.jpg'));

});

// app.post('/', (req, res) => {
//     const databaseRef = admin.database().ref('users/userAccount/'+userId+'/bookingdata');
//     databaseRef.on('value', (snapshot) => {
//         const data = snapshot.val();
//         if(data != null){
//             try{
//                 if(data.bookingType == 'car'){
//                     addDoc(collection(getFirestore(), 'allBookings'), {
//                         userName: data.userName,
//                         img: data.img,
//                         datesLength: data.datesLength,
//                         bookingDate: data.bookingDate,
//                         bookingType: data.bookingType,
//                         item: data.item,
//                         itemDates: data.itemDates,
//                         itemStatus: data.itemStatus,
//                         driverRequested: data.driverRequested
//                     });  
//                 } else {
//                     addDoc(collection(getFirestore(), 'allBookings'), {
//                         userName: data.userName,
//                         img: data.img,
//                         datesLength: data.datesLength,
//                         bookingDate: data.bookingDate,
//                         bookingType: data.bookingType,
//                         item: data.item,
//                         itemDates: data.itemDates,
//                         itemStatus: data.itemStatus,
//                         driverRequested: data.driverRequested
//                     });
//                 }
                
//             } catch(error){
//                 console.error('Error writing to Firebase Database', error);
//             }
            
//         }
//     });
// });


app.listen(port);
console.log('Server started at http://localhost:'+port);