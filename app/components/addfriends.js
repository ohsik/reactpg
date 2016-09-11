import React from 'react';
import FriendList from './friendlist';

export default class AddFriends extends React.Component {
  addFriend() {
    if (this.frinedEamilAddress !== null) {

      // TODO: - add email validation and save data to DB
      //       - change email address to Unique user_id eventually
      //       - Make user_id Dynamic (LYcIHjA67cN22TzlCRxUwJbAWUg2)
      // Get current user_id
      const currentUser = firebase.auth().currentUser.uid;
      const rootRef = firebase.database().ref('friends');
      const friendEmail = this.frinedEamilAddress.value;

      const existingFriend = {};
      existingFriend[currentUser] = [friendEmail];

      // Get current data and add more
      rootRef.once("value", function(snapshot) {
        const existingFriends = snapshot.child(currentUser).val();
        // if current user has no friends, add this or add this to exsiting friends
        if (existingFriends == null){
          rootRef.child(currentUser).set([friendEmail]);
        }else{
          const newFriends = existingFriends;
          newFriends.push(friendEmail);
          rootRef.child(currentUser).set(newFriends);
        }
      });
      this.frinedEamilAddress.value = '';
    }
  }
  render() {
    return (
      <div>
        <input type="text" className="search" placeholder="Enter friend's email address" ref={(ref) => this.frinedEamilAddress = ref} />
        <button onClick={this.addFriend.bind(this)} className="btn">Add friend</button>
        <FriendList />
      </div>
    );
  }
}
