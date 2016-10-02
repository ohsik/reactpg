import React from 'react'
import Nav from './nav'

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { userAuth: '' };
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser){
        this.setState({ userAuth: firebaseUser.uid });
        // console.log(this.state);
      }
    });
  }
  render() {
    return (
      <div>
        <Nav />
        <div className="main-wrap" id="content_wrap">
          <h1>{this.props.children.props.route.header}</h1>
          {this.props.children}
        </div>
      </div>
    );
  }
}
