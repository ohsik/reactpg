import React from 'react';
import SearchBar from './searchbar';
import GMap from './gmap';
import AddFriends from './addfriends';
import './firebase.js';

export default class App extends React.Component {
  componentWillMount(){
    // Save data to Firebase DB
    this.rootRef = firebase.database().ref('favs');

  }
  render() {
    return (
      <div className="main-wrap" id="content_wrap">
        <h1>What's your Favorite Restaurant?</h1>
        <SearchBar />
        <GMap />
        <AddFriends />
      </div>
    );
  }
}
