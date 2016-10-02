import React from 'react'
import { IndexLink, Link } from 'react-router'

export default class Nav extends React.Component {
  componentDidMount() {
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
          <IndexLink to="/" activeClassName="active">
            <li><b>App</b></li>
          </IndexLink>
          <Link to="/follow" activeClassName="active" id="follow_link">
            <li>Follow</li>
          </Link>
          <Link to="/profile" activeClassName="active" id="profile_link">
            <li>Profile</li>
          </Link>
        </nav>
      </header>
    );
  }
}
