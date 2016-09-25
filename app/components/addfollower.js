import React from 'react'
import FollowingList from './followinglist'

export default class AddFollower extends React.Component {
  addFollower() {
    if (this.followEamilAddress.value !== '') {

      // TODO: - add email validation and save data to DB
      //       - Conver input value to all lowercase

      // Get current user_id
      const currentUser = firebase.auth().currentUser.uid;
      const friendEmail = this.followEamilAddress.value;
      friendEmail.toLowerCase();
      const lookUpFriend = firebase.database().ref('users');

      lookUpFriend.orderByChild("user_email").equalTo(friendEmail).on("value", function(snapshot){
        if (snapshot.val() !== null){
          var addedFollowerUID = Object.keys(snapshot.val()).toString();
          const saveFollower = firebase.database().ref('users/' + currentUser);
          saveFollower.once('value', function(snapshot) {
            const existingFollower = snapshot.val().followers;

            // TODO: if email exist already, don't save it
            if (existingFollower == null){
              saveFollower.child('followers').set([addedFollowerUID]);
            }else{
              const addMoreFollower = existingFollower;
              addMoreFollower.push(addedFollowerUID);
              saveFollower.child('followers').set(addMoreFollower);
            }
          });
        }else{
          console.log('User is not a memeber here... Send her an invite email.');
        }
      });
      this.followEamilAddress.value = '';
    }else{
      console.log('Please type your follows email address');
    }
  }
  render() {
    return (
      <div className="addfollower">
        <input type="text" className="search" placeholder="Enter friend's email address" ref={(ref) => this.followEamilAddress = ref} />
        <button onClick={this.addFollower.bind(this)} className="btn">Follow</button>
        <FollowingList />
      </div>
    );
  }
}
