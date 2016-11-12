import React from 'react'
import GroupMembers from './groupmembers'

export default class Group extends React.Component {
  constructor () {
    super()
    this.state = {
      currentGroupID: '',
      user_email: '',
      errorMsg: ''
    }
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let groupRef = firebase.database().ref('groups');
        groupRef.orderByChild("group_name").equalTo(this.props.routeParams.group).on("value", (snapshot) => {
          let groupID = Object.keys(snapshot.val()).toString();
          console.log(groupID);
          this.setState({
            currentGroupID: groupID
          });
        });
      }
    }.bind(this));
  }
  userEmail(event) {
    this.setState({ user_email: event.target.value });
  }
  addUser() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if(this.state.user_email !== ''){
          let targetGroupID = this.state.currentGroupID;
          const addUserRef = firebase.database().ref('groups/' + targetGroupID);

          addUserRef.once('value', (snapshot) => {
            let existingMebers = snapshot.val().group_members;
            let enteredUser = this.state.user_email;
            enteredUser.toLowerCase();

            const getUserID = firebase.database().ref('users');
            getUserID.orderByChild("user_email").equalTo(enteredUser).on("value", (snapshot) => {
              if (snapshot.val() !== null) {
                let enteredUserID = Object.keys(snapshot.val()).toString();
                const enteredUserRef = firebase.database().ref(`users/${enteredUserID}`);

                if (existingMebers === undefined){
                  addUserRef.child('group_members').set([enteredUserID]);
                  enteredUserRef.child("user_groups").set([targetGroupID]);
                  this.setState({
                    errorMsg: 'The first member added!',
                    user_email: ''
                  });
                }else{

                  let alreadyAMember = existingMebers.indexOf(enteredUserID);
                  if (alreadyAMember < 0) {
                    existingMebers.push(enteredUserID);
                    addUserRef.child('group_members').set(existingMebers);
                    this.setState({
                      errorMsg: 'Member added! (' + enteredUserID + ')',
                      user_email: ''
                    });

                  }else{
                    // TODO: below error message shows up even after saving data successfully(excuting a furation above)
                    console.log('Already a member of this group.');
                    this.setState({
                      errorMsg: 'Already a member of this group.'
                    });
                  }

                }
              }else{
                console.log(enteredUser + ' is not a member. Wanna send an invite?');
                this.setState({
                  errorMsg: <div>{enteredUser} is not a memeber here. <a href={"mailto:" + enteredUser + "?subject=An Invitation to share your favorites&body=Hello there, your friend wants to share her/his favorites with you. Please join sharefav.com to start!"}>Wanna send an invite?</a></div>
                });
              }
            });
          });

        }else{
          console.log('Please enter email address');
          this.setState({
            errorMsg: 'Please enter email address'
          });
        }
      } else {
        console.log('Please signin to start. group.js');
      }
    }.bind(this));;
  }
  render() {
    return (
      <div className="container container--xs">
        <h2>{this.props.routeParams.group}</h2>
        <input type="text" className="search" placeholder="Enter mail address" value={this.state.user_email} onChange={this.userEmail.bind(this)} required />
        <div className="error-msg">{this.state.errorMsg}</div>
        <button onClick={this.addUser.bind(this)} className="btn btn--full">Add Member</button>

        <GroupMembers groupName={this.props.routeParams.group} />
      </div>
    );
  }
}
