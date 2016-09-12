import React from 'react';
import './firebase.js';
import Login from './login';
import GMap from './gmap';
import SearchBar from './searchbar';
import AddFriends from './addfriends';

// TODO: login.js, google_map_api.js, addfriends.js and friendlist.js
export default class App extends React.Component {
  componentWillMount(){

  }
  render() {
    return (
      <div className="main-wrap" id="content_wrap">
        <h1>What's your Favorite Restaurant?</h1>
        <Login />

        <div className="afterLogin">
          <SearchBar />
          <GMap />
          <AddFriends />
        </div>

      </div>
    );
  }
}
