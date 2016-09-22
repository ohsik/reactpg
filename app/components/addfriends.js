import React from 'react'
import FriendList from './friendlist'

export default class AddFriends extends React.Component {
  addFriend() {
    if (this.frinedEamilAddress.value !== '') {

      // TODO: - add email validation and save data to DB
      //       - change email address to Unique user_id eventually
      //       - Make user_id Dynamic (LYcIHjA67cN22TzlCRxUwJbAWUg2)
      //       - If no value in input, don't submit
      // Get current user_id
      const currentUser = firebase.auth().currentUser.uid;
      const rootRef = firebase.database().ref('friends');
      const friendEmail = this.frinedEamilAddress.value;

      // get user_id from email
      var refUserId = firebase.database().ref('users');
      refUserId.once('value', function(snapshot) {
        console.log(snapshot.val());

        for(var i in snapshot.val()) {

            var refUserId = firebase.database().ref('users/' + i);
            refUserId.once('value', function(snapshot) {
                // TODO: add friends
                console.log(snapshot.val().user_email);
                console.log(friendEmail);
                console.log(i);

              if (snapshot.val().user_email == friendEmail){

                  // console.log('Current loggedin user email: ' + snapshot.val().user_email);
                  // console.log('Email added: ' + friendEmail);
                  // // TODO: i is not getting the correct user_id of friendEmail
                  // // NOT WORKING
                  // console.log(i);
                  // const addedFriendUID = i;
                  // const existingFriend = {};
                  // existingFriend[currentUser] = [addedFriendUID];
                  //
                  // // Get current data and add more
                  // rootRef.once("value", function(snapshot) {
                  //   const existingFriends = snapshot.child(currentUser).val();
                  //   // if current user has no friends, add this or add this to exsiting friends
                  //   if (existingFriends == null){
                  //     rootRef.child(currentUser).set([addedFriendUID]);
                  //   }else{
                  //     const newFriends = existingFriends;
                  //     newFriends.push(addedFriendUID);
                  //     rootRef.child(currentUser).set(newFriends);
                  //   }
                  // });

              } else {
                console.log('Email has not registered on the site.');
              }

            });

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
