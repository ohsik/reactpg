import React from 'react'
import Nav from './nav'

export default class App extends React.Component {
  render() {
    return (
      <div className="row">
       <div className="col">
          <Nav />
          <div className="content-wrap" id="content_wrap">
            <h1>{this.props.children.props.route.header}</h1>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
