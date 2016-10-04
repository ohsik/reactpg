import React from 'react'
import FollowingList from './followinglist'

export default class AddFollower extends React.Component {
  addFollower() {
    if (this.followEamilAddress.value !== '') {
      // TODO: - add email validation
      const currentUser = firebase.auth().currentUser.uid;
      const friendEmail = this.followEamilAddress.value;
      friendEmail.toLowerCase();
      const lookUpFriend = firebase.database().ref('users');

      lookUpFriend.orderByChild("user_email").equalTo(friendEmail).on("value", function(snapshot){
        if (snapshot.val() !== null){
          let addedFollowerUID = Object.keys(snapshot.val()).toString();

          if (currentUser !== addedFollowerUID){
            const saveFollower = firebase.database().ref('users/' + currentUser);
            saveFollower.once('value', function(snapshot) {
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
                    console.log('Already following!');
                  }
                }
            });
          } else {
            console.log('Can not follow yourself.');
          }

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
      <div className="container container--xs">
        <input type="email" className="search" placeholder="Enter friend's email address" ref={(ref) => this.followEamilAddress = ref} required />
        <button onClick={this.addFollower.bind(this)} className="btn btn--full">Follow</button>
        <FollowingList />
      </div>
    );
  }
}
