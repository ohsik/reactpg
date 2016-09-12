import React from 'react';

export default class FriendList extends React.Component {
  componentDidMount () {

    // TODO: get current User and retrieve frined list accordingly
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var rootRef = firebase.database().ref('friends/' + user.uid);
        rootRef.once("value", function(snapshot) {
          var listOfFriends = snapshot.val();
          var friendsListContainer = document.getElementById('friendsList');
          for (var i = 0, len = listOfFriends.length; i < len; i++) {
            var refFavUserInfo = firebase.database().ref('users/' + listOfFriends[i]);

            refFavUserInfo.once('value', function(snapshot) {
              const friendEmail = snapshot.val().user_email;
              var entry = document.createElement('li');
              entry.appendChild(document.createTextNode(friendEmail));
              friendsListContainer.appendChild(entry);
            });

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
