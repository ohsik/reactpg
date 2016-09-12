import React from 'react';

export default class Login extends React.Component {
  signinUser() {
    const email = document.getElementById('user_email').value;
    const password = document.getElementById('user_password').value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => console.log(e.message));
  }
  signupUser() {
    const email = document.getElementById('user_email').value;
    const password = document.getElementById('user_password').value;
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword(email, password).then(function(firebaseUser) {
      //console.log("User " + firebaseUser.uid + " created successfully!");
      const rootRef = firebase.database().ref("users/" + firebaseUser.uid);
      const userInfo = {
          user_email: email,
          user_first_name: '',
          user_last_name: '',
          user_profile_pic: ''
        }
      rootRef.set(userInfo);
    });
    promise.catch(e => console.log(e.message));
  }
  componentDidMount(){
    // TODO: this can't select DOM element
    // Say greeting after login
    const logoutBtn = document.getElementById('user_logout');

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log('My email(login.js):' + firebaseUser.email);
        // remove login form
        logoutBtn.classList.remove('hide');
      } else {
        console.log('not logged in from login.js');
        logoutBtn.classList.add('hide');
      }
    });
  }
  logoutUser() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('Signout Success');
    }, function(error) {
      // An error happened.
      console.log(error);
    });
  }
  render() {
    return (
      <div className="login">
        <input placeholder="Your email" type="text" id="user_email"></input>
        <input placeholder="Your password" type="password" id="user_password"></input>

        <button id="user_login" onClick={this.signinUser.bind(this)}>Signin</button>
        <button id="user_signup" onClick={this.signupUser.bind(this)}>Signup</button>
        <button id="user_logout" onClick={this.logoutUser.bind(this)} className="hide">Logout</button>
      </div>
    );
  }
}