import React from 'react'

export default class Group extends React.Component {
  constructor () {
    super()
    this.state = {
      currentGroupID: '',
      user_email: '',
      errorMsg: ''
    }
  }
  componentDidMount() {
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
    }.bind(this));;
  }
  userEmail(event) {
    this.setState({ user_email: event.target.value });
  }
  addUser() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if(this.state.user_email !== ''){
          let targetGroupID = this.state.currentGroupID;
          console.log(targetGroupID);
          let addUserRef = firebase.database().ref('groups/' + targetGroupID);
          // TODO: save user to gruop. Save is as array
          addUserRef.child('group_member').set(this.state.user_email);

          console.log('User added!');
          this.setState({
            errorMsg: 'User added!'
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
        <button onClick={this.addUser.bind(this)} className="btn btn--full">Add User</button>
      </div>
    );
  }
}
