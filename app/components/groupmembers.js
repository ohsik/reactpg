import React from 'react'

export default class GroupMembers extends React.Component {
  constructor() {
    super();
    this.state = {
      currentGroupID: '',
      memberEmails: [],
      memberLoaded: false
    };
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const groupRef = firebase.database().ref('groups');
        groupRef.orderByChild("group_name").equalTo(this.props.groupName).on("value", (snapshot) => {
          if (snapshot.val() !== null){
            let groupID = Object.keys(snapshot.val()).toString();
            this.setState({
              currentGroupID: groupID
            });
          }
        });
      }
    }.bind(this));
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const groupRef = firebase.database().ref('groups');
        groupRef.orderByChild("group_name").equalTo(this.props.groupName).on("value", (snapshot) => {
          if (snapshot.val() !== null){
            let groupID = Object.keys(snapshot.val()).toString();
            this.setState({
              currentGroupID: groupID
            });

            const memberList = firebase.database().ref('groups/' + this.state.currentGroupID);
            memberList.on("value", snapshot => {
              let listOfMember = snapshot.val().group_members;

              if (listOfMember !== undefined) {
                this.setState({ memberLoaded: false });
                let loadedMembers = 0;
                let memberEmails = [];
                let memberRefs = listOfMember.map((memberId) => {
                  return firebase.database().ref(`users/${memberId}`);
                }).forEach((memberRef) => {
                  memberRef.once('value', (snapshot) => {
                    memberEmails.push(snapshot.val().user_email);
                    this.setState({ memberEmails: memberEmails });

                    if (++loadedMembers === listOfMember.length) {
                      this.setState({ memberLoaded: true });
                    }
                  });
                });
              }else{
                console.log('This group has no members.');
                this.setState({ memberEmails: [], memberLoaded: true });
              }
            });
          }
        });
      } else {
        console.log('Login to see your follower list(followerlist.js)');
      }
    }.bind(this));
  }
  removeMember(email) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const useRef = firebase.database().ref('users');
        useRef.orderByChild("user_email").equalTo(email).on("value", (snapshot) => {
          let userIdbyEmail = Object.keys(snapshot.val()).toString();
          const removeFollow = firebase.database().ref('groups/' + this.state.currentGroupID );
          removeFollow.once('value', (snapshot) => {
            let currentMembers = snapshot.val().group_members;

            if (currentMembers === undefined){
              this.setState({ memberEmails: [] });
            } else {
              let index = currentMembers.indexOf(userIdbyEmail);
              if (index > -1) {
                currentMembers.splice(index, 1);
                removeFollow.child('group_members').set(currentMembers);
              } else {
                console.log('This user is not a member of this group. BTW, you should not suppose to see this...');
              }
            }

          });
        });
      }
    }.bind(this));;
  }
  render() {
    let memberEmails = this.state.memberLoaded ? (this.state.memberEmails.length > 0 ? this.state.memberEmails.map((email) => {
        return <li key={email}>{email} <span onClick={this.removeMember.bind(this, email)} className="remove-follower">X</span></li>;
    }) : <span>This group has no members...</span>) : <span>Loading...</span>;

    return (
      <div>
        <span>{this.state.memberLoaded}</span>
        <ul className="follower-list">
          {memberEmails}
        </ul>
      </div>
    );
  }
}
