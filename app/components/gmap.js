import React from 'react'

export default class GMap extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var map;
        function initMap() {

          // Create a map object and specify the DOM element for display.
          map = new google.maps.Map(document.getElementById('map'), {
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
          const currentUserID = user.uid;
          var refUserPlace = firebase.database().ref('users/' + currentUserID);

          refUserPlace.on("value", function(snapshot) {
            var followerList = snapshot.val().followers;


            if (followerList !== undefined){

              followerList.push(currentUserID);

              var latlngbounds = new google.maps.LatLngBounds();

              for (var i = 0; i < followerList.length; i++) {
                var rootRef = firebase.database().ref('places/' + followerList[i]);
                const freindUID = followerList[i];

                function addMyMarker(favPlace) {
                  if (freindUID == currentUserID){
                    var image = {
                      url: 'https://firebasestorage.googleapis.com/v0/b/playground-edcc3.appspot.com/o/sharefav.png?alt=media&token=c52066ae-7245-42b2-8755-cce7e89ce487',
                      scaledSize : new google.maps.Size(30, 30)
                    }
                  }
                  marker = new google.maps.Marker({
                    position: new google.maps.LatLng(favPlace.place_lat, favPlace.place_lng),
                    icon: image,
                    map: map
                  });
                }

                // Retrieve new posts as they are added to our database
                rootRef.on("value", function(snapshot) {
                  var favPlace = snapshot.val();
                    if(favPlace !== null){
                    // Assign Geolocation to Google Maps markers
                    addMyMarker(favPlace);

                    // Add infowindow to markers
                    // favPlace show key
                    google.maps.event.addListener(marker, 'click', (function(marker) {
                      return function() {
                        //Get email address of people you follow
                        var refFavUserInfo = firebase.database().ref('users/' + snapshot.key);
                        refFavUserInfo.on('value', function(snapshot) {
                          const followingEmail = snapshot.val().user_email;
                          // Info window
                          infowindow.setContent('<div class="infowindow"><h2>' + followingEmail + '</h2><h3>' + favPlace.place_name + '</h3><p>' + favPlace.place_address + '</p><p>' + favPlace.place_phone + '</p> <div class="info_btn"><a href="' + favPlace.place_website + '" target="_blank" class="btn cta">Visit Website</a> <a href="' + favPlace.place_url + '" target="_blank" class="btn cta">See it on Google Map</a></div></div>');
                          infowindow.open(map, marker);
                        });
                      }
                    })(marker));

                    latlngbounds.extend(marker.getPosition());
                    map.fitBounds(latlngbounds);

                  } else {
                    console.log('Save your favorite place.');
                  }
                }, function (errorObject) {
                  console.log("The read failed: " + errorObject.code);
                });
              }

            }else{
              console.log('Nothing to load cause u have no followings but showing your favorite place if you saved one');

              var rootRef = firebase.database().ref('places/' + user.uid);

              rootRef.on("value", function(snapshot) {
                var favPlace = snapshot.val();
                // console.log(favPlace);
                if(favPlace !== null){

                  var image = {
                    url: 'https://firebasestorage.googleapis.com/v0/b/playground-edcc3.appspot.com/o/sharefav.png?alt=media&token=c52066ae-7245-42b2-8755-cce7e89ce487',
                    scaledSize : new google.maps.Size(50, 50)
                  }
                  marker = new google.maps.Marker({
                    position: new google.maps.LatLng(favPlace.place_lat, favPlace.place_lng),
                    map: map,
                    icon: image
                  });

                  google.maps.event.addListener(marker, 'click', (function(marker) {
                    return function() {
                      //Get email address of people you follow
                      var refFavUserInfo = firebase.database().ref('users/' + snapshot.key);
                      refFavUserInfo.on('value', function(snapshot) {
                        const followingEmail = snapshot.val().user_email;
                        // Info window
                        infowindow.setContent('<div class="infowindow"><h2>' + followingEmail + '</h2><h3>' + favPlace.place_name + '</h3><p>' + favPlace.place_address + '</p><p>' + favPlace.place_phone + '</p> <div class="info_btn"><a href="' + favPlace.place_website + '" target="_blank" class="btn cta">Visit Website</a> <a href="' + favPlace.place_url + '" target="_blank" class="btn cta">See it on Google Map</a></div></div>');
                        infowindow.open(map, marker);
                      });
                    }
                  })(marker));

                  var latLng = marker.getPosition();
                  map.setCenter(latLng);

                }else{
                  console.log('Please Add your favorite restaurant! You can only have One at a time :)');
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

            // Add a save button
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
      rootRef.set(userPlaceData);
      location.reload();
    }
  }
  render() {
    return (
      <div className="gmap" id="map">
      </div>
    );
  }
}
