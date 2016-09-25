import React from 'react';

export default class FollowingList extends React.Component {
  componentWillMount () {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var FollowerList = firebase.database().ref('users/' + user.uid);
        FollowerList.once("value", function(snapshot) {
          var listOfFollower = snapshot.val().followers;

          if (listOfFollower !== undefined) {
            var follwerListContainer = document.getElementById('followingList');
            for (var i = 0; i < listOfFollower.length; i++) {
              var follwerEmail = firebase.database().ref('users/' + listOfFollower[i]);
              follwerEmail.once("value", function(snapshot) {
                var entry = document.createElement('li');
                entry.appendChild(document.createTextNode(snapshot.val().user_email));
                follwerListContainer.appendChild(entry);
              });
            }
          }else{
            console.log('You have no follower yet');
          }
        });
      } else {
        console.log('Login to see your follower list(followerlist.js)');
      }
    });
  }
  render() {
    return (
      <div>
        <ul className="follower-list" id="followingList">
        </ul>
      </div>
    );
  }
}
