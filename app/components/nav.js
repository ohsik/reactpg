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
      const favMap = document.getElementById('fav_map');
      const followLink = document.getElementById('follow_link');
      const profileLink = document.getElementById('profile_link');

      if(firebaseUser){
        const myRef = firebase.database().ref("users/" + firebaseUser.uid);
        myRef.once('value', snapshot => {
          this.setState({
            user_role: snapshot.val().user_role
          });
        });

        favMap.classList.remove('hide');
        followLink.classList.remove('hide');
        profileLink.classList.remove('hide');
      } else {
        favMap.classList.add('hide');
        followLink.classList.add('hide');
        profileLink.classList.add('hide');
      }
    });
  }
  render() {
    let groupLink = this.state.user_role === 99 ? <li><Link to="/group" activeClassName="active">Group</Link></li> : '' ;

    return (
      <header>
        <nav className="nav">
          <li>
            <IndexLink to="/" activeClassName="active">
              <img src="https://firebasestorage.googleapis.com/v0/b/playground-edcc3.appspot.com/o/sharefav-w.svg?alt=media&token=4f9bc7c7-8ada-48c9-96f3-d2ee176468aa" width="20" />
            </IndexLink>
          </li>
          <li id="fav_map">
            <Link to="/map" activeClassName="active">Fav Restaurant</Link>
          </li>
          <li id="follow_link">
            <Link to="/follow" activeClassName="active">Follow</Link>
          </li>
          <li id="profile_link">
            <Link to="/profile" activeClassName="active">Profile</Link>
          </li>
          {groupLink}
        </nav>
      </header>
    );
  }
}
