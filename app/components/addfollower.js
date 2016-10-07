import React from 'react'
import FollowingList from './followinglist'

export default class AddFollower extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMsg: ''
    };
  }
  addFollower() {
    if (this.followEamilAddress.value !== '') {
      // TODO: - add email validation
      const currentUser = firebase.auth().currentUser.uid;
      const friendEmail = this.followEamilAddress.value;
      friendEmail.toLowerCase();
      const lookUpFriend = firebase.database().ref('users');

      lookUpFriend.orderByChild("user_email").equalTo(friendEmail).on("value", (snapshot) => {
        if (snapshot.val() !== null){
          let addedFollowerUID = Object.keys(snapshot.val()).toString();

          if (currentUser !== addedFollowerUID){
            const saveFollower = firebase.database().ref('users/' + currentUser);
            saveFollower.once('value', (snapshot) => {
              let existingFollower = snapshot.val().followers;
                if (existingFollower === undefined){
                  saveFollower.child('followers').set([addedFollowerUID]);
                }else{
                  let alreadyFollowing = existingFollower.indexOf(addedFollowerUID);
                  if (alreadyFollowing < 0) {
                    var addMoreFollower = existingFollower;
                    addMoreFollower.push(addedFollowerUID);
                    saveFollower.child('followers').set(addMoreFollower);
                  }else{
                    console.log('Already following that user!');
                    this.setState({
                      errorMsg: 'Already following that user!'
                    });
                  }
                }
            });
          } else {
            console.log('Can NOT follow yourself.');
            this.setState({
              errorMsg: 'Can NOT follow yourself.'
            });
          }

        }else{
          console.log(friendEmail + ' is not a memeber here.');
          this.setState({
            errorMsg: <div>{friendEmail} is not a memeber here. <a href={"mailto:" + friendEmail + "?subject=An Invitation to share your favorites&body=Hello there, your friend wants to share her/his favorites with you. Please join sharefav.com to start!"}>Wanna send an invite?</a></div>
          });
        }
      });
      this.followEamilAddress.value = '';
    }else{
      console.log('Please type your friends email address.');
      this.setState({
        errorMsg: 'Please type your friends email address.'
      });
    }
  }
  render() {
    return (
      <div className="container container--xs">
        <input type="email" className="search" placeholder="Enter friend's email address" ref={(ref) => this.followEamilAddress = ref} required />
        <div className="error-msg">{this.state.errorMsg}</div>
        <button onClick={this.addFollower.bind(this)} className="btn btn--full">Follow</button>
        <FollowingList />
      </div>
    );
  }
}
