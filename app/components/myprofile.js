import React from 'react'
import { hashHistory } from 'react-router'

export default class MyProfile extends React.Component {
  constructor() {
    super();
    this.state = {
      myUid: '',
      myEmail: '',
      myFirstName: '',
      myLastName: ''
     };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        const myRef = firebase.database().ref("users/" + firebaseUser.uid);
        myRef.once('value', snapshot => {
          // console.log(snapshot.val());
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
  //TODO: upload pic function implementation
  updateProfile(){
    const rootRef = firebase.database().ref("users/" + this.state.myUid);
    const userInfo = {
        user_email: this.state.myEmail,
        user_first_name: this.state.myFirstName,
        user_last_name: this.state.myLastName
      }
    rootRef.update(userInfo);
  }
  logoutUser() {
    firebase.auth().signOut().then(function() {
      console.log('Signout Success');
      hashHistory.push('/login')
    }, function(error) {
      console.log(error);
    });
  }
  render() {
    return (
      <div className="container container--xs">
        <form>
          <label>Email</label>
          <input type="email" value={this.state.myEmail} onChange={this.emailChange.bind(this)} placeholder="Email Address" />

          <label>Name</label>
          <div className="row">
            <input type="text" className="col" value={this.state.myFirstName} onChange={this.fnameChange.bind(this)} placeholder="First Name" />
            <input type="text" className="col" value={this.state.myLastName} onChange={this.lnameChange.bind(this)} placeholder="Last Name" />
          </div>

          <label>Profile Picture</label>
          <input type="file" name="img" />

          <label>Reset Password</label>
          <input type="password" placeholder="New Password" />
          <input type="password" placeholder="Re-enter Password" />
          <button onClick={this.updateProfile.bind(this)} className="btn btn--full">Update Profile</button>
        </form>
        <div className="login-wrap">
          <button id="user_logout" onClick={this.logoutUser.bind(this)}>Logout</button>
        </div>
      </div>
    );
  }
}
