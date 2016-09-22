//https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete

// TODO: get data by loggedin user_id
// Make currentUser work

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    function initMap() {

      // Create a map object and specify the DOM element for display.
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.0778738, lng: -118.3780315},
        zoom: 10
      });

      var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));

      var autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', map);

      var infowindow = new google.maps.InfoWindow();
      var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });
      // User is signed in.
      console.log('My user_id(google_maps_api): ' + user.uid + ' / ' + user.email);


      var refUserPlace = firebase.database().ref('friends/' + user.uid);

      refUserPlace.once("value", function(snapshot) {
        console.log('Friends List(google_maps_api): ' + snapshot.val());

        // TODO: look up favorite places by user_id
        //       line 41 should be updated with places from loggedin users friends list
        if (snapshot.val() !== null){
          var latlngbounds = new google.maps.LatLngBounds();
          var rootRef = firebase.database().ref('places');
          // Retrieve new posts as they are added to our database
          rootRef.on("child_added", function(snapshot, prevChildKey) {
            var favPlace = snapshot.val();
            // Assign Geolocation to Google Maps markers
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(favPlace.place_lat, favPlace.place_lng),
              map: map
            });

            // Add infowindow to markers
            // favPlace show key
            google.maps.event.addListener(marker, 'click', (function(marker) {
              return function() {
                //Get email address of friends
                var refFavUserInfo = firebase.database().ref('users/' + snapshot.key);
                refFavUserInfo.once('value', function(snapshot) {
                  const friendEmail = snapshot.val().user_email;
                  // Info window
                  infowindow.setContent('<div class="infowindow"><h2>' + friendEmail + '</h2><h3>' + favPlace.place_name + '</h3><p>' + favPlace.place_address + '</p><p>' + favPlace.place_phone + '</p> <div class="info_btn"><a href="' + favPlace.place_website + '" target="_blank" class="btn">Visit Website</a> <a href="' + favPlace.place_url + '" target="_blank" class="btn">See it on Google Map</a></div></div>');
                  infowindow.open(map, marker);
                });
              }
            })(marker));

            latlngbounds.extend(marker.getPosition());
            map.fitBounds(latlngbounds);

          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          });

        }else{
          console.log('nothing to load cause u have no friends but showing your favorite place if you saved one');

          var rootRef = firebase.database().ref('places/' + user.uid);

          rootRef.once("value", function(snapshot) {
            var favPlace = snapshot.val();
            // console.log(favPlace);
            if(favPlace !== null){

              var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(favPlace.place_lat, favPlace.place_lng),
                map: map,
                icon: image
              });

              google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                  //Get email address of friends
                  var refFavUserInfo = firebase.database().ref('users/' + snapshot.key);
                  refFavUserInfo.once('value', function(snapshot) {
                    const friendEmail = snapshot.val().user_email;
                    // Info window
                    infowindow.setContent('<div class="infowindow"><h2>' + friendEmail + '</h2><h3>' + favPlace.place_name + '</h3><p>' + favPlace.place_address + '</p><p>' + favPlace.place_phone + '</p> <div class="info_btn"><a href="' + favPlace.place_website + '" target="_blank" class="btn">Visit Website</a> <a href="' + favPlace.place_url + '" target="_blank" class="btn">See it on Google Map</a></div></div>');
                    infowindow.open(map, marker);
                  });
                }
              })(marker));

              var latLng = marker.getPosition();
              map.setCenter(latLng);

            }else{
              console.log('Please Add your favorite restaurant! You can only have on at a time.');
            }

          }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          });
        }

      });



      autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setIcon(/** @type {google.maps.Icon} */({
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
          address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        infowindow.setContent('<div class="infowindow"><h2>' + place.name + '</h2><p>' + address + '</p><p><button onClick="save_it()">Save it as your favorite restaurant</button></p></div>');
        infowindow.open(map, marker);

        // test | add a save button
        var userPlace = place;
        window.save_it = function(){
          saveFavoritePlace(userPlace);
        }

      }); //autocomplete

    } //initMap
    initMap();

  } else {
    // No user is signed in.
    console.log('Please signin to start!');
  }
});

function saveFavoritePlace (userPlace){
  // Get current user_id
  const currentUser = firebase.auth().currentUser.uid;
  var rootRef = firebase.database().ref('places/' + currentUser);
  var userPlaceData = {
      google_place_id: userPlace.id,
      place_name: userPlace.name || null,
      place_address: userPlace.formatted_address || null,
      place_phone: userPlace.formatted_phone_number || null,
      place_website: userPlace.website || null,
      place_url: userPlace.url || null,
      place_lat: userPlace.geometry.location.lat(),
      place_lng: userPlace.geometry.location.lng()
  }
  // Save data in Firebase DB
  rootRef.set(userPlaceData);
}
