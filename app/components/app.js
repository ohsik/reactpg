import React from 'react'
import Nav from './nav'

export default class App extends React.Component {
  render() {
    let bigLogo = this.props.children.props.route.cc === 'login' ? <p className="t-c"><img src="https://firebasestorage.googleapis.com/v0/b/playground-edcc3.appspot.com/o/sharefav.svg?alt=media&token=01e51028-4ce9-4766-9cbd-0e7649272320" width="120" /></p> : '' ;
    return (
      <div className={"row " + this.props.children.props.route.cc}>
       <div className="col">
          <Nav />
          <div className="content-wrap" id="content_wrap">
            {bigLogo}
            <h1>{this.props.children.props.route.header}</h1>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
