//https://www.youtube.com/watch?v=IR6smI_YJDE
// http://benignware.github.io/jquery-placepicker/
// https://github.com/ubilabs/geocomplete
import React from 'react';
import $ from 'jquery';

export default class SearchBar extends React.Component {
  render() {
    return (
      <div>
        <input id="pac-input" placeholder="Enter your address" type="text" className="search"></input>
      </div>
    );
  }
}

$('.search').hide();
