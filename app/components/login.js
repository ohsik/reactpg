import React from 'react'
import './firebase.js'
import { hashHistory } from 'react-router'

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMsg: ''
    };
  }
  signinUser() {
    const email = document.getElementById('user_email').value;
    const password = document.getElementById('user_password').value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => {
      this.setState({
        errorMsg: e.message
      });
      console.log(e.message);
    });
  }
  signupUser() {
    // https://gist.github.com/sararob/331760829a9dcb4be3e7
    // 0 - GUEST
    // 10 - USER
    // 20 - MODERATOR
    // 99 - ADMINISTRATOR

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
          user_profile_pic: '',
          user_groups: [],
          user_role: '10'
        }
      rootRef.set(userInfo);
    });
    promise.catch(e => {
      this.setState({
        errorMsg: e.message
      });
      console.log(e.message);
    });
  }
  componentDidMount(){
    // TODO: this can't select DOM element
    // Say greeting after login
    const logWrap = document.getElementById('login_wrap');
    const logoutBtn = document.getElementById('user_logout');

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        console.log('My email(login.js): ' + firebaseUser.email);
        hashHistory.push('/map');

        // Visual
        logWrap.classList.add('hide');
        logoutBtn.classList.remove('hide');
      } else {
        console.log('Please login to start login.js');
        logWrap.classList.remove('hide');
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
      <div>
        <p className="t-c">Share your favorites & see all your frineds favorites at one place</p>
        <p className="t-c color-primary">- Now open for favorite restaurants -</p>
        <div className="container container--xs">
          <div id="login_wrap" className="t-c">
            <input placeholder="Email" type="email" id="user_email"></input>
            <input placeholder="Password" type="password" id="user_password"></input>

            <div className="error-msg">{this.state.errorMsg}</div>

            <button id="user_login" onClick={this.signinUser.bind(this)}>Login</button>
            <button id="user_signup" onClick={this.signupUser.bind(this)}>Create account</button>
          </div>
          <button id="user_logout" onClick={this.logoutUser.bind(this)} className="hide">Logout</button>
        </div>
      </div>
    );
  }
}
