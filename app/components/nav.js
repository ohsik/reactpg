import React from 'react'
import { IndexLink, Link } from 'react-router'

export default class Nav extends React.Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      const followLink = document.getElementById('follow_link');
      const profileLink = document.getElementById('profile_link');

      if(firebaseUser){
        followLink.classList.remove('hide');
        profileLink.classList.remove('hide');
      } else {
        followLink.classList.add('hide');
        profileLink.classList.add('hide');
      }
    });
  }
  render() {
    return (
      <header>
        <nav className="nav">
          <li>
            <IndexLink to="/" activeClassName="active">ShareFav</IndexLink>
          </li>
          <li>
            <Link to="/follow" activeClassName="active" id="follow_link">Follow</Link>
          </li>
          <li>
            <Link to="/profile" activeClassName="active" id="profile_link">Profile</Link>
          </li>
        </nav>
      </header>
    );
  }
}
