import React from 'react';

export default class SearchBar extends React.Component {
  render() {
    return (
      <div>
        <input id="pac-input" placeholder="Add your favorite restaurant by typing the name of restaurant" type="text"></input>
      </div>
    );
  }
}
