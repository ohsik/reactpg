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
          user_profile_pic: ''
        }
      rootRef.set(userInfo);
    });
    promise.catch(e => console.log(e.message));
  }
  componentDidMount(){
    // TODO: this can't select DOM element
    const logoutBtn = document.getElementById('user_logout');
    const loginBtn = document.getElementById('user_login');
    const signupBtn = document.getElementById('user_signup');
    const email = document.getElementById('user_email');
    const password = document.getElementById('user_password');

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log(firebaseUser.email + ' loggedin ' + logoutBtn);
        // remove login form
        email.classList.add('hide');
        password.classList.add('hide');
        loginBtn.classList.add('hide');
        signupBtn.classList.add('hide');
        logoutBtn.classList.remove('hide');
      } else {
        console.log('not logged in from login.js');
        email.classList.remove('hide');
        password.classList.remove('hide');
        loginBtn.classList.remove('hide');
        signupBtn.classList.remove('hide');
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
