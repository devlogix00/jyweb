    //Import the functions you need from the SDKs you need
    // import {firebase} from 'firebase';
    // import { initializeApp } from 'firebase/app'; 
    // import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
    
   
    //For Firebase JS SDK v7.20.0 and later, measurementId is optional
    // const firebaseConfig = {
    //   apiKey: "AIzaSyDAE5KMMaSWI8wYkSqmyBMlT9VDIUl2604",
    //   authDomain: "booking-3cb4c.firebaseapp.com",
    //   projectId: "booking-3cb4c",
    //   storageBucket: "booking-3cb4c.appspot.com",
    //   messagingSenderId: "740465077120",
    //   appId: "1:740465077120:web:52f179c4875eae75072f65",
    //   measurementId: "G-B9BPZBWH0B"
    // };

    // const firebase = initializeApp(firebaseConfig);
    // const auth = getAuth();

    let user = {
        name: '',
        email: '',
        password: ''
    }

    function getName(){
      let name = document.getElementById('formname').value;
      user.name = name
      console.log(name);
      //Validate Name
      let flag = false;
      let nameFormat = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if(name === "" && name.match(nameFormat) !== true){
        flag = true;
      }
      if(flag){
        document.getElementById('userFullNameError').style.display = "block";
      }else{
        document.getElementById('userFullNameError').style.display = "none";
      }
    }

    function getEmail(){
      let email = document.getElementById('formemail').value;
      console.log(email);
      user.email = email;
      //Validate Email
      let emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let flag;
      if(email.match(emailFormat)){
        flag = false;
      }else{
        flag = true;
      }
      if(flag){
        document.getElementById('userEmailError').style.display = 'block';
      }else{
        document.getElementById('userEmailError').style.display = 'none';
      }
    }

    function getPassword(){
      let password = document.getElementById('formpassword').value;
      console.log(password);
      user.password = password;
      //Validate Password
      let userPasswordFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}/;      
      let flag;
      if(password.match(userPasswordFormat)){
        flag = false;
      }else{
        flag = true;
      }
      if(flag){
        document.getElementById('userPasswordError').style.display = 'block';
      }else{
        document.getElementById('userPasswordError').style.display = 'none';
      }
    }

    function signUp(){
        console.log(user); 
        localStorage.setItem('user', JSON.stringify(user)); 
        let hrefOrig = "UserAccount.html?user=";
        window.location = hrefOrig + user.name;
        //window.location = './UserAccount';
         
    }

  //   function signIn(){
  //     console.log(user); 
  //     let hrefOrig = "UserAccount.html?user=";
  //     window.location = hrefOrig + user.name;

    
  // }


         