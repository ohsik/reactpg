//https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
window.initMap = function() {

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.0778738, lng: -118.3780315},
    zoom: 8
  });

  var input = /** @type {!HTMLInputElement} */(document.getElementById('pac-input'));

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });


  // TODO: read id from Firebase DB
  // ------------------------------------------------------------------------------
  var latlngbounds = new google.maps.LatLngBounds();

  var rootRef = firebase.database().ref('favs');

    // Retrieve new posts as they are added to our database
  rootRef.on("child_added", function(snapshot, prevChildKey) {
    var favPlace = snapshot.val();

    // Assign Geolocation to Google Maps markers
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(favPlace.fav_place.lat, favPlace.fav_place.lng),
      map: map
    });

    // Add infowindow to markers
    google.maps.event.addListener(marker, 'click', (function(marker) {
      return function() {
        infowindow.setContent('<div class="infowindow"><h2>' + favPlace.user_email + '</h2><h3>' + favPlace.fav_place.name + '</h3><p>' + favPlace.fav_place.address + '<p>' + favPlace.fav_place.phone + '</p> <a href="' + favPlace.fav_place.website + '" target="_blank" class="btn">Visit Website</a> <a href="' + favPlace.fav_place.url + '" target="_blank" class="btn">See it on Google Map</a></p></div>');
        infowindow.open(map, marker);
      }
    })(marker));

    latlngbounds.extend(marker.getPosition());
    // console.log(latlngbounds);
    map.fitBounds(latlngbounds);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
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
      sayHello(userPlace);
    }

  }); //autocomplete

} //initMap

function sayHello (userPlace){
  var rootRef = firebase.database().ref('favs');

  var userData = {
    user_email: 'o@fabfitfun.com',
    google_place_id: userPlace.id,
    friends: [
    ],
    fav_place: {
      name: userPlace.name || null,
      address: userPlace.formatted_address || null,
      phone: userPlace.formatted_phone_number || null,
      website: userPlace.website || null,
      url: userPlace.url || null,
      lat: userPlace.geometry.location.lat(),
      lng: userPlace.geometry.location.lng()
    }
  }

  // Save data in Firebase DB
  console.log(userData);
  rootRef.push(userData);

}
