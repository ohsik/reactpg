import React from 'react';
import { render } from 'react-dom';
import './style.css';

class HelloWorld extends React.Component {
  render() {
    return <div><h1>Hello World!</h1></div>;
  }
}
render(
  <HelloWorld />,
  document.getElementById('app')
);
