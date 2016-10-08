import React from 'react'

export default class FollowingList extends React.Component {
  constructor() {
    super();
    this.state = {
      followerEmails: [],
      followersLoaded: false
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let followerList = firebase.database().ref('users/' + user.uid);
        followerList.on("value", snapshot => {
          let listOfFollower = snapshot.val().followers;

          if (listOfFollower !== undefined) {
            this.setState({ followersLoaded: false });

            let loadedFollowers = 0;
            let followerEmails = [];
            let followerRefs = listOfFollower.map((followerId) => {
              return firebase.database().ref(`users/${followerId}`);
            }).forEach((followerRef) => {
              followerRef.once('value', (snapshot) => {
                followerEmails.push(snapshot.val().user_email);
                this.setState({ followerEmails: followerEmails });

                if (++loadedFollowers === listOfFollower.length) {
                  this.setState({ followersLoaded: true });
                }
              });
            });

          }else{
            console.log('You have no followers');
            this.setState({ followerEmails: [], followersLoaded: true });
          }
        });
      } else {
        console.log('Login to see your follower list(followerlist.js)');
      }
    }.bind(this));
  }
  removeFollower(email) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const useRef = firebase.database().ref('users');
        useRef.orderByChild("user_email").equalTo(email).on("value", (snapshot) => {
          let userIdbyEmail = Object.keys(snapshot.val()).toString();
          const removeFollow = firebase.database().ref('users/' + user.uid );
          removeFollow.once('value', (snapshot) => {
            let currentFollwer = snapshot.val().followers;
            if (currentFollwer === undefined){
              this.setState({ followerEmails: [] });
            } else {
              let index = currentFollwer.indexOf(userIdbyEmail);
              if (index > -1) {
                currentFollwer.splice(index, 1);
                removeFollow.child('followers').set(currentFollwer);
              }
            }
          });
        });
      }
    }.bind(this));;
  }
  render() {
    let followerEmails = this.state.followersLoaded ? (this.state.followerEmails.length > 0 ? this.state.followerEmails.map((email) => {
        return <li key={email}>{email} <span onClick={this.removeFollower.bind(this, email)} className="remove-follower">X</span></li>;
    }) : <span>You're not following anyone...</span>) : <span>Loading...</span>;

    return (
      <div>
        <span>{this.state.followersLoaded}</span>
        <ul className="follower-list">
          {followerEmails}
        </ul>
      </div>
    );
  }
}
