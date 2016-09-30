import React from 'react'
import { IndexLink, Link } from 'react-router'

export default class Nav extends React.Component {
  render() {
    return (
      <header>
        <p><b>FavShare</b></p>
        <nav className="nav">
          <IndexLink to="/" activeClassName="active">
            <li>Profile</li>
          </IndexLink>
          <Link to="/map" activeClassName="active">
            <li>Map</li>
          </Link>
          <Link to="/follow" activeClassName="active">
            <li>Follow</li>
          </Link>
        </nav>
      </header>
    );
  }
}
