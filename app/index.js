var React = require('react');
var ReactDOM = require('react-dom');
//var css = require("css!./app/style.css");
require('./style.css');

var HelloWorld = React.createClass({
  render: function () {
    return (
      <div><h1>Hello World!</h1></div>
    )
  }
});

ReactDOM.render(
  <HelloWorld />,
  document.getElementById('app')
);

//https://css-tricks.com/css-modules-part-2-getting-started/
