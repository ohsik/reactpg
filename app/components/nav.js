import React from 'react'
import { IndexLink, Link } from 'react-router'

export default class Nav extends React.Component {
  constructor() {
    super();
    this.state = {
      user_role: ''
     };
  }
  // TODO: Warning: setState(...): Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the undefined component.
  componentDidMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      const topHeader = document.getElementById('top_header');
      if(firebaseUser){
        const myRef = firebase.database().ref("users/" + firebaseUser.uid);
        myRef.once('value', snapshot => {
          this.setState({
            user_role: snapshot.val().user_role
          });
        });
        topHeader.classList.remove('hide');
      } else {
        topHeader.classList.add('hide');
      }
    });
  }
  render() {
    return (
      <header id="top_header">
        <nav className="nav">
          <li>
            <IndexLink to="/" activeClassName="active">
              <img src="https://firebasestorage.googleapis.com/v0/b/playground-edcc3.appspot.com/o/sharefav.svg?alt=media&token=01e51028-4ce9-4766-9cbd-0e7649272320" width="20" />
            </IndexLink>
          </li>
          <li id="fav_map">
            <Link to="/map" activeClassName="active">Fav Restaurants</Link>
          </li>
          <li id="follow_link">
            <Link to="/follow" activeClassName="active">Follow</Link>
          </li>
          <li id="profile_link">
            <Link to="/profile" activeClassName="active">Profile</Link>
          </li>
        </nav>
      </header>
    );
  }
}
