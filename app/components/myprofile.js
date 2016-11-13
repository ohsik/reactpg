import React from 'react'
import { hashHistory } from 'react-router'
import SearchBar from './searchbar'

export default class MyProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      myUid: '',
      myEmail: '',
      myFirstName: '',
      myLastName: '',
      errorMsg: ''
     };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        const myRef = firebase.database().ref("users/" + firebaseUser.uid);
        myRef.once('value', snapshot => {
          this.setState({
            myUid: firebaseUser.uid,
            myEmail: firebaseUser.email,
            myFirstName: snapshot.val().user_first_name,
            myLastName: snapshot.val().user_last_name
          });
        });
      } else {
        console.log('Please login to start myprofile.js');
      }
    });
  }
  emailChange(event) {
    this.setState({ myEmail: event.target.value });
  }
  fnameChange(event) {
    this.setState({ myFirstName: event.target.value });
  }
  lnameChange(event) {
    this.setState({ myLastName: event.target.value });
  }
  userProfilePic(event) {
    let storageRef = firebase.storage.ref();
    console.log(storageRef);
    return false;
    let fileUpload = document.getElementById("fileUpload");
    console.log(fileUpload);
    fileUpload.on('change', function(evt) {
      console.log('File upload chaged');
      let firstFile = evt.target.file[0]; // get the first file uploaded
      console.log(firstFile);
      let uploadTask = storageRef.put(firstFile);
      uploadTask.on('state_changed', function progress(snapshot) {
         console.log(snapshot.totalBytesTransferred); // progress of upload
      });
    });
  }
  updateProfile(){
    const userRef = firebase.database().ref("users/" + this.state.myUid);
    const userInfo = {
        user_email: this.state.myEmail,
        user_first_name: this.state.myFirstName,
        user_last_name: this.state.myLastName
      }
    userRef.update(userInfo);
    this.setState({
      errorMsg: 'Profile updated!'
    });
  }
  resetPassword() {
    const auth = firebase.auth();
    const emailAddress = this.state.myEmail;
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      // Email sent.
      console.log('Reset password email sent!');
      this.setState({
        errorMsg: 'Reset password email sent!'
      });
    }.bind(this), function(error) {
      // An error happened.
      console.log('Error occurred while sending a reset password email.');
      this.setState({
        errorMsg: 'Error occurred while sending a reset password email.'
      });
    }.bind(this));
  }
  logoutUser() {
    firebase.auth().signOut().then(function() {
      console.log('Signout Success');
      hashHistory.push('/login');
    }, function(error) {
      console.log(error);
    });
  }
  render() {
    return (
      <div className="container container--xs">
        <label>Email</label>
        <input type="email" value={this.state.myEmail} onChange={this.emailChange.bind(this)} placeholder="Email Address" />

        <label>Name</label>
        <div className="row">
          <input type="text" className="col" value={this.state.myFirstName} onChange={this.fnameChange.bind(this)} placeholder="First Name" />
          <input type="text" className="col" value={this.state.myLastName} onChange={this.lnameChange.bind(this)} placeholder="Last Name" />
        </div>

        <label>Profile Picture</label>
        <input id="fileUpload" type="file" onChange={this.userProfilePic.bind(this)} />

        <div className="error-msg">{this.state.errorMsg}</div>
        <button onClick={this.updateProfile.bind(this)} className="btn btn--full">Update Profile</button>
        <div className="t-c">
          <button onClick={this.resetPassword.bind(this)}>Reset Password</button>
          <button id="user_logout" onClick={this.logoutUser.bind(this)}>Logout</button>
        </div>
      </div>
    );
  }
}
