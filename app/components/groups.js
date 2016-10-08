import React from 'react'
import GroupList from './grouplist'

export default class Groups extends React.Component {
  constructor() {
    super();
    this.state = {
      group_name: '',
      group_status: '',
      group_member: [],
      errorMsg: ''
     };
  }
  createGroup() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const currentUser = firebase.auth().currentUser.uid;
        if (currentUser){
          if (this.state.group_name !== ''){
            let groupRef = firebase.database().ref('groups');
            let groupData = {
              group_created_by: currentUser,
              group_name: this.state.group_name,
              group_status: '0',
              group_member: []
            }
            groupRef.once("value", (snapshot) => {
              let groupName = snapshot.val();
              let groupNameArray = [];
              snapshot.forEach((groupname) => {
                groupNameArray.push(groupname.val().group_name);
              });
              let groupExists = groupNameArray.indexOf(this.state.group_name);
              if (groupExists < 0) {
                groupRef.push(groupData);
                console.log('Group created!');
                this.setState({
                  group_name: '',
                  errorMsg: 'Group created!'
                });

              }else{
                console.log('Group already exists. Please try different name.');
                this.setState({
                  errorMsg: 'Group already exists. Please try different name.'
                });
              }
            });
          }else{
            this.setState({
              errorMsg: 'Please enter the name of group!'
            });
          }
        }else{
          console.log('Login to continue! group.js');
        }
      }
    }.bind(this));
  }
  groupName(event) {
    this.setState({ group_name: event.target.value });
  }
  render() {
    return (
      <div className="container container--xs">
        <input type="text" className="search" placeholder="Name of the group" value={this.state.group_name} onChange={this.groupName.bind(this)} required />
        <div className="error-msg">{this.state.errorMsg}</div>
        <button onClick={this.createGroup.bind(this)} className="btn btn--full">Create a Group</button>
        <GroupList />
      </div>
    );
  }
}
