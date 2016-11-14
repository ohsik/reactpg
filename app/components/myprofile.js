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
      user_profile_pic: '',
      myProfilePicUrl: '',
      profilePicUpload: '',
      errorMsg: ''
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        const myRef = firebase.database().ref("users/" + firebaseUser.uid);

        // show profile pic if exist
        const storageRef = firebase.storage().ref(`user_profile/${firebaseUser.uid}.jpg`);
        storageRef.getDownloadURL().then(url => {
          this.setState({
            myProfilePicUrl: url
          });
        });

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
    let storageRef = firebase.storage().ref(`user_profile/${this.state.myUid}.jpg`);
    let firstFile = event.target.files[0];
    let uploadTask = storageRef.put(firstFile);
    uploadTask.on('state_changed', function progress(snapshot) {
      var progress = Math.ceil((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      this.setState({
        profilePicUpload: progress
      });

      //  TODO: Profile upload pic update profile_url as soon as it's done uploading
      if(this.state.profilePicUpload === 100){
        storageRef.getDownloadURL().then(url => {
          this.setState({
            myProfilePicUrl: url
          });
        });
        const userRef = firebase.database().ref("users/" + this.state.myUid);
        userRef.update({user_profile_pic: this.state.myProfilePicUrl});
        this.setState({
          errorMsg: 'Profile picture uploaded!'
        });
      }
    }.bind(this));
  }
  updateProfile(){
    let storageRef = firebase.storage().ref(`user_profile/${this.state.myUid}.jpg`);
    storageRef.getDownloadURL().then(url => {
      this.setState({
        myProfilePicUrl: url
      });
    });

    const userRef = firebase.database().ref("users/" + this.state.myUid);
    const userInfo = {
        user_email: this.state.myEmail,
        user_first_name: this.state.myFirstName,
        user_last_name: this.state.myLastName,
        user_profile_pic: this.state.myProfilePicUrl
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
    let showProfilePic = this.state.myProfilePicUrl ?  <div className="profile-pic"><img src={this.state.myProfilePicUrl} /></div> : '';
    let showUploadProgress = this.state.profilePicUpload ? <p>Uploading {this.state.profilePicUpload}%</p> : '';
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
        {showProfilePic}
        {showUploadProgress}
        <input type="file" onChange={this.userProfilePic.bind(this)} />

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
