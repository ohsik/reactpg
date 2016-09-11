import React from 'react';

export default class FriendList extends React.Component {
  componentWillMount () {
    
    // TODO: get current User and retrieve frined list accordingly
    var rootRef = firebase.database().ref('users');
    rootRef.once("value", function(snapshot) {
      var data = snapshot.val();
      console.log(data);
    });
  }
  render() {
    return (
      // TODO: Load from DB
      <div>
        <ul className="friend-list">
          <li>Friend List 1</li>
          <li>Friend List 2</li>
          <li>Friend List 3</li>
        </ul>
      </div>
    );
  }
}
