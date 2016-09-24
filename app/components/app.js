import React from 'react'

export default class App extends React.Component {
  componentWillMount(){

  }
  render() {
    return (
      <div className="main-wrap" id="content_wrap">
        <h1>What's your favorite restaurant?</h1>
        {this.props.children}
      </div>
    );
  }
}
