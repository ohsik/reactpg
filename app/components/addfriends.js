import React from 'react';

export default class AddFriends extends React.Component {
  handleClick() {
    if (this.myTextInput !== null) {
      
      // TODO: add email validation and save data to DB
      var friendEmail = [];
      friendEmail.push(this.myTextInput.value);
      //rootRef.update(friendEmail.friends);

      console.log(friendEmail);
      this.myTextInput.value = '';
    }
  }
  render() {
    return (
      <div>
        <input type="text" className="search" placeholder="Enter friend's email address" ref={(ref) => this.myTextInput = ref} />
        <button onClick={this.handleClick.bind(this)} className="btn">Submit</button>
      </div>
    );
  }
}
