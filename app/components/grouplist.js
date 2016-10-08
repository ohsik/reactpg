import React from 'react'
import { Link } from 'react-router'

export default class GroupList extends React.Component {
  constructor() {
    super();
    this.state = {
      listofgroup: []
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let groupList = firebase.database().ref('groups');
        groupList.on("value", snapshot => {
          let listofgroup = [];
          snapshot.forEach((listOfGroup) => {
            listofgroup.push(listOfGroup.val().group_name);
            this.setState({ listofgroup: listofgroup });
          });
        });
      }else{
        console.log('Login to see your follower list(followerlist.js)');
      }
    }.bind(this));
  }
  render() {
    let groupList = this.state.listofgroup.map((groupname) => {
      return <li key={groupname}><Link to={"group/" + groupname}>{groupname}</Link></li>;
    });

    return (
      <div>
        <ul className="follower-list">
          {groupList}
        </ul>
      </div>
    );
  }
}
