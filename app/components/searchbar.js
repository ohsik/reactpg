import React from 'react'

export default class SearchBar extends React.Component {
  constructor() {
    super();
    this.state = {
      place_name: '',
      place_address: '',
      hasPlace: false,
      btnText: ''
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      const myPlaceInfo = document.getElementById('myPlaceInfo');
      const pacInput = document.getElementById('pac-input');

      if (user) {
        var placeRef = firebase.database().ref('places/' + user.uid);
        placeRef.once('value', snapshot => {
          if (snapshot.val() !== null){
            this.setState({
              place_name: snapshot.val().place_name,
              place_address: snapshot.val().place_address,
              hasPlace: true,
              btnText: 'Change'
            });
            myPlaceInfo.classList.remove('hide');
          }else{
            this.setState({
              hasPlace: false
            });
            pacInput.classList.remove('hide');
          }
        });
      }
    }.bind(this));
  }
  changePlace() {
    const myPlaceInfo = document.getElementById('myPlaceInfo');
    const pacInput = document.getElementById('pac-input');

    if(this.state.hasPlace === true){
      this.setState({
        hasPlace: false,
        btnText: 'Cancel'
      });
      myPlaceInfo.classList.add('hide');
      pacInput.classList.remove('hide');
    }else{
      this.setState({
        hasPlace: true,
        btnText: 'Change'
      });
      pacInput.classList.add('hide');
      myPlaceInfo.classList.remove('hide');
    }
  }
  render() {
    let myPlace = <span onClick={this.changePlace.bind(this)} className="change-place">{this.state.btnText}</span>;

    return (
      <div className="container container--small">
        <div className="myplace">
          <div id="myPlaceInfo" className="hide"><b>{this.state.place_name}</b> ({this.state.place_address})</div>
          <input id="pac-input" className="hide" placeholder="Add your favorite restaurant by typing the name of restaurant" type="text"></input>
          {myPlace}
        </div>
      </div>
    );
  }
}
