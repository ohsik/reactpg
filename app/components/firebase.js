  // Data Structure
  /*
  - Favorite place by user (places)
    - place_id
      - user_id
      - google place id (google_place_id)
      - place name (place_name)
      - place address (place_address)
      - place phone (place_phone)
      - place website (place_website)
      - place url (place_google_url)
      - place lat (place_lat)
      - place lng (place_lng)

  - Friends list by user (friends)
    - user_id: ['anton@email.com', 'nata@email.com', 'jose@email.com'] (friends)
    - anton: ['ohsik', 'nata']

  - personal data by user for login (users)
    - user_id
      - email address (email)
      - password (password)
      - profile pic (profile_pic)
  */

import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyAOZoeHLYWh6B2-RcwDx1Ik8mcj1Dt95GM",
  authDomain: "playground-edcc3.firebaseapp.com",
  databaseURL: "https://playground-edcc3.firebaseio.com",
  storageBucket: "",
};
firebase.initializeApp(config);
