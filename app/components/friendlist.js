import React from 'react';

export default class FriendList extends React.Component {
  componentWillMount () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var friendList = firebase.database().ref('users/' + user.uid);
        friendList.once("value", function(snapshot) {
          var listOfFriends = snapshot.val().friends;

          if (listOfFriends !== undefined) {
            var friendsListContainer = document.getElementById('friendsList');
            for (var i = 0; i < listOfFriends.length; i++) {
              var friendsEmail = firebase.database().ref('users/' + listOfFriends[i]);
              friendsEmail.once("value", function(snapshot) {
                var entry = document.createElement('li');
                entry.appendChild(document.createTextNode(snapshot.val().user_email));
                friendsListContainer.appendChild(entry);
              });
            }
          }else{
            console.log('You have no friends yet');
          }
        });
      } else {
        console.log('Login to see your frined list(friendlist.js)');
      }
    });
  }
  render() {
    return (
      // TODO: Load from DB
      <div>
        <ul className="friend-list" id="friendsList">
        </ul>
      </div>
    );
  }
}
