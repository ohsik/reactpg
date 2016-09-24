import React from 'react'
import FriendList from './friendlist'

export default class AddFriends extends React.Component {
  addFriend() {
    if (this.frinedEamilAddress.value !== '') {

      // TODO: - add email validation and save data to DB

      // Get current user_id
      const currentUser = firebase.auth().currentUser.uid;
      const friendEmail = this.frinedEamilAddress.value;
      const lookUpFriend = firebase.database().ref('users');

      lookUpFriend.orderByChild("user_email").equalTo(friendEmail).on("value", function(snapshot){
        if (snapshot.val() !== null){
          var addedFriendUID = Object.keys(snapshot.val()).toString();
          const saveFriend = firebase.database().ref('users/' + currentUser);
          saveFriend.once('value', function(snapshot) {
            const existingFriends = snapshot.val().friends;

            // TODO: if email exist already, don't save it
            if (existingFriends == null){
              saveFriend.child('friends').set([addedFriendUID]);
            }else{
              const addMoreFriends = existingFriends
              addMoreFriends.push(addedFriendUID);
              saveFriend.child('friends').set(addMoreFriends);
            }
          });
        }else{
          console.log('User is not a memeber here... Send her an invite email.');
        }
      });
      this.frinedEamilAddress.value = '';
    }else{
      console.log('Please type your frineds email address');
    }
  }
  render() {
    return (
      <div className="addfriends">
        <input type="text" className="search" placeholder="Enter friend's email address" ref={(ref) => this.frinedEamilAddress = ref} />
        <button onClick={this.addFriend.bind(this)} className="btn">Add friend</button>
        <FriendList />
      </div>
    );
  }
}
