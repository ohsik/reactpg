// https://www.youtube.com/watch?v=IR6smI_YJDE
// http://benignware.github.io/jquery-placepicker/
// https://github.com/ubilabs/geocomplete
// https://www.youtube.com/watch?v=gL-jNk8SzUo
import React from 'react';

export default class SearchBar extends React.Component {
  render() {
    return (
      <div>
        <input id="pac-input" placeholder="Start typing the name of restaurant" type="text" className="search"></input>
      </div>
    );
  }
}
