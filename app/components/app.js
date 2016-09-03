import React from 'react';
import SearchBar from './searchbar';
import GMap from './gmap';

export default class App extends React.Component {
  render() {
    return (
      <div className="main-wrap">
        <h1>Play Ground</h1>
        <SearchBar />
        <GMap />
      </div>
    );
  }
}
