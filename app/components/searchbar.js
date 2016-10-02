import React from 'react';

export default class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = { place_name: '', place_address: '' };
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var placeRef = firebase.database().ref('places/' + user.uid);
        placeRef.once('value', snapshot => {
          if (snapshot.val() !== null){
            // TODO: if current user has a favorite place addBar becomes null.
            const addBar = document.getElementById('pac-input');
            const myPlace = document.getElementById('myPlace');
            addBar.classList.add('hide');
            myPlace.classList.remove('hide');
            this.setState({ place_name: snapshot.val().place_name, place_address: snapshot.val().place_address });
          }else{
            const addBar = document.getElementById('pac-input');
            addBar.classList.remove('hide');
          }
        });
      }
    }.bind(this));
  }
  changePlace() {
    const addBar = document.getElementById('pac-input');
    const myPlace = document.getElementById('myPlace');
    addBar.classList.remove('hide');
    myPlace.classList.add('hide');
  }
  render() {
    let myPlace = <div id="myPlace" className="myplace hide"><b>{this.state.place_name}</b> ({this.state.place_address}) <span onClick={this.changePlace.bind(this)} className="remove-follower">Change</span></div>;
    return (
      <div>
        {myPlace}
        <input id="pac-input" placeholder="Add your favorite restaurant by typing the name of restaurant" type="text" className="hide"></input>
      </div>
    );
  }
}
