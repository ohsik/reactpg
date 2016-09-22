import React from 'react'

export default class App extends React.Component {
  componentWillMount(){

  }
  render() {
    return (
      <div className="main-wrap" id="content_wrap">
        {this.props.children}
      </div>
    );
  }
}
