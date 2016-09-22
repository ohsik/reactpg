import React from 'react'
import GMap from './gmap'
import SearchBar from './searchbar'

export default class MapSearch extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />
        <GMap />
      </div>
    );
  }
}
